import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { TodoItemType, TodoListType } from '../../models/models';
import TodoList from '../TodoList/TodoList';
import { useParams } from 'react-router-dom';
import * as uuid from "uuid";
import SubtodoList from '../SubtodoList/SubtodoList';
import TodoItemHeader from '../TodoListItemHeader/TodoListItemHeader';

const url = window.location.href;

type UpdateChecklistRowComplete = (selectedTodo: TodoItemType) => void;

interface Msg {
  command: string,
}
interface UserJoinLeftMessage extends Msg {
  data: { id: number }
}
interface InitMsg extends Msg {
  data: { todoList: TodoListType, users: any[] }
}
interface UpdateRowMsg extends Msg {
  data: TodoItemType;
}
interface DeleteRowMsg extends Msg {
  rowId: string;
}
interface AddRowMsg extends Msg {
  data: TodoItemType;
}
interface StringUpdateAttributeMsg extends Msg {
  data: string;
}
interface AddRowMsg extends Msg {
  data: TodoItemType;
}

interface TodoFormProps {
  notify: () => React.ReactText;
}

const TodoForm: React.FC<TodoFormProps> = ({ notify }) => {

  const params = useParams();

  const [todoList, setTodoList] = useState<TodoListType>({ id: '', title: '', description: '', todoListRows: [] });
  const [focusTodoItem, setFocusTodoItem] = useState<TodoItemType | undefined>(undefined);
  const [modifyingRow, setModifyingRow] = useState<string>('');
  const [users, setUsers] = useState<any>([]);

  const [connecting, setConnecting] = useState(false);
  const [id, setId] = useState("");

  useEffect(() => {
    setId(id => {
      if (id !== "" && params.id !== id) {
        window.location.reload();
      }
      return params.id || id
    });
  }, [params, setId]);

  useEffect(() => {
    const checklistId = params.id;

    window.services.wsHandler.connect(checklistId, (msg: Msg) => {
      switch (msg.command) {
        case "init": {
          const message = (msg as InitMsg);
          setTodoList(message.data.todoList)
          setUsers(message.data.users);
          break;
        }
        case "row_update": {
          const todoRow = (msg as UpdateRowMsg).data;
          setTodoList(todoList => {
            const index = todoList.todoListRows.findIndex(row => row.id === todoRow.id);
            todoList.todoListRows[index] = todoRow;
            return { ...todoList }
          })
          setFocusTodoItem(focusRow => {
            if (focusRow !== undefined && todoRow.id === focusRow.id) {
              return todoRow;
            } else {
              return focusRow;
            }
          })

          break;
        }
        case "row_delete": {
          let rowId = (msg as DeleteRowMsg).rowId;
          setTodoList(todoList => {
            const updatedRows = todoList.todoListRows.filter(row => row.id !== rowId);
            todoList.todoListRows = updatedRows;
            return { ...todoList }
          })
          break;
        }
        case "row_add": {
          console.log("ROW ADDED!");
          let newTodoItem = (msg as AddRowMsg).data;

          setTodoList(todoList => {
            return {
              ...todoList,
              todoListRows: [...todoList.todoListRows, newTodoItem]
            }
          })
          break;
        }
        case "title_update": {
          let newTitle = (msg as StringUpdateAttributeMsg).data;
          setTodoList(todoList => {
            todoList.title = newTitle;
            return { ...todoList }
          })
          break;
        }
        case "description_update": {
          let newDescription = (msg as StringUpdateAttributeMsg).data;
          setTodoList(todoList => {
            todoList.description = newDescription;
            return { ...todoList }
          })
          break;
        }
        case "user_joined": {
          let userJoin = (msg as UserJoinLeftMessage).data;
          setUsers((users: any) => {
            return [...users, userJoin]
          })
          break;
        }
        case "user_left": {
          setUsers((users: any) => {
            let userLeft = (msg as UserJoinLeftMessage).data;
            return users.filter((user: any) => user.id !== userLeft.id);
          })
          break;
        }
        default:
          console.error(`Cannot process command ${msg.command}`);
      }
    }, (cleanDisconnect: any, reconnect: () => void) => {
      if (cleanDisconnect) {
        return;
      }
      setConnecting(true);
      setTimeout(() => {
        reconnect();
        console.log("Reconnecting...");
      }, 2500);
    }, () => {
      setConnecting(false);
    });

    return () => {
      window.services.wsHandler.disconnect()
    }
  }, [setTodoList, setConnecting, setFocusTodoItem]);


  const handleAddTodoItem = (e: any) => {
    e.preventDefault();
    const id = uuid.v4();
    const newTodoItem = { id: id, complete: false, text: "" };
    window.services.wsHandler.send({ command: "row_add", data: newTodoItem });
    setTodoList(todoList => {
      return { ...todoList, newTodoItem }
    })
  }

  const updateChecklistRowText = (id: string | undefined, e: React.ChangeEvent<HTMLInputElement>) => {
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === id);
    if (index >= 0) {
      newRows[index].text = e.target.value;
      window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
      todoList.todoListRows = newRows;
      setTodoList({ ...todoList })
    }
  }

  const updateChecklistRowComplete: UpdateChecklistRowComplete = (selectedTodo: TodoItemType) => {
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === selectedTodo.id);
    if (index >= 0) {
      newRows[index].complete = !newRows[index].complete;
      window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
      todoList.todoListRows = newRows;
      setTodoList({ ...todoList })
    }
  };

  const handleUpdateTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    window.services.wsHandler.send({ command: "title_update", data: e.target.value });
    todoList.title = e.target.value;
    setTodoList({ ...todoList });
  }

  const handleUpdateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    window.services.wsHandler.send({ command: "description_update", data: e.target.value });
    todoList.description = e.target.value;
    setTodoList({ ...todoList });
  }

  const onRemoveRow = (id: string | undefined, e: any) => {
    e.preventDefault();
    window.services.wsHandler.send({ command: "row_delete", rowId: id });
    let filteredRows = todoList.todoListRows.filter(row => row.id !== id);
    if (filteredRows.length === 0) {
      filteredRows.push({ id: uuid.v4(), text: "", complete: false, todoListRows: [] });
    }
    todoList.todoListRows = filteredRows;
    setTodoList({ ...todoList })
  }

  const onOpeningRow = (todo: TodoItemType, e: any) => {
    e.preventDefault();
    setFocusTodoItem(todo)
  }

  const onModifyRow = (id: string, e: any) => {
    e.preventDefault();
    if (focusTodoItem === undefined) {
      return;
    }
    setModifyingRow(id);
  }

  const onClosingRow = (e: any) => {
    e.preventDefault();
    setFocusTodoItem(undefined)
  }

  const handleAddSubtodoItem = (e: any) => {
    if (focusTodoItem === undefined) {
      return null;
    }

    e.preventDefault();
    const id = uuid.v4();
    const newTodoItem = { id: id, complete: false, text: "", todoListRows: [] };

    if (focusTodoItem.todoListRows === undefined) {
      focusTodoItem.todoListRows = [];
    }
    focusTodoItem.todoListRows.push(newTodoItem);

    window.services.wsHandler.send({ command: "row_update", data: focusTodoItem } as UpdateRowMsg);
    setFocusTodoItem({ ...focusTodoItem });
  }

  const updateChecklistSubtaskRowComplete = (selectedTodo: TodoItemType) => {
    if (focusTodoItem === undefined) {
      return null;
    }
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === focusTodoItem.id);
    if (index >= 0) {
      const subTasks: TodoItemType[] = newRows[index].todoListRows as TodoItemType[];
      const subTaskIndex = subTasks.findIndex(row => row.id === selectedTodo.id);
      if (subTaskIndex >= 0) {
        newRows[index].todoListRows[subTaskIndex].complete = !subTasks[subTaskIndex].complete;
        window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
        todoList.todoListRows = newRows;
        setTodoList({ ...todoList })
      }
    }
  };

  const updateChecklistRowValue = (selectedTodo: TodoItemType, e: any, type: string) => {
    if (focusTodoItem === undefined) {
      return null;
    }
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === focusTodoItem.id);
    if (index >= 0) {
      const subTasks: TodoItemType[] = newRows[index].todoListRows as TodoItemType[];
      const subTaskIndex = subTasks.findIndex(row => row.id === selectedTodo.id);
      if (subTaskIndex >= 0) {
        if (type === 'price') {
          if (!isNaN(parseFloat(e.target.value))) {
            newRows[index].todoListRows[subTaskIndex].price = parseFloat(e.target.value);
          }
          else {
            newRows[index].todoListRows[subTaskIndex].price = undefined;
            e.target.value = '';
          }
        } else if (type === 'time') {
          if (!isNaN(parseFloat(e.target.value))) {
            newRows[index].todoListRows[subTaskIndex].time = parseFloat(e.target.value);
          }
          else {
            newRows[index].todoListRows[subTaskIndex].time = undefined;
            e.target.value = '';
          }
        } else {
          newRows[index].todoListRows[subTaskIndex].notes = e.target.value;
        }
        window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
        todoList.todoListRows = newRows;
        setTodoList({ ...todoList })
      }
    }
  }

  const deleteChecklistSubtaskRow = (id: string, e: any) => {
    e.preventDefault();
    if (focusTodoItem === undefined) {
      return null;
    }
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === focusTodoItem.id);
    if (index >= 0) {
      const subTasks: TodoItemType[] = newRows[index].todoListRows as TodoItemType[];
      const subTaskIndex = subTasks.findIndex(row => row.id === id);
      if (subTaskIndex >= 0) {
        const filteredRow = newRows[index].todoListRows.filter(subRow => subRow.id !== subTasks[subTaskIndex].id);
        newRows[index].todoListRows = filteredRow;
        window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
        todoList.todoListRows = newRows;
        setTodoList({ ...todoList })
      }
    }
  }
  const updateChecklistSubtaskRowText = (id: string, e: any) => {
    if (focusTodoItem === undefined) {
      return null;
    }
    const newRows = [...todoList.todoListRows];
    const index = newRows.findIndex(row => row.id === focusTodoItem.id);
    if (index >= 0) {
      const subTasks: TodoItemType[] = newRows[index].todoListRows as TodoItemType[];
      const subTaskIndex = subTasks.findIndex(row => row.id === id);
      if (subTaskIndex >= 0) {
        newRows[index].todoListRows[subTaskIndex].text = e.target.value;
        window.services.wsHandler.send({ command: "row_update", data: newRows[index] });
        todoList.todoListRows = newRows;
        setTodoList({ ...todoList })
      }
    }
  }

  const copyUrl = (e: any) => {
    e.preventDefault();
    navigator.clipboard.writeText(url);
    notify();
  }

  return (
    <section className='main'>
      <form className="todo-form" action="">
        <div className="todo-form__inputs">
          <input className="todo-title" value={todoList.title} onChange={handleUpdateTitle} placeholder="List title" maxLength={46} required />
          <textarea className="todo-description" maxLength={300} value={todoList.description} cols={5} rows={7} onChange={handleUpdateDescription} placeholder="List description" />
        </div>
        <div className="todo-form__todo-items">
          {focusTodoItem === undefined
            ? (
              <>
                <TodoList
                  todoList={todoList}
                  updateChecklistRowComplete={updateChecklistRowComplete}
                  updateChecklistRowText={updateChecklistRowText}
                  onRemoveRow={onRemoveRow}
                  onOpeningRow={onOpeningRow}
                />
                <article className="todo-form__btn-wrapper">
                  <Button handleSubmit={handleAddTodoItem} btnText={'Add todo'} className='add-todo' />
                  <Button handleSubmit={copyUrl} btnText={'Share list'} className='save-list' />
                </article>
              </>)
            : (
              <>
                <TodoItemHeader
                  key={focusTodoItem.id}
                  todo={focusTodoItem}
                  updateChecklistRowText={updateChecklistRowText}
                  onClosingRow={onClosingRow}
                />
                <SubtodoList
                  deleteChecklistSubtaskRow={deleteChecklistSubtaskRow}
                  updateChecklistRowComplete={updateChecklistSubtaskRowComplete}
                  updateChecklistRowText={updateChecklistSubtaskRowText}
                  updateChecklistRowValue={updateChecklistRowValue}
                  editingTodo={focusTodoItem}
                  onRemoveRow={onRemoveRow}
                  onModifyRow={onModifyRow}
                  handleAddSubtodoItem={handleAddSubtodoItem}
                  modifyingRow={modifyingRow}
                  setModifyingRow={setModifyingRow}
                  focusTodoItem={focusTodoItem}
                />
              </>
            )
          }
        </div>
      </form>
    </section>
  )
};

export default TodoForm;
