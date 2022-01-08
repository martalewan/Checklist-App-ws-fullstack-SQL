"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_ws_1 = __importDefault(require("express-ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const repository_1 = require("./repository");
const ws_1 = __importDefault(require("./ws"));
const app = (0, express_1.default)();
(0, express_ws_1.default)(app);
dotenv_1.default.config();
const port = 8080;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.ws('/ws/todo-list', (ws, req) => {
    (0, ws_1.default)(ws, req);
});
app.post('/todo-list', (req, res) => {
    (0, repository_1.createTodoList)(req.body).then((id) => {
        res.send({ id: id });
    }).catch((err) => {
        res.send(err).status(400);
    });
});
app.get('/todo-list/:id', (req, res) => {
    (0, repository_1.getTodoListById)(req.params.id).then((todoList) => {
        res.send(todoList);
    }).catch((err) => {
        res.send(err).status(400);
    });
});
app.get('/todo-lists/all', (req, res) => {
    (0, repository_1.getAllTodoList)().then((allLists) => {
        res.send(allLists);
    }).catch((err) => {
        res.send(err).status(400);
    });
});
app.delete('/todo-list/:id', (req, res) => {
    (0, repository_1.deleteTodoListById)(req.params.id).then(() => {
        res.end;
    }).catch((err) => {
        res.send(err).status(400);
    });
});
app.listen(port, () => {
    console.log(`The app listening at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map