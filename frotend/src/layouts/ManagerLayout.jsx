import { Outlet } from "react-router-dom";

import ManagerSidebar from "../components/ManagerSidebar";
import ManagerNavbar from "../components/ManagerNavbar";

const ManagerLayout = () => {

    return (

        <div className="flex min-h-screen bg-slate-100">

            {/* SIDEBAR */}

            <ManagerSidebar />


            {/* MAIN AREA */}

            <div className="flex-1 min-w-0 flex flex-col">

                {/* NAVBAR */}

                <ManagerNavbar />


                {/* PAGE CONTENT */}

                <main className="flex-1 p-4 sm:p-6 lg:p-8">

                    <div className="max-w-[1600px] mx-auto w-full">

                        <Outlet />

                    </div>

                </main>

            </div>

        </div>

    );
};

export default ManagerLayout;