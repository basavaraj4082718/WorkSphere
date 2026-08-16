import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar.jsx";

const EmployeeLayout = () => {

  return (

    <div className="min-h-screen bg-slate-100 flex">

      {/* SIDEBAR */}

      <EmployeeSidebar />


      {/* MAIN CONTENT */}

      <main className="flex-1 min-w-0">

        <div className="p-6 lg:p-8">

          <Outlet />

        </div>

      </main>

    </div>

  );
};

export default EmployeeLayout;