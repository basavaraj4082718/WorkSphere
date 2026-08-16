import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">

            <Sidebar />

            <div className="flex-1 min-w-0">

                <Navbar />

                <main className="p-6 md:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;