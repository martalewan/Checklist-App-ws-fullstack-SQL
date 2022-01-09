import { TodoListType } from "../../models/models";
import RoundedButton from "../RoundedButton/RoundedButton";
import { useNavigate } from "react-router-dom";

interface CardProps {
  todo: TodoListType;
  deleteTodoList: (todoId: string) => (arg: any) => TimerHandler;
}

const Card: React.FC<CardProps> = ({ todo, deleteTodoList }) => {

  const navigate = useNavigate();
  const openTodo = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate('/todo-list/' + todo.id);
  };

  return (
    <div className="card">
      <div className="card__text-wrapper" >
        <p className="card-text">{todo.title ?? 'No title'}</p>
        <p className="card-text">{todo.description ?? 'No description'}</p>
        <p className="card-text">Number of task: {todo.todoListRows.length}</p>
      </div>
      <div className="card__btn-wrapper">
        <RoundedButton btnText={"delete"} className={"card"} handleSubmit={() => deleteTodoList(todo.id)}/>
        <RoundedButton btnText={"modify"} className={"card"} handleSubmit={openTodo}/>
      </div>
    </div>
  )
};

export default Card;