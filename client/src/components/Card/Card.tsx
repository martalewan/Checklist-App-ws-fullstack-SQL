import { TodoListType } from "../../models/models";
import RoundedButton from "../RoundedButton/RoundedButton";

interface CardProps {
  todo: TodoListType;
  deleteTodoList: (todoId: string) => (arg: any) => TimerHandler;
}

const Card: React.FC<CardProps> = ({ todo, deleteTodoList }) => {

  let numTodos = 0;

  const getNumTodos = () => {
    if (todo.todoListRows) {
      return todo.todoListRows.length;
    } else { return numTodos }
  }

  const getTitleTodos = () => {
    if (todo.title != null) {
      return todo.title;
    } else { return 'No title' }
  }

  const getDescriptionTodos = () => {
    if (todo.description != null) {
      return todo.description;
    } else { return 'No description' }
  }

  const getIdTodos = () => {
    if (todo.id != null) {
      return todo.id;
    } else { return 'No description' }
  }
  const deleteIdTodos = () => {
    if (todo.id != null) {
      return todo.id;
    }  return '';
  }
  const openTodo = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href=`http://localhost:3000/todo-list/${getIdTodos()}?`
  }

  return (
    <div className="card">
      <div className="card__text-wrapper" >
        <p className="card-text">{getTitleTodos()}</p>
        <p className="card-text">{getDescriptionTodos()}</p>
        <p className="card-text">Number of task: {getNumTodos()}</p>
      </div>
      <div className="card-wrapper__btn-wrapper">
        <RoundedButton btnText={"delete"} className={"card"} handleSubmit={() => deleteTodoList(deleteIdTodos())}/>
        <RoundedButton btnText={"modify"} className={"card"} handleSubmit={openTodo}/>

      </div>
    </div>
  )
};


export default Card;