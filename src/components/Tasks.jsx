import { useEffect, useState } from "react";
import * as api from "../api.js";
import TaskItem from "./TaskItem.jsx";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    api
      .listTasks()
      .then(setTasks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    try {
      const task = await api.createTask(title.trim(), description.trim());
      setTasks((t) => [...t, task]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, changes) {
    setError("");
    try {
      const updated = await api.updateTask(id, changes);
      setTasks((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await api.deleteTask(id);
      setTasks((t) => t.filter((x) => x.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const done = tasks.filter((t) => t.completed).length;

  return (
    <>
      <form className="card" onSubmit={handleAdd}>
        <h2>New task</h2>
        <input
          placeholder="Title"
          value={title}
          maxLength={200}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button>Add task</button>
      </form>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <h2>
          Your tasks {tasks.length > 0 && <small>({done}/{tasks.length} done)</small>}
        </h2>
        {loading && <p className="muted">Loading... (a free server can take ~30s to wake up)</p>}
        {!loading && tasks.length === 0 && <p className="muted">No tasks yet. Add one above.</p>}
        <ul>
          {tasks.map((t) => (
            <TaskItem key={t.id} task={t} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </ul>
      </section>
    </>
  );
}
