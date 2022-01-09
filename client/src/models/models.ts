export interface TodoListType {
  id: string,
  title?: string;
  description?: string;
  todoListRows: TodoItemType[];
}

export interface TodoItemType {
  id: string,
  text: string;
  price?: number;
  time?: number;
  notes?: string;
  complete: boolean;
  todoListRows: TodoItemType[];
}
