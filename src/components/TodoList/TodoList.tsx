interface TodoVar {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}
interface TodoListProps {
  a: TodoVar;
  b: number;
  usersFromServer: User[];
  setUsers: React.Dispatch<React.SetStateAction<TodoVar[]>>;
}

export const TodoList: React.FC<TodoListProps> = ({
  a,
  b,
  usersFromServer,
  setUsers,
}) => {
  const setTrue = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setUsers(prev => {
      return prev.map((u: TodoVar, i: number) =>
        i === b ? { ...u, completed: true } : u,
      );
    });
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
        onClick={e => setTrue(e)}
      >
        {returnUser(a.userId)[0]}
      </a>
    </article>
  );
};
