interface RInterface {
  id: number;
  name: string;
  username: string;
  email: string;
}

export const TodoList = (r: RInterface) => {
  return (
    <option value={r.id} key={r.id}>
      {r.name}
    </option>
  );
};
