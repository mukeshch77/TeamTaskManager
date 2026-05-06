import TaskStatusBadge from "./TaskStatusBadge";

const formatDate = (value) => {
  if (!value) return "No due date";
  const date = new Date(value);
  return date.toLocaleDateString();
};

const TaskCard = ({ task, canManage, onEdit, onDelete, onStatus }) => {
  return (
    <article className="card animate-rise p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="font-heading text-lg font-semibold text-ink">{task.title}</h3>
        <TaskStatusBadge status={task.status} />
      </div>

      <p className="mb-3 text-sm text-slate-600">{task.description || "No description"}</p>

      <div className="mb-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Assignee: {task.assignedTo?.name || "Unknown"}</span>
        <span>Due: {formatDate(task.dueDate)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => onStatus(task)}
        >
          Update Status
        </button>
        {canManage && (
          <>
            <button type="button" className="btn-secondary" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button
              type="button"
              className="btn rounded-xl bg-ember text-white hover:opacity-90"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
