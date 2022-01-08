import { TodoItemType, TodoListType } from './models/models';
import { updateTodoList, getTodoListById } from './repository';

let playerIdCounter = 0;

interface User {
    id: number;
}

interface Session {
    ws: any;
    joinedTodoListId?: string;
}

interface SessionTodoListType {
    users: User[];
    todoList: TodoListType;
}

const wsSessions : { [id: number]: Session } = {};
const todoListSessions : { [id: string]: SessionTodoListType } = {};

interface Msg {
    command: string;
}
interface InitMsg extends Msg {
    data: SessionTodoListType;
}
interface JoinMsg extends Msg {
    id: string;
}
interface StringUpdateAttributeMsg extends Msg {
    data: string;
}
interface UpdateRowMsg extends Msg {
    data: TodoItemType;
}
interface DeleteRowMsg extends Msg {
    rowId: string;
}
interface AddRowMsg extends Msg {
    data: TodoItemType;
}
interface UserJoinLeftMessage extends Msg {
    data: {id: number}
  }
  interface DeleteListMsg extends Msg {
    listId: string;
}

const handleNewClient = (ws: any, req : object) => {
    const newPlayerId = playerIdCounter++;
    wsSessions[newPlayerId] = {
        ws: ws,
        joinedTodoListId: undefined
    };
    console.log(`New user joined with id ${newPlayerId}`);

    ws.on('message', (msg : string) => {
        handleMessage(newPlayerId, JSON.parse(msg));
    });
    ws.on('close', () => {
        userLeave(newPlayerId);
    });
    ws.on('error', () => {
        userLeave(newPlayerId);
    });
}

const initSession = (id: string) : Promise<TodoListType> => {
    return new Promise((resolve, reject) => {
        getTodoListById(id).then(res => {
            resolve(res);
        }).catch(err => {
            console.error(err);
            reject(err);
        })
    });
}

const broadCastMessage = (todoListId: string, msg : Msg ) => {
    const msgSerializedString : string = JSON.stringify(msg);
    todoListSessions[todoListId].users
        .forEach((user: { id: number; }) => {
            wsSessions[user.id].ws.send(msgSerializedString);
    });
}

const isInSession = (playerId: number) => {
    return playerId in wsSessions && wsSessions[playerId].joinedTodoListId != null;
}

const addUserToTodoListSession = (todoListId: string, playerId: number ) => {
    wsSessions[playerId].joinedTodoListId = todoListId;
    todoListSessions[todoListId].users.push({id: playerId});
}

const userLeave = (playerId: number) => {
    console.log(`User left ${playerId}`);
    if (playerId in wsSessions) {
        const todoListId = wsSessions[playerId].joinedTodoListId;
        if (todoListId != null && todoListId in todoListSessions) {
            todoListSessions[todoListId].users = todoListSessions[todoListId].users.filter((user: any) => user.id !== playerId);
            broadCastMessage(todoListId, {command: "user_left", data: {id: playerId}} as UserJoinLeftMessage);
            if (todoListSessions[todoListId].users.length === 0) {
                closeTodoList(todoListId);
            }
        }
    }
    delete wsSessions[playerId];
}

const closeTodoList = (id: string) => {
    if (!(id in todoListSessions)) {
        return;
    }
    console.log(`Closing todoList ${id}`)
    const todoListSession = todoListSessions[id];
    delete todoListSessions[id];
    updateTodoList(id, todoListSession.todoList);
}

const onFatalError = (ws : WebSocket, playerId: number, reason : string) => {
    console.log(`Fatal error for playerId ${playerId} reason ${reason}`)
    userLeave(playerId);
    ws.close();
}

// handle message
const handleMessage = (playerId : number, msg : Msg) => {
    const ws = wsSessions[playerId].ws;

    if (msg.command === undefined) {
        return onFatalError(ws, playerId, "No command found");
    } else if (msg.command !== "join" && !isInSession(playerId)) {
        return onFatalError(ws, playerId, "Join command is only allowed message");
    }

    if (msg.command === "join") {
        const joinMsg : JoinMsg = msg as JoinMsg;
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
                return ws.send(JSON.stringify({command: "init", data: todoListSessions[id]} as InitMsg));
            }).catch(err => {
                console.error(err);
            });
        } else {
            addUserToTodoListSession(id, playerId);
            ws.send(JSON.stringify({command: "init", data: todoListSessions[id]}));
            return broadCastMessage(id, {command: "user_joined", data: {id: playerId}} as UserJoinLeftMessage);
        }
    }

    const todoListId = wsSessions[playerId].joinedTodoListId;
    ws.send(JSON.stringify({command: "init", data: todoListSessions[todoListId]}));

    switch (msg.command) {
        case "row_update": {
            const data = (msg as UpdateRowMsg).data;
            const index = todoListSessions[todoListId].todoList.todoListRows.findIndex((row: TodoItemType) => row.id === data.id);
            todoListSessions[todoListId].todoList.todoListRows[index] = data;
            return broadCastMessage(todoListId, msg);
        }
        case "row_delete": {
            const rowId = (msg as DeleteRowMsg).rowId;
            todoListSessions[todoListId].todoList.todoListRows =  todoListSessions[todoListId].todoList.todoListRows.filter((row: TodoItemType) => row.id !== rowId);
            return broadCastMessage(todoListId, msg);
        }
        case "row_add": {
            const data = (msg as AddRowMsg).data;
            todoListSessions[todoListId].todoList.todoListRows.push(data);
            return broadCastMessage(todoListId, msg);
        }
        case "title_update": {
            const title = (msg as StringUpdateAttributeMsg).data;
            todoListSessions[todoListId].todoList.title = title;
            return broadCastMessage(todoListId, msg);
        }
        case "description_update": {
            const description = (msg as StringUpdateAttributeMsg).data;
            todoListSessions[todoListId].todoList.description = description;
            return broadCastMessage(todoListId, msg);
        }
        // case "delete_list": {
        //     const listId = (msg as DeleteListMsg).listId;
        //     todoListSessions[todoListId].todoList =  todoListSessions[todoListId].todoList.filter((list: TodoListType) => list.id !== listId);
        //     return broadCastMessage(todoListId, msg);
        // }
    }
}

export default handleNewClient;

// Auto save every 60 seconds
setInterval(() => {
    const keys : string[] = Object.keys(todoListSessions);
    for (const key of keys) {
      updateTodoList(key, todoListSessions[key].todoList);
    }
}, 60000);