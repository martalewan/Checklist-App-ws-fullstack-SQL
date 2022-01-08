import React from "react";
import { TodoItemType } from '../../models/models';
import iconOpen from '../../img/icon-open.svg';
import iconExit from '../../img/icon-exit.svg';

interface TodoListItemProps {
  todo: TodoItemType;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id : string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRow: (id: string, e: any) => void;
  onOpeningRow: (todo: TodoItemType, e: any) => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ todo, updateChecklistRowComplete, updateChecklistRowText, onRemoveRow, onOpeningRow }) => {
  return (
    <li className={todo.complete? "todo-row completed" : "todo-row"} >
      <div className="todo-item__label">
        <input
          type="checkbox"
          onChange={() => updateChecklistRowComplete(todo)}
          checked={todo.complete}
          className="todo-checkbox"
          />
          <span className="todo-text"></span>
          <input value={todo.text} type="text" className="todo-item-input" placeholder="New todo" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)}/>
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