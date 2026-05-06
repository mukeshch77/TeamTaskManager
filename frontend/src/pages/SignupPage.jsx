import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SignupForm from "../components/forms/SignupForm";
import useAuth from "../hooks/useAuth";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError("");
    try {
      await signup(values);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="font-heading mb-2 text-2xl font-bold">Create account</h1>
        <p className="mb-5 text-sm text-slate-600">Join your team workspace.</p>

        {error && <p className="mb-3 rounded-xl bg-red-100 p-2 text-sm text-red-700">{error}</p>}
        <SignupForm onSubmit={handleSubmit} loading={loading} />

        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link className="text-sky hover:underline" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
