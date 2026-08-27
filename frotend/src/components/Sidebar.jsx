import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
            isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`;

    return (
        <aside className="w-64 bg-gray-950 text-white min-h-screen p-5 flex flex-col">

            {/* =========================
                WORKSPHERE LOGO
            ========================= */}

            <div className="mb-10">

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-lg">
                        WS
                    </div>

                    <div>

                        <h1 className="text-lg font-bold">
                            WorkSphere
                        </h1>

                        <p className="text-blue-400 text-sm">
                            Workforce Management
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="space-y-2">

                <p className="text-xs uppercase tracking-wider text-gray-500 px-4 mb-3">
                    Main Menu
                </p>


                {/* Dashboard */}

                <NavLink
                    to="/admin/dashboard"
                    className={linkClass}
                >
                    <span>📊</span>
                    <span>Dashboard</span>
                </NavLink>


                {/* Employees */}

                <NavLink
                    to="/admin/employees"
                    className={linkClass}
                >
                    <span>👥</span>
                    <span>Employees</span>
                </NavLink>


                {/* Managers */}

                <NavLink
                    to="/admin/managers"
                    className={linkClass}
                >
                    <span>👔</span>
                    <span>Managers</span>
                </NavLink>


                {/* Tasks */}

                <NavLink
                    to="/admin/tasks"
                    className={linkClass}
                >
                    <span>📋</span>
                    <span>Tasks</span>
                </NavLink>


                {/* Reviews */}

                <NavLink
                    to="/admin/reviews"
                    className={linkClass}
                >
                    <span>⭐</span>
                    <span>Reviews</span>
                </NavLink>

            </nav>


            {/* =========================
                BOTTOM
            ========================= */}

            <div className="mt-auto">

                <div className="border-t border-gray-800 pt-5">

                    <div className="px-4">

                        <p className="text-xs text-gray-500">
                            System
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            WorkSphere
                        </p>

                    </div>

                </div>

            </div>

        </aside>
    );
};

export default Sidebar;