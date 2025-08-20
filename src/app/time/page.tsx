"use client";
import { useEffect, useMemo, useState } from "react";

interface Project { _id: string; name: string }
interface Task { _id: string; title: string; projectId: string }
interface TimeEntry { _id: string; taskId: string; startTime: string; endTime?: string; note?: string }

export default function TimePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projectId, setProjectId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [note, setNote] = useState("");
  const [runningId, setRunningId] = useState<string | null>(null);

  const filteredTasks = useMemo(() => tasks.filter(t => !projectId || t.projectId === projectId), [tasks, projectId]);

  async function load() {
    const [pr, tr, er] = await Promise.all([
      fetch("/api/projects"),
      fetch("/api/tasks"),
      fetch("/api/time-entries"),
    ]);
    if (pr.ok) setProjects((await pr.json()).projects);
    if (tr.ok) setTasks((await tr.json()).tasks);
    if (er.ok) setEntries((await er.json()).entries);
  }

  useEffect(() => { load(); }, []);

  async function startTimer() {
    if (!taskId) return;
    const res = await fetch("/api/time-entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, startTime: new Date().toISOString(), note }),
    });
    if (res.ok) {
      const { entry } = await res.json();
      setRunningId(entry._id);
      setEntries([entry, ...entries]);
    }
  }

  async function stopTimer() {
    if (!runningId) return;
    const res = await fetch("/api/time-entries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: runningId, endTime: new Date().toISOString() }),
    });
    if (res.ok) {
      const { entry } = await res.json();
      setEntries(entries.map(e => e._id === entry._id ? entry : e));
      setRunningId(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Time Tracking</h1>
      <div className="flex gap-2 items-center flex-wrap">
        <select className="border rounded px-2 py-2 bg-transparent" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
          <option value="">All projects</option>
          {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
        <select className="border rounded px-2 py-2 bg-transparent" value={taskId} onChange={(e) => setTaskId(e.target.value)}>
          <option value="">Select task</option>
          {filteredTasks.map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
        </select>
        <input className="border rounded px-3 py-2 bg-transparent" placeholder="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        {!runningId ? (
          <button className="bg-black text-white px-3 py-2 rounded" onClick={startTimer} disabled={!taskId}>Start</button>
        ) : (
          <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={stopTimer}>Stop</button>
        )}
      </div>
      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e._id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="text-sm text-neutral-500">{new Date(e.startTime).toLocaleString()} {e.endTime ? `- ${new Date(e.endTime).toLocaleString()}` : "(running)"}</div>
              {e.note && <div className="text-sm">{e.note}</div>}
            </div>
            <div className="text-sm">Task: {tasks.find(t => t._id === e.taskId)?.title || e.taskId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


