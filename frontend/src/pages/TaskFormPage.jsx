import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import { getProjectsApi } from "../api/projectApi";
import { createTaskApi, getTaskByIdApi, updateTaskApi } from "../api/taskApi";
import TaskForm from "../components/forms/TaskForm";

const dedupeUsersFromProjects = (projects) => {
  const userMap = new Map();
  projects.forEach((project) => {
    (project.members || []).forEach((member) => {
      userMap.set(member._id, member);
    });
  });
  return Array.from(userMap.values());
};

const TaskFormPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = Boolean(id);
  const projectIdFromState = location.state?.projectId || "";

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [initialTask, setInitialTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await getProjectsApi();
        const nextProjects = response.projects || [];
        setProjects(nextProjects);
        setUsers(dedupeUsersFromProjects(nextProjects));
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load projects");
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      if (projectIdFromState && projects.length) {
        setInitialTask((prev) => ({ ...prev, project: projectIdFromState }));
      }
      return;
    }

    const loadTask = async () => {
      try {
        const response = await getTaskByIdApi(id);
        setInitialTask(response.task);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load task");
      }
    };

    loadTask();
  }, [id, isEdit, projectIdFromState, projects.length]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");

      if (isEdit) {
        await updateTaskApi(id, values);
      } else {
        await createTaskApi(values);
      }

      navigate(`/projects/${values.project}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="font-heading text-2xl font-bold">{isEdit ? "Edit Task" : "Create Task"}</h1>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <TaskForm
        users={users}
        projects={projects}
        initialValue={initialTask}
        onSubmit={handleSubmit}
        loading={loading}
      />

      <Link className="btn-secondary" to="/projects">
        Back to Projects
      </Link>
    </section>
  );
};

export default TaskFormPage;
