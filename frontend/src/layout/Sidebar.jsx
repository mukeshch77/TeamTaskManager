import { NavLink } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Projects", to: "/projects" },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="w-full shrink-0 rounded-2xl bg-ink p-4 text-white md:w-64">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">Task Pilot</h1>
        <p className="mt-1 text-sm text-slate-300">Team Task Manager</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-white text-ink" : "text-slate-200 hover:bg-white/10"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        {user?.role === "admin" && (
          <NavLink
            to="/tasks/new"
            className={({ isActive }) =>
              `block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-coral text-white" : "bg-coral/90 text-white hover:bg-coral"
              }`
            }
          >
            New Task
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
