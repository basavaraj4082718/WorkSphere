import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


const AdminLayout = () => {

    return (

        <div className="flex min-h-screen bg-slate-50">


            {/* =========================
                SIDEBAR
            ========================= */}

            <Sidebar />


            {/* =========================
                MAIN AREA
            ========================= */}

            <div className="flex-1 min-w-0 flex flex-col">


                {/* NAVBAR */}

                <Navbar />


                {/* PAGE CONTENT */}

                <main className="flex-1 p-5 md:p-8 lg:p-10 bg-slate-50">

                    <div className="max-w-[1600px] mx-auto">

                        <Outlet />

                    </div>

                </main>


            </div>

        </div>

    );
};


export default AdminLayout;