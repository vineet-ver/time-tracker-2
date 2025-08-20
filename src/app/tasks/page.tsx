"use client";
import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  description?: string;
  projectId: string;
  status: string;
}

interface Project { _id: string; name: string }

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const [pr, tr] = await Promise.all([
      fetch("/api/projects"),
      fetch(`/api/tasks${projectId ? `?projectId=${projectId}` : ""}`),
    ]);
    if (pr.ok) setProjects((await pr.json()).projects);
    if (tr.ok) setTasks((await tr.json()).tasks);
  };

  useEffect(() => { load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, title, description }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create task");
      return;
    }
    setTitle("");
    setDescription("");
    load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <div className="flex gap-2 items-center">
        <label className="text-sm">Project:</label>
        <select className="border rounded px-2 py-2 bg-transparent" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">All</option>
          {projects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
        </select>
      </div>
      <form onSubmit={createTask} className="flex gap-2 flex-wrap">
        <select className="border rounded px-2 py-2 bg-transparent" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
          <option value="">Select project</option>
          {projects.map((p) => (<option key={p._id} value={p._id}>{p.name}</option>))}
        </select>
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="bg-black text-white px-3 py-2 rounded">Create</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t._id} className="border rounded p-3">
            <div className="font-medium">{t.title}</div>
            <div className="text-sm text-neutral-500">{t.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}


