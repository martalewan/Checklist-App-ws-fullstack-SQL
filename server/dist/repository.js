"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodoListById = exports.translateRowToTodoList = exports.getAllTodoList = exports.updateTodoList = exports.getTodoListById = exports.createTodoList = void 0;
const db_1 = require("./db");
const nanoid_1 = require("nanoid");
const createTodoList = (data) => {
    const tableData = {
        id: (0, nanoid_1.nanoid)(32),
        title: data.title,
        description: data.description,
        todoListRows: JSON.stringify(data.todoListRows),
    };
    return new Promise((resolve, reject) => {
        db_1.pool.query('INSERT INTO todoList set ?', tableData, (error, results, fields) => {
            if (error) {
                console.error(error);
                return reject(error);
            }
            resolve(tableData.id);
        });
    });
};
exports.createTodoList = createTodoList;
const getTodoListById = (token) => {
    return new Promise((resolve, reject) => {
        db_1.pool.query('SELECT * FROM todoList where todoList.id = ?', token, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length > 0) {
                resolve((0, exports.translateRowToTodoList)(results[0]));
            }
            else {
                reject("Not found");
            }
        });
    });
};
exports.getTodoListById = getTodoListById;
const updateTodoList = (id, data) => {
    const tableData = {
        title: data.title,
        description: data.description,
        todoListRows: JSON.stringify(data.todoListRows),
    };
    return new Promise((resolve, reject) => {
        db_1.pool.query('UPDATE todoList SET ? where id = ?', [tableData, id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            resolve(id);
        });
    });
};
exports.updateTodoList = updateTodoList;
const getAllTodoList = () => {
    return new Promise((resolve, reject) => {
        db_1.pool.query('SELECT * FROM todoList', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            const allLists = [];
            for (const result of results) {
                allLists.push((0, exports.translateRowToTodoList)(result));
            }
            resolve(allLists);
        });
    });
};
exports.getAllTodoList = getAllTodoList;
const translateRowToTodoList = (row) => {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        todoListRows: row.todoListRows ? JSON.parse(row.todoListRows) : [],
    };
};
exports.translateRowToTodoList = translateRowToTodoList;
const deleteTodoListById = (token) => {
    return new Promise((resolve, reject) => {
        db_1.pool.query('DELETE FROM todoList WHERE todoList.id = ?', token, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length > 0) {
                resolve;
            }
            else {
                reject("Not found");
            }
        });
    });
};
exports.deleteTodoListById = deleteTodoListById;
//# sourceMappingURL=repository.js.map