import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="font-heading text-4xl font-bold">404</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Link className="btn-primary mt-4" to="/dashboard">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
