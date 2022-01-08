const baseUrl = "http://localhost:8080";

export const getTodoList = async (id : string) => {
    try {
    const res = await fetch(`${baseUrl}/todo-list/${id}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}

export const createTodoList = async (todoList : Object) => {
    const res = await fetch(
    `${baseUrl}/todo-list`,
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoList)
    }
  );
  return await res.json();
}

export const getAllTodoList = async () => {
  return await fetch(`${baseUrl}/todo-lists/all`).then(res => res.json());
}

export const deleteTodoList = async (id : string) => {
  return fetch(`${baseUrl}/todo-list/${id}`, {
    method: "DELETE"
  })
  .then(res => res.json()).catch((err) => {
    console.error(err);
});;
}