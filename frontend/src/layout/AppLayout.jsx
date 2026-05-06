import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-4 p-4 md:flex-row">
      <Sidebar />

      <main className="w-full space-y-4">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
