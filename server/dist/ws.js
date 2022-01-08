"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const repository_1 = require("./repository");
let playerIdCounter = 0;
const wsSessions = {};
const todoListSessions = {};
const handleNewClient = (ws, req) => {
    const newPlayerId = playerIdCounter++;
    wsSessions[newPlayerId] = {
        ws: ws,
        joinedTodoListId: undefined
    };
    console.log(`New user joined with id ${newPlayerId}`);
    ws.on('message', (msg) => {
        handleMessage(newPlayerId, JSON.parse(msg));
    });
    ws.on('close', () => {
        userLeave(newPlayerId);
    });
    ws.on('error', () => {
        userLeave(newPlayerId);
    });
};
const initSession = (id) => {
    return new Promise((resolve, reject) => {
        (0, repository_1.getTodoListById)(id).then(res => {
            resolve(res);
        }).catch(err => {
            console.error(err);
            reject(err);
        });
    });
};
const broadCastMessage = (todoListId, msg) => {
    const msgSerializedString = JSON.stringify(msg);
    todoListSessions[todoListId].users
        .forEach((user) => {
        wsSessions[user.id].ws.send(msgSerializedString);
    });
};
const isInSession = (playerId) => {
    return playerId in wsSessions && wsSessions[playerId].joinedTodoListId != null;
};
const addUserToTodoListSession = (todoListId, playerId) => {
    wsSessions[playerId].joinedTodoListId = todoListId;
    todoListSessions[todoListId].users.push({ id: playerId });
};
const userLeave = (playerId) => {
    console.log(`User left ${playerId}`);
    if (playerId in wsSessions) {
        const todoListId = wsSessions[playerId].joinedTodoListId;
        if (todoListId != null && todoListId in todoListSessions) {
            todoListSessions[todoListId].users = todoListSessions[todoListId].users.filter((user) => user.id !== playerId);
            broadCastMessage(todoListId, { command: "user_left", data: { id: playerId } });
            if (todoListSessions[todoListId].users.length === 0) {
                closeTodoList(todoListId);
            }
        }
    }
    delete wsSessions[playerId];
};
const closeTodoList = (id) => {
    if (!(id in todoListSessions)) {
        return;
    }
    console.log(`Closing todoList ${id}`);
    const todoListSession = todoListSessions[id];
    delete todoListSessions[id];
    (0, repository_1.updateTodoList)(id, todoListSession.todoList);
};
const onFatalError = (ws, playerId, reason) => {
    console.log(`Fatal error for playerId ${playerId} reason ${reason}`);
    userLeave(playerId);
    ws.close();
};
// handle message
const handleMessage = (playerId, msg) => {
    const ws = wsSessions[playerId].ws;
    if (msg.command === undefined) {
        return onFatalError(ws, playerId, "No command found");
    }
    else if (msg.command !== "join" && !isInSession(playerId)) {
        return onFatalError(ws, playerId, "Join command is only allowed message");
    }
    if (msg.command === "join") {
        const joinMsg = msg;
        if (isInSession(playerId)) {
            return onFatalError(ws, playerId, "You can only join once");
        }
        const id = joinMsg.id;
        if (!(id in todoListSessions)) {
            return initSession(id).then(todoList => {
                todoListSessions[id] = {
                    users: [],
                    todoList: todoList
                };
                addUserToTodoListSession(id, playerId);
                return ws.send(JSON.stringify({ command: "init", data: todoListSessions[id] }));
            }).catch(err => {
                console.error(err);
            });
        }
        else {
            addUserToTodoListSession(id, playerId);
            ws.send(JSON.stringify({ command: "init", data: todoListSessions[id] }));
            return broadCastMessage(id, { command: "user_joined", data: { id: playerId } });
        }
    }
    const todoListId = wsSessions[playerId].joinedTodoListId;
    ws.send(JSON.stringify({ command: "init", data: todoListSessions[todoListId] }));
    switch (msg.command) {
        case "row_update": {
            const data = msg.data;
            const index = todoListSessions[todoListId].todoList.todoListRows.findIndex((row) => row.id === data.id);
            todoListSessions[todoListId].todoList.todoListRows[index] = data;
            return broadCastMessage(todoListId, msg);
        }
        case "row_delete": {
            const rowId = msg.rowId;
            todoListSessions[todoListId].todoList.todoListRows = todoListSessions[todoListId].todoList.todoListRows.filter((row) => row.id !== rowId);
            return broadCastMessage(todoListId, msg);
        }
        case "row_add": {
            const data = msg.data;
            todoListSessions[todoListId].todoList.todoListRows.push(data);
            return broadCastMessage(todoListId, msg);
        }
        case "title_update": {
            const title = msg.data;
            todoListSessions[todoListId].todoList.title = title;
            return broadCastMessage(todoListId, msg);
        }
        case "description_update": {
            const description = msg.data;
            todoListSessions[todoListId].todoList.description = description;
            return broadCastMessage(todoListId, msg);
        }
        // case "delete_list": {
        //     const listId = (msg as DeleteListMsg).listId;
        //     todoListSessions[todoListId].todoList =  todoListSessions[todoListId].todoList.filter((list: TodoListType) => list.id !== listId);
        //     return broadCastMessage(todoListId, msg);
        // }
    }
};
exports.default = handleNewClient;
// Auto save every 60 seconds
setInterval(() => {
    const keys = Object.keys(todoListSessions);
    for (const key of keys) {
        (0, repository_1.updateTodoList)(key, todoListSessions[key].todoList);
    }
}, 60000);
//# sourceMappingURL=ws.js.map