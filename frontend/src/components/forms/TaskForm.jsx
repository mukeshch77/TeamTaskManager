import { useEffect, useMemo, useState } from "react";

const defaultTask = {
  title: "",
  description: "",
  status: "todo",
  assignedTo: "",
  project: "",
  dueDate: "",
};

const TaskForm = ({ users = [], projects = [], initialValue, onSubmit, loading }) => {
  const [form, setForm] = useState(defaultTask);

  useEffect(() => {
    if (initialValue) {
      const dateValue = initialValue.dueDate
        ? new Date(initialValue.dueDate).toISOString().slice(0, 10)
        : "";

      setForm({
        title: initialValue.title || "",
        description: initialValue.description || "",
        status: initialValue.status || "todo",
        assignedTo: initialValue.assignedTo?._id || initialValue.assignedTo || "",
        project: initialValue.project?._id || initialValue.project || "",
        dueDate: dateValue,
      });
      return;
    }

    if (projects.length) {
      setForm((prev) => ({ ...prev, project: prev.project || projects[0]._id }));
    }
  }, [initialValue, projects]);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === form.project),
    [projects, form.project]
  );

  const availableAssignees = useMemo(() => {
    if (!selectedProject) return users;
    const memberIds = selectedProject.members?.map((member) => member._id) || [];
    return users.filter((user) => memberIds.includes(user._id));
  }, [users, selectedProject]);

  useEffect(() => {
    if (!form.assignedTo && availableAssignees.length) {
      setForm((prev) => ({ ...prev, assignedTo: availableAssignees[0]._id }));
    }
  }, [availableAssignees, form.assignedTo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      dueDate: form.dueDate || null,
    });
  };

  return (
    <form className="card space-y-4 p-5" onSubmit={handleSubmit}>
      <h2 className="font-heading text-xl font-semibold">Task Details</h2>

      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input className="input" name="title" value={form.title} onChange={handleChange} required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          className="input min-h-24"
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Project</label>
          <select className="input" name="project" value={form.project} onChange={handleChange} required>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Assignee</label>
          <select
            className="input"
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            required
          >
            {availableAssignees.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select className="input" name="status" value={form.status} onChange={handleChange}>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <input
            className="input"
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
          />
        </div>
      </div>

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Task"}
      </button>
    </form>
  );
};

export default TaskForm;
