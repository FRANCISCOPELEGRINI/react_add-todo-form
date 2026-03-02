import '../api/App.scss';
import React, { ChangeEvent, useState } from 'react';
import { TodoList } from '../TodoList';
import usersFromServer from '../api/users';
import todosFromServer from '../api/todos';
import { UserInfo } from '../UserInfo';

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

export const Generator = () => {
  const [users, setUsers] = useState<TodoVar[]>(todosFromServer);
  const [selectedUser, setSelectedUser] = useState(0);
  const [aparecerTxt, SetAparecerTxt] = useState<boolean[]>([false, false]);
  const [todoVar, setTodoVar] = useState<TodoVar>({
    id: users[users.length - 1].id + 1,
    title: '',
    completed: false,
    userId: 0,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const cleanTodo = () => {
    setTodoVar({
      id: todosFromServer[todosFromServer.length - 1].id + 1,
      title: '',
      completed: false,
      userId: 0,
    });
    setIsOpen(false);
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
            {aparecerTxt[0] && todoVar.title === ''
              ? 'Please enter a title'
              : ''}
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
            {usersFromServer.map(r => UserInfo(r))}
          </select>

          <span className="error">
            {aparecerTxt[1] && todoVar.userId === 0
              ? 'Please choose a user'
              : ''}
          </span>
        </div>

        <button type="submit" data-cy="submitButton">
          Add
        </button>
      </form>
      {/* USERS.TS */}
      <section className="TodoList">
        <section className="TodoList">
          {users.map((a, b) => (
            <TodoList
              key={a.id}
              a={a}
              b={b}
              usersFromServer={usersFromServer}
              setUsers={setUsers}
            />
          ))}
        </section>
      </section>
    </div>
  );
};
