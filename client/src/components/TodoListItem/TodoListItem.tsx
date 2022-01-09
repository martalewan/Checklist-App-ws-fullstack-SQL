import React from "react";
import { TodoItemType } from '../../models/models';
import iconOpen from '../../img/icon-open.svg';
import iconExit from '../../img/icon-exit.svg';
import iconDrag from '../../img/icon-drag.svg';
import { customCurrency } from '../../services/MoneyUtility';
import { formatHours } from '../../services/TimeUtility';

interface TodoListItemProps {
  todo: TodoItemType;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id : string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRow: (id: string, e: any) => void;
  onOpeningRow: (todo: TodoItemType, e: any) => void;
  getTotalPrice: (todo: TodoItemType) => any;
  getTotalTime: (todo: TodoItemType) => any;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo, updateChecklistRowComplete, updateChecklistRowText, onRemoveRow, onOpeningRow, getTotalPrice, getTotalTime }) => {

  const getTotalSubtodos = (todo: TodoItemType) => {
    if (todo.todoListRows) {
      return todo.todoListRows.length
    }
    return 0;
  }
  return (
    <li className={todo.complete? "todo-row completed" : "todo-row"} >
      <div className="todo-item__label">
        <img className="icon-drag" src={iconDrag} alt="" />
        <input
          type="checkbox"
          onChange={() => updateChecklistRowComplete(todo)}
          checked={todo.complete ?? false}
          className="todo-checkbox"
          />
          <span className="todo-text"></span>
          <input value={todo.text ?? ""} type="text" className="todo-item-input" maxLength={48} placeholder="New todo" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)}/>
          <span className="labels">{getTotalSubtodos(todo)} it</span>
          <span className="labels">{customCurrency(getTotalPrice(todo)).format()}</span>
        <span className="labels">{formatHours(getTotalTime(todo))}</span>
      </div>
      <div className="todo-row__icons">
        <button className="icon-wrapper" onClick={(e: any) => onOpeningRow(todo, e)}>
          <img className="img-icons icon-open" src={iconOpen} alt="" />
        </button>
        <button className="icon-wrapper" onClick={(e) => onRemoveRow(todo.id, e)}>
          <img className="img-icons icon-exit" src={iconExit} alt="" />
        </button>
      </div>
    </li>
  )
}

export default TodoListItem;