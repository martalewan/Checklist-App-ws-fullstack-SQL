import { pool } from "./db";
import { nanoid } from 'nanoid'
import { TodoListType } from "./models/models";

export const createTodoList = (data : TodoListType) => {
    const tableData = {
        id: nanoid(32),
        title: data.title,
        description: data.description,
        todoListRows: JSON.stringify(data.todoListRows),
    }
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO todoList set ?', tableData, (error, results, fields) => {
            if (error) {
                console.error(error);
                return reject(error);
            }
            resolve(tableData.id);
        });
    });
}

export const getTodoListById = (token: any) : Promise<TodoListType> => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todoList where todoList.id = ?', token, (error, results) => {
            if (error) {
                return reject(error);
            }
            if (results.length > 0) {
                resolve(translateRowToTodoList(results[0]));
            } else {
                reject("Not found");
            }
        });
    });
}

export const updateTodoList = (id : any, data : TodoListType ) => {
    const tableData = {
      title: data.title,
      description: data.description,
      todoListRows: JSON.stringify(data.todoListRows),
    }

    return new Promise((resolve, reject) => {
        pool.query('UPDATE todoList SET ? where id = ?', [tableData, id], (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            resolve(id);
        });
    });
}

export const getAllTodoList = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM todoList', (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            const allLists = [];
            for (const result of results) {
                allLists.push(translateRowToTodoList(result));
            }
            resolve(allLists);
        });
    });
}

export const translateRowToTodoList = (row : any) : TodoListType => {
  return {
      id: row.id,
      title: row.title,
      description: row.description,
      todoListRows: row.todoListRows ? JSON.parse(row.todoListRows) : [],
  }
}

export const deleteTodoListById = (token: any) : Promise<void> => {
    return new Promise((resolve, reject) => {
        pool.query('DELETE FROM todoList WHERE todoList.id = ?', token, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve()
        });
    });
}