import React from "react";
import { TodoItemType } from '../../models/models';
import iconModify from '../../img/icon-modify.svg';
import iconExit from '../../img/icon-exit.svg';

interface SubtodoListItemProps {
  todo: TodoItemType;
  deleteChecklistSubtaskRow: (id: string, e: any) => void;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRow: (id: string, e: any) => void;
  onModify: (e: any) => void;
}

const SubtodoListItem: React.FC<SubtodoListItemProps> = ({ todo, updateChecklistRowComplete, updateChecklistRowText, onModify, deleteChecklistSubtaskRow }) => {
  return (
    <li className={todo.complete ? "todo-row completed" : "todo-row"} >
      <div className="todo-item__label">
        <input
          type="checkbox"
          onChange={() => updateChecklistRowComplete(todo)}
          checked={todo.complete}
          className="todo-checkbox"
        />
        <input value={todo.text} type="text" className="todo-item-input" placeholder="New todo" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)} />
        <span className="header-text">{todo.price}$</span>
        <span className="header-text">{todo.time}h</span>
      </div>
      <div className="todo-row__icons">
        <button className="icon-wrapper" onClick={onModify}>
          <img className="img-icons icon-open" src={iconModify} alt="" />
        </button>
        <button className="icon-wrapper" onClick={(e) => deleteChecklistSubtaskRow(todo.id, e)}>
          <img className="img-icons icon-exit" src={iconExit} alt="" />
        </button>
      </div>
    </li>
  );
};

export default SubtodoListItem;