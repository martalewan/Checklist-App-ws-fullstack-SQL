import React, { useState } from "react";
import TodoListItem from '../TodoListItem/TodoListItem';
import { TodoItemType, TodoListType } from '../../models/models';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8;

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: 0,
  margin: 0,

  // change background colour if dragging

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: any) => ({
  padding: 0,
  margin: 0,
});

interface TodoListProps {
  todoList: TodoListType;
  updateChecklistRowComplete: (selectedTodo: TodoItemType) => void;
  updateChecklistRowText: (id: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveRow: (id: string | undefined, e: any) => void;
  onOpeningRow: (todo: TodoItemType, e: any) => void;
  onRowSwap: (fromIx: any, toIx: any) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todoList, updateChecklistRowComplete, updateChecklistRowText, onRemoveRow, onOpeningRow, onRowSwap }) => {

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const fromIx = result.source.index;
    const toIx = result.destination.index;
    onRowSwap(fromIx, toIx);
  }

  return (
    <div className="todo-items-list">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {todoList.todoListRows.map((item: any, index: any) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <TodoListItem
                        key={item.id}
                        todo={item}
                        updateChecklistRowComplete={updateChecklistRowComplete}
                        updateChecklistRowText={updateChecklistRowText}
                        onRemoveRow={onRemoveRow}
                        onOpeningRow={onOpeningRow}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;