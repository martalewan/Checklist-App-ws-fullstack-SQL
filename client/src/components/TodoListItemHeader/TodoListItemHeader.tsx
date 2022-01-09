import React from "react";
import { TodoItemType, TodoListType } from '../../models/models';
import iconClose from '../../img/icon-close.svg';
import { customCurrency } from '../../services/MoneyUtility';
import { formatHours } from '../../services/TimeUtility';

interface TodoItemHeaderProps {
  todo: TodoItemType;
  onClosingRow: (e: any) => void;
  updateChecklistRowText: (id: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TodoItemHeader: React.FC<TodoItemHeaderProps> = ({ todo, updateChecklistRowText, onClosingRow: onOpeningRow }) => {

  const getTotalPrice = (todo: TodoItemType) => {
    let totalPrice = 0;
    if (todo.todoListRows !== undefined) {
      todo.todoListRows.map(subTodo => {
        if (subTodo.price !== undefined) {
          totalPrice = totalPrice + subTodo.price
        } return totalPrice;
      })
      return totalPrice;
    }
  };
  const getTotalTime = (todo: TodoItemType) => {
    let totalTime = 0;
    if (todo.todoListRows !== undefined) {
      todo.todoListRows.map(subTodo => {
        if (subTodo.time !== undefined) {
          totalTime = totalTime + subTodo.time
        } return totalTime;
      })
    }
    return totalTime;
  };

  return (
    <li className={todo.complete ? "todo-row completed" : "todo-row"} >
      <div className="todo-item__label">
        <input value={todo.text} type="text" className="todo-item-input" placeholder="New todo" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)} />
        <span className="header-text">{customCurrency(getTotalPrice(todo)).format()}</span>
        <span className="header-text">{formatHours(getTotalTime(todo))}</span>
      </div>
      <div className="todo-row__icons">
        <button className="icon-wrapper" onClick={onOpeningRow}>
          <img className="img-icons icon-open" src={iconClose} alt="" />
        </button>
      </div>
    </li>
  );
};

export default TodoItemHeader;