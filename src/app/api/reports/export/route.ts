import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TimeEntry } from "@/models/TimeEntry";
import { Task } from "@/models/Task";
import { Project } from "@/models/Project";
import { verifyAuthToken } from "@/lib/auth";
import { getAuthCookie } from "@/lib/cookies";

export const runtime = "nodejs";

function toCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET(req: NextRequest) {
  await connectToDatabase();
  const token = await getAuthCookie();
  if (!token) return new Response("Unauthorized", { status: 401 });
  const user = await verifyAuthToken(token).catch(() => null);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const start = req.nextUrl.searchParams.get("start");
  const end = req.nextUrl.searchParams.get("end");

  const filter: Record<string, unknown> = { userId: user.sub };
  if (start || end) {
    const range: Record<string, Date> = {};
    if (start) range.$gte = new Date(start);
    if (end) range.$lte = new Date(end);
    (filter as Record<string, unknown>).startTime = range;
  }

  const entries = await TimeEntry.find(filter).sort({ startTime: -1 }).lean();
  const taskIds = Array.from(new Set(entries.map((e) => String(e.taskId))));
  const tasks = await Task.find({ _id: { $in: taskIds } }).lean();
  const projectIds = Array.from(new Set(tasks.map((t) => String(t.projectId))));
  const projects = await Project.find({ _id: { $in: projectIds } }).lean();

  const taskMap = new Map(tasks.map((t) => [String(t._id), t] as const));
  const projectMap = new Map(projects.map((p) => [String(p._id), p] as const));

  const rows: string[] = [];
  rows.push([
    "Start Time",
    "End Time",
    "Duration (minutes)",
    "Project",
    "Task",
    "Note",
  ].map(toCsvValue).join(","));

  for (const e of entries) {
    const startTime = new Date(e.startTime);
    const endTime = e.endTime ? new Date(e.endTime) : undefined;
    const dur = Math.max(0, Math.round(((endTime?.getTime() ?? Date.now()) - startTime.getTime()) / 60000));
    const task = taskMap.get(String(e.taskId));
    const project = task ? projectMap.get(String(task.projectId)) : undefined;
    rows.push([
      startTime.toISOString(),
      endTime ? endTime.toISOString() : "",
      String(dur),
      project?.name ?? String(task?.projectId ?? ""),
      task?.title ?? String(e.taskId),
      e.note ?? "",
    ].map(toCsvValue).join(","));
  }

  const csv = rows.join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=\"time_report.csv\"",
      "Cache-Control": "no-store",
    },
  });
}


