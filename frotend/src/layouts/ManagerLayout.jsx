import { Outlet } from "react-router-dom";

import ManagerSidebar from "../components/ManagerSidebar";
import ManagerNavbar from "../components/ManagerNavbar";

const ManagerLayout = () => {

    return (

        <div className="flex min-h-screen bg-slate-100">

            <ManagerSidebar />

            <div className="flex-1">

                <ManagerNavbar />

                <main className="p-6">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default ManagerLayout;