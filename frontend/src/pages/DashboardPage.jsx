import { useEffect, useMemo, useState } from "react";

import { getDashboardStatsApi } from "../api/dashboardApi";
import { getProjectsApi } from "../api/projectApi";

const statCards = [
  { key: "totalTasks", label: "Total Tasks", color: "text-ink" },
  { key: "completedTasks", label: "Completed", color: "text-mint" },
  { key: "overdueTasks", label: "Overdue", color: "text-ember" },
];

const DashboardPage = () => {
  const [filters, setFilters] = useState({ project: "", status: "" });
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState({ stats: {}, tasks: [], statusBreakdown: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await getProjectsApi();
        setProjects(response.projects || []);
      } catch (err) {
        setProjects([]);
      }
    };

    loadProjects();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => Boolean(value))
      );
      const response = await getDashboardStatsApi(params);
      setData(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.project, filters.status]);

  const statusMap = useMemo(() => {
    return data.statusBreakdown.reduce((acc, current) => {
      acc[current._id] = current.count;
      return acc;
    }, {});
  }, [data.statusBreakdown]);

  return (
    <section className="space-y-4">
      <div className="card p-4">
        <div className="grid gap-3 md:grid-cols-3">
          {statCards.map((item) => (
            <div key={item.key} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className={`font-heading mt-1 text-3xl font-bold ${item.color}`}>
                {data.stats?.[item.key] ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-heading mb-3 text-lg font-semibold">Filters</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="input"
            value={filters.project}
            onChange={(event) => setFilters((prev) => ({ ...prev, project: event.target.value }))}
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            className="input"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <button className="btn-secondary" type="button" onClick={loadData}>
            Refresh
          </button>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-heading mb-3 text-lg font-semibold">Status Breakdown</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-3">Todo: {statusMap.todo || 0}</div>
          <div className="rounded-2xl bg-slate-50 p-3">In Progress: {statusMap["in-progress"] || 0}</div>
          <div className="rounded-2xl bg-slate-50 p-3">Done: {statusMap.done || 0}</div>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-heading mb-3 text-lg font-semibold">Recent Tasks</h2>
        {loading ? <p>Loading...</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        {!loading && !data.tasks?.length ? <p className="text-sm text-slate-500">No tasks found.</p> : null}

        <div className="space-y-2">
          {(data.tasks || []).slice(0, 8).map((task) => (
            <div key={task._id} className="rounded-xl border border-slate-100 p-3 text-sm">
              <p className="font-medium">{task.title}</p>
              <p className="text-slate-500">
                {task.project?.name} | {task.assignedTo?.name} | {task.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
