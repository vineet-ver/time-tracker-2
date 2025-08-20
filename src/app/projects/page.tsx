"use client";
import { useEffect, useState } from "react";

interface Project {
  _id: string;
  name: string;
  description?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/projects");
    if (!res.ok) {
      setError("Failed to load projects");
      return;
    }
    const j = await res.json();
    setProjects(j.projects);
  }

  useEffect(() => {
    load();
  }, []);

  async function createProject(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to create project");
      return;
    }
    setName("");
    setDescription("");
    load();
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <form onSubmit={createProject} className="flex gap-2">
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="bg-black text-white px-3 py-2 rounded">Create</button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p._id} className="border rounded p-3">
            <div className="font-medium">{p.name}</div>
            {p.description && <div className="text-sm text-neutral-500">{p.description}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}


