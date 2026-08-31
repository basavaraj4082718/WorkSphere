import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/EmployeeSidebar.jsx";

const EmployeeLayout = () => {

    return (

        <div className="min-h-screen bg-slate-100">


            {/* SIDEBAR */}

            <EmployeeSidebar />


            {/* MAIN CONTENT */}

            <main className="lg:ml-64 min-h-screen">

                <div className="p-4 sm:p-6 lg:p-8">

                    <div className="max-w-[1600px] mx-auto">

                        <Outlet />

                    </div>

                </div>

            </main>

        </div>

    );
};

export default EmployeeLayout;