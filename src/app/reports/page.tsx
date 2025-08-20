"use client";
import { useEffect, useMemo, useState } from "react";

interface TimeEntry { _id: string; taskId: string; startTime: string; endTime?: string; }
interface Task { _id: string; title: string; projectId: string }
interface Project { _id: string; name: string }

function minutesBetween(start: string, end?: string) {
  const s = new Date(start).getTime();
  const e = end ? new Date(end).getTime() : Date.now();
  return Math.max(0, Math.round((e - s) / 60000));
}

export default function ReportsPage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    (async () => {
      const [er, tr, pr] = await Promise.all([
        fetch("/api/time-entries"),
        fetch("/api/tasks"),
        fetch("/api/projects"),
      ]);
      if (er.ok) setEntries((await er.json()).entries);
      if (tr.ok) setTasks((await tr.json()).tasks);
      if (pr.ok) setProjects((await pr.json()).projects);
    })();
  }, []);

  const byProject = useMemo(() => {
    const projectMap: Record<string, number> = {};
    for (const entry of entries) {
      const task = tasks.find((t) => t._id === entry.taskId);
      if (!task) continue;
      const minutes = minutesBetween(entry.startTime, entry.endTime);
      projectMap[task.projectId] = (projectMap[task.projectId] || 0) + minutes;
    }
    return projectMap;
  }, [entries, tasks]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div>
        <a
          href="/api/reports/export"
          className="inline-block bg-black text-white px-3 py-2 rounded"
        >
          Export CSV
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded p-4">
          <h2 className="font-medium mb-2">Hours by Project</h2>
          <ul className="space-y-2">
            {Object.entries(byProject).map(([projectId, minutes]) => (
              <li key={projectId} className="flex justify-between">
                <span>{projects.find((p) => p._id === projectId)?.name || projectId}</span>
                <span>{(minutes / 60).toFixed(2)} h</span>
              </li>
            ))}
            {Object.keys(byProject).length === 0 && <li>No data</li>}
          </ul>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-medium mb-2">Recent Entries</h2>
          <ul className="space-y-2">
            {entries.slice(0, 10).map((e) => (
              <li key={e._id} className="flex justify-between">
                <span>{tasks.find((t) => t._id === e.taskId)?.title || e.taskId}</span>
                <span>{(minutesBetween(e.startTime, e.endTime) / 60).toFixed(2)} h</span>
              </li>
            ))}
            {entries.length === 0 && <li>No entries</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}


