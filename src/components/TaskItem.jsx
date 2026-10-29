import { useState } from "react";

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  async function save(e) {
    e.preventDefault();
    await onUpdate(task.id, { title: title.trim(), description: description.trim() || null });
    setEditing(false);
  }

  if (editing) {
    return (
      <li>
        <form className="edit" onSubmit={save}>
          <input value={title} maxLength={200} onChange={(e) => setTitle(e.target.value)} required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <button>Save</button>
            <button type="button" className="link" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={task.completed ? "done" : ""}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={(e) => onUpdate(task.id, { completed: e.target.checked })}
      />
      <div className="text">
        <strong>{task.title}</strong>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="row">
        <button className="link" onClick={() => setEditing(true)}>Edit</button>
        <button className="link danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}
