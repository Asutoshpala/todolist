import { useEffect, useState } from "react";

const URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/todos`;

export default function App() {
  const [todos, setTodos] = useState([]);
  const [test, setTest] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTodos() {
      try {
        const response = await fetch(URL);

        if (!response.ok) {
          throw new Error("Could not load todos");
        }

        const data = await response.json();
        setTodos(data);
      } catch (error) {
        setError("Could not connect to the server.");
      }
    }

    loadTodos();
  }, []);

  async function add(event) {
    event.preventDefault();

    if (!test.trim()) return;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test }),
      });

      if (!response.ok) {
        throw new Error("Could not add todo");
      }

      const newTodo = await response.json();
      setTodos((currentTodos) => [newTodo, ...currentTodos]);
      setTest("");
    } catch (error) {
      setError("Could not add the todo.");
    }
  }

  async function remove(id) {
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete todo");
      }

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== id)
      );
    } catch (error) {
      setError("Could not delete the todo.");
    }
  }

  return (
    <main>
      <h1>My Todo List</h1>

      <form onSubmit={add}>
        <input
          type="text"
          value={test}
          onChange={(event) => setTest(event.target.value)}
          placeholder="Add a task"
        />
        <button type="submit">Add</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.test}
            <button type="button" onClick={() => remove(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}