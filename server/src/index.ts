import express, { Request } from "express";
import expressWs, { WithWebsocketMethod } from "express-ws";
import dotenv from "dotenv";
import cors from "cors";
import { createTodoList, getTodoListById, getAllTodoList, deleteTodoListById } from "./repository"
import handleNewClient from './ws'

const app = express();
expressWs(app);
dotenv.config();

const port = 8080;
app.use(cors());
app.use(express.json());

((app as unknown) as WithWebsocketMethod).ws('/ws/todo-list', (ws, req) => {
  handleNewClient(ws, req);
});

app.post('/todo-list', (req, res) => {
  createTodoList(req.body).then((id) => {
    res.send({ id: id });
  }).catch((err) => {
    res.send(err).status(400);
  });
})

app.get('/todo-list/:id', (req : Request<{id: any}, any, any, any>, res) => {
  getTodoListById(req.params.id).then((todoList : any) => {
    res.send(todoList);
  }).catch((err) => {
    res.send(err).status(400);
  })
})

app.get('/todo-lists/all', (req, res) => {
  getAllTodoList().then((allLists) => {
    res.send(allLists);
  }).catch((err) => {
    res.send(err).status(400);
  });
})

app.delete('/todo-list/:id', (req : Request<{id: any}, any, any, any>, res) => {
  deleteTodoListById(req.params.id).then(() => {
    res.end;
  }).catch((err) => {
    res.send(err).status(400);
  })
})

app.listen(port, () => {
  console.log(`The app listening at http://localhost:${port}`)
});