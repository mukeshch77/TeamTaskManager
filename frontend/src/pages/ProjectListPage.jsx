import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { createProjectApi, getProjectsApi } from "../api/projectApi";
import useAuth from "../hooks/useAuth";

const ProjectListPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      const response = await getProjectsApi();
      setProjects(response.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      setError("");
      await createProjectApi(newProject);
      setNewProject({ name: "", description: "" });
      await loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project");
    }
  };

  return (
    <section className="space-y-4">
      {user.role === "admin" ? (
        <form className="card grid gap-3 p-4 md:grid-cols-3" onSubmit={handleCreate}>
          <input
            className="input"
            placeholder="Project name"
            value={newProject.name}
            onChange={(event) => setNewProject((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            className="input"
            placeholder="Description"
            value={newProject.description}
            onChange={(event) =>
              setNewProject((prev) => ({ ...prev, description: event.target.value }))
            }
          />
          <button className="btn-primary" type="submit">
            Create Project
          </button>
        </form>
      ) : null}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-3 md:grid-cols-2">
        {projects.map((project) => (
          <article key={project._id} className="card p-4">
            <h3 className="font-heading text-lg font-semibold">{project.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{project.description || "No description"}</p>
            <p className="mt-2 text-xs text-slate-500">Members: {project.members?.length || 0}</p>
            <Link className="btn-primary mt-4" to={`/projects/${project._id}`}>
              Open Project
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ProjectListPage;
