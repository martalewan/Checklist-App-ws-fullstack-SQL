import TodoListPage from './pages/TodoListPage';
import { useNavigate } from "react-router-dom";
import HomePage from './pages/HomePage';
import { Route, Routes } from "react-router-dom";
import { createTodoList } from './services/Api';
import Navigation from './components/Navigation/Navigation';
import ListsPage from './pages/ListsPage';

type CreateNewTodoList = (data: Object) => any;

const App = () => {
  const navigate = useNavigate();

  const createNewTodoList: CreateNewTodoList = (data : Object) => {
    createTodoList(data).then((res: { id: string; }) => {
      navigate('/todo-list/' + res.id);
    }).catch((err: any) => {
        console.error(err);
    })
  }

  return (
    <>
      <Navigation createNewTodoList={createNewTodoList}/>
      <div className="App">
        <Routes>
          <Route path="/todo-list/:id" element={<TodoListPage /> } />
          <Route path="/" element={<HomePage />} />
          <Route path="/lists" element={<ListsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
