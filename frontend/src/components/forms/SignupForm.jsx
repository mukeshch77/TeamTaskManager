import { useState } from "react";

const SignupForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input className="input" name="name" value={form.name} onChange={handleChange} required />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          className="input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          className="input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Role</label>
        <select className="input" name="role" value={form.role} onChange={handleChange}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button className="btn-primary w-full" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
