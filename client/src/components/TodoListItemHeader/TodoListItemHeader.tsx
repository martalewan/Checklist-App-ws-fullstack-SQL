import React from "react";
import { TodoItemType } from '../../models/models';
import iconClose from '../../img/icon-close.svg';
import { customCurrency } from '../../services/MoneyUtility';
import { formatHours } from '../../services/TimeUtility';

interface TodoItemHeaderProps {
  todo: TodoItemType;
  onClosingRow: (e: any) => void;
  updateChecklistRowText: (id: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => void;
  getTotalPrice: (todo: TodoItemType) => any;
  getTotalTime: (todo: TodoItemType) => any;
}

const TodoItemHeader: React.FC<TodoItemHeaderProps> = ({ todo, updateChecklistRowText, onClosingRow: onOpeningRow, getTotalPrice, getTotalTime }) => {

  return (
    <li className={todo.complete ? "todo-row completed" : "todo-row"} >
      <div className="todo-item__label">
        <input value={todo.text} type="text" className="todo-item-input" placeholder="New todo" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)} />
        <span className="labels">{customCurrency(getTotalPrice(todo)).format()}</span>
        <span className="labels">{formatHours(getTotalTime(todo))}</span>
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