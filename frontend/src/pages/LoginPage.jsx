import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LoginForm from "../components/forms/LoginForm";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");
    try {
      await login(values);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="font-heading mb-2 text-2xl font-bold">Welcome back</h1>
        <p className="mb-5 text-sm text-slate-600">Sign in to manage your team tasks.</p>

        {error && <p className="mb-3 rounded-xl bg-red-100 p-2 text-sm text-red-700">{error}</p>}
        <LoginForm onSubmit={handleSubmit} loading={loading} />

        <p className="mt-4 text-center text-sm text-slate-600">
          No account? <Link className="text-sky hover:underline" to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
