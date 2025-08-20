"use client";
import { useEffect, useState } from "react";

interface ActiveEntry { _id: string; userId: string; taskId: string; startTime: string; endTime?: string }

export default function TeamPage() {
  const [active, setActive] = useState<ActiveEntry[]>([]);

  async function load() {
    const res = await fetch("/api/team/activity");
    if (res.ok) {
      const j = await res.json();
      setActive(j.active);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Team Activity</h1>
      <ul className="space-y-2">
        {active.map((e) => (
          <li key={e._id} className="border rounded p-3 flex justify-between">
            <div>
              <div className="text-sm text-neutral-500">Started: {new Date(e.startTime).toLocaleTimeString()}</div>
            </div>
            <div className="text-sm">User: {e.userId} | Task: {e.taskId}</div>
          </li>
        ))}
        {active.length === 0 && <li>No active timers</li>}
      </ul>
    </div>
  );
}


