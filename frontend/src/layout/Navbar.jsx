import useAuth from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="card flex items-center justify-between p-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Signed in as</p>
        <h2 className="font-heading text-lg font-semibold text-ink">
          {user?.name} ({user?.role})
        </h2>
      </div>

      <button type="button" className="btn-secondary" onClick={logout}>
        Logout
      </button>
    </header>
  );
};

export default Navbar;
