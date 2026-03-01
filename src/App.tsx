import './App.scss';
import React, { ChangeEvent, useState } from 'react';
import { TodoList } from './components/TodoList';
import usersFromServer from './api/users';
import todosFromServer from './api/todos';

// interface User {
//   id: number;
//   name: string;
//   username: string;
//   email: string;
// }

interface TodoVar {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [users, setUsers] = useState<TodoVar[]>(todosFromServer);
  const [aparecerTxt, SetAparecerTxt] = useState<boolean[]>([false, false]);
  const [todoVar, setTodoVar] = useState<TodoVar>({
    id: todosFromServer[todosFromServer.length - 1].id + 1,
    title: '',
    completed: false,
    userId: 0,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setTrue = (b: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setUsers(prev => {
      return prev.map((u, i) => (i === b ? { ...u, completed: true } : u));
    });
  };

  const cleanTodo = () => {
    setTodoVar({
      id: todosFromServer[todosFromServer.length - 1].id + 1,
      title: '',
      completed: false,
      userId: 0,
    });
    setIsOpen(false);
  };

  const returnUser = (userId: number) => {
    const userName = ['', ''];

    for (let i = 0; i < usersFromServer.length; i++) {
      if (usersFromServer[i].id === userId) {
        userName[0] = usersFromServer[i].name;
      }

      if (usersFromServer[i].id === userId) {
        userName[1] = usersFromServer[i].email;
      }
    }

    return userName;
  };

  const onChangeTodo = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string,
  ) => {
    if (type === 'title' && 'target' in event) {
      setTodoVar(prev => ({
        ...prev,
        title: (event as ChangeEvent<HTMLInputElement>).target.value,
      }));

      return;
    }

    if (type === 'user') {
      const value =
        typeof event === 'string'
          ? event
          : (event as ChangeEvent<HTMLSelectElement>).target.value;

      setTodoVar(prev => ({ ...prev, userId: Number(value) }));
    }
  };

  const onSubmitAll = (
    formulario: string,
    e: React.ChangeEvent<HTMLSelectElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (formulario === 'todo') {
      if (todoVar.title !== '' && todoVar.userId !== 0) {
        setUsers(prov => [...prov, todoVar]);
        SetAparecerTxt([false, false]);
        cleanTodo();
        setIsOpen(false);
        setSelectedUser(0);
      } else {
        SetAparecerTxt([todoVar.title === '', todoVar.userId === 0]);
      }
    }
  };

  return (
    <div className="App">
      <h1>Add todo form</h1>

      <form
        action="/api/todos"
        method="POST"
        onSubmit={e => onSubmitAll('todo', e)}
      >
        <div className="field">
          <input
            type="text"
            data-cy="titleInput"
            value={todoVar.title}
            onChange={e => onChangeTodo(e, 'title')}
          />

          <span className="error">
            {aparecerTxt[0] ? 'Please enter a title' : ''}
          </span>
        </div>

        <div className="field">
          <select
            data-cy="userSelect"
            value={selectedUser}
            onChange={e => {
              setSelectedUser(Number(e.target.value));
              onChangeTodo(e, 'user');
            }}
            onClick={() => setIsOpen(true)}
          >
            <option disabled={isOpen} value="0">
              Choose a user
            </option>
            {usersFromServer.map(r => TodoList(r))}
          </select>

          <span className="error">
            {aparecerTxt[1] ? 'Please choose a user' : ''}
          </span>
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      {/* USERS.TS */}
      <section className="TodoList">
        {users.map((a: TodoVar, b: number) => {
          return (
            <article
              key={a.id}
              data-id={a.id}
              className={`TodoInfo TodoInfo${a.completed ? '--completed' : ''}`}
            >
              <h2 className="TodoInfo__title">{a.title}</h2>

              <a
                className="UserInfo"
                href={returnUser(a.userId)[1]}
                onClick={e => setTrue(b, e)}
              >
                {returnUser(a.userId)[0]}
              </a>
            </article>
          );
        })}
        {/*
        <article data-id="15" className="TodoInfo TodoInfo--completed">
          <h2 className="TodoInfo__title">delectus aut autem</h2>

          <a className="UserInfo" href="mailto:Sincere@april.biz">
            Leanne Graham
          </a>
        </article> */}

        {/* <article data-id="2" className="TodoInfo">
          <h2 className="TodoInfo__title">
            quis ut nam facilis et officia qui
          </h2>

          <a className="UserInfo" href="mailto:Julianne.OConner@kory.org">
            Patricia Lebsack
          </a>
        </article> */}
      </section>
    </div>
  );
};
