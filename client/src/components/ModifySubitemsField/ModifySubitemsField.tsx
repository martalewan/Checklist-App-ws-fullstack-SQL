import React from "react";
import { TodoItemType } from '../../models/models';

interface ModifySubitemsFieldProps {
  todo: TodoItemType;
  updateChecklistRowText: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  updateChecklistRowValue:  (selectedTodo: TodoItemType, e: any, type: string) => void;
}

const ModifySubitemsField: React.FC<ModifySubitemsFieldProps> = ({ todo, updateChecklistRowText, updateChecklistRowValue }) => {
  return (
    <>
      <form className="modify-form">
        <label className="modify-form__label--name">Name:</label>
          <input value={todo.text} id="text" type="text" className="subtodo-item-input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowText(todo.id, e)}/> 
        <label className="modify-form__label">Price:</label>
          <input value={todo.price} id="price" type="text" className="subtodo-item-input"onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowValue(todo, e, 'price')}/> 
        <label className="modify-form__label">Time:</label>
          <input value={todo.time} id="time" type="text" className="subtodo-item-input" onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateChecklistRowValue(todo, e, 'time')}/> 
        <label className="modify-form__label">Notes:</label>
          <textarea className="subtodo-notes" id="notes" value={todo.notes} cols={5} rows={3} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateChecklistRowValue(todo, e, 'notes')} />
      </form>
    </>
  )
}

export default ModifySubitemsField;