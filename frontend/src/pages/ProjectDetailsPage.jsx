import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getProjectByIdApi } from "../api/projectApi";
import { deleteTaskApi, getTasksApi, updateTaskApi } from "../api/taskApi";
import TaskCard from "../components/tasks/TaskCard";
import useAuth from "../hooks/useAuth";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState("");

  const loadProject = async () => {
    try {
      const response = await getProjectByIdApi(id);
      setProject(response.project);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    }
  };

  const loadTasks = async () => {
    try {
      const response = await getTasksApi({ project: id });
      setTasks(response.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load tasks");
    }
  };

  useEffect(() => {
    loadProject();
    loadTasks();
  }, [id]);

  const filteredTasks = useMemo(() => {
    if (!statusFilter) return tasks;
    return tasks.filter((task) => task.status === statusFilter);
  }, [tasks, statusFilter]);

  const handleStatusUpdate = async (task) => {
    const nextStatusMap = {
      todo: "in-progress",
      "in-progress": "done",
      done: "todo",
    };

    try {
      await updateTaskApi(task._id, { status: nextStatusMap[task.status] });
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTaskApi(taskId);
      await loadTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Task delete failed");
    }
  };

  return (
    <section className="space-y-4">
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      {project ? (
        <div className="card p-5">
          <h1 className="font-heading text-2xl font-bold">{project.name}</h1>
          <p className="mt-2 text-slate-600">{project.description || "No description"}</p>
          <p className="mt-3 text-sm text-slate-500">
            Members: {project.members?.map((member) => member.name).join(", ")}
          </p>

          {user.role === "admin" ? (
            <div className="mt-4 flex gap-2">
              <button
                className="btn-primary"
                type="button"
                onClick={() => navigate("/tasks/new", { state: { projectId: id } })}
              >
                Create Task
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Tasks</h2>
          <select
            className="input w-auto"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {!filteredTasks.length ? <p className="text-sm text-slate-500">No tasks found.</p> : null}

        <div className="grid gap-3 lg:grid-cols-2">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              canManage={user.role === "admin"}
              onStatus={handleStatusUpdate}
              onEdit={(currentTask) => navigate(`/tasks/${currentTask._id}/edit`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      <Link className="btn-secondary" to="/projects">
        Back to Projects
      </Link>
    </section>
  );
};

export default ProjectDetailsPage;
