import React from "react";
import TodoListItem from '../TodoListItem/TodoListItem';
import { TodoItemType, TodoListType } from '../../models/models';

interface TodoListProps {
  todoList: TodoListType;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRow: (id: string | undefined, e: any) => void;
  onOpeningRow: (todo: TodoItemType, e: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todoList, updateChecklistRowComplete, updateChecklistRowText, onRemoveRow, onOpeningRow }) => {
  return (
    <>
    <div className="todo-items-list">
     {todoList.todoListRows.map(todo => (
       <TodoListItem
          key={todo.id}
          todo={todo}
          updateChecklistRowComplete={updateChecklistRowComplete}
          updateChecklistRowText={updateChecklistRowText}
          onRemoveRow={onRemoveRow}
          onOpeningRow={onOpeningRow}
        />
     ))}
    </div>
    </>
  );
};

export default TodoList;