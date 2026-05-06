const statusStyles = {
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-sky-100 text-sky-700",
  done: "bg-emerald-100 text-emerald-700",
};

const TaskStatusBadge = ({ status }) => {
  return (
    <span className={`badge ${statusStyles[status] || statusStyles.todo}`}>
      {status}
    </span>
  );
};

export default TaskStatusBadge;
