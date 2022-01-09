import { useEffect, useState } from "react";
import Card from "../components/Card/Card";
import { TodoListType } from "../models/models";
import { deleteTodoList, getAllTodoList } from "../services/Api";

const ListsPage = () => {
  const [results, setResults] = useState<TodoListType[]>([]);

  useEffect(() => {
    getAllTodoList().then((results) => {
      setResults(results);
    }).catch((err) => {
      console.error(err);
    })
  }, [setResults]);

  const deleteTodoListAction: any = (listId: string) => {
    deleteTodoList(listId).then(() => {
      const newRes = results.filter(result => result.id !== listId)
      setResults(newRes)
    }).catch((err: any) => {
      console.error(err);
    })
  }

  return (
    <>
      <section className='lists-wrapper'>
        {results === undefined
          ?
          <h1>There is no lists yet. Please create one</h1>
          :
          <article className="card-wrapper" >
            {
              results.map((result: TodoListType) => {
                return <Card key={result.id} todo={result} deleteTodoList={deleteTodoListAction} />
              })
            }
          </article>
        }
      </section>
    </>

  );
};

export default ListsPage;