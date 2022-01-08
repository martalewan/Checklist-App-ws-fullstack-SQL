import TodoForm from '../components/TodoForm/TodoForm';
import { TodoListType } from '../models/models';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodoListPage= () => {
  const notify = () => toast("Url copied to clipboard!");

  return (
    <>
      <TodoForm notify={notify} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        />
      <ToastContainer />
    </>
  );
};

export default TodoListPage;