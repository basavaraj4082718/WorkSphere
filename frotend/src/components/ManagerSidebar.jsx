import { NavLink } from "react-router-dom";

const ManagerSidebar = () => {

    const linkClass = ({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    return (

        <aside className="w-64 shrink-0 bg-slate-950 text-white sticky top-0 h-screen p-5 flex flex-col border-r border-slate-800">

            {/* =========================
                WORKSPHERE LOGO
            ========================= */}

            <div className="mb-10">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-950/40">
                        WS
                    </div>

                    <div>

                        <h1 className="text-lg font-bold tracking-tight text-white">
                            WorkSphere
                        </h1>

                        <p className="text-indigo-400 text-xs mt-0.5">
                            Workforce Intelligence
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="space-y-2 flex-1 overflow-y-auto">

                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 px-4 mb-4 font-semibold">
                    Manager Workspace
                </p>


                {/* Dashboard */}

                <NavLink
                    to="/manager/dashboard"
                    className={linkClass}
                >
                    <span className="text-lg">
                        📊
                    </span>

                    <span className="font-medium text-sm">
                        Dashboard
                    </span>
                </NavLink>


                {/* My Team */}

                <NavLink
                    to="/manager/team"
                    className={linkClass}
                >
                    <span className="text-lg">
                        👥
                    </span>

                    <span className="font-medium text-sm">
                        My Team
                    </span>
                </NavLink>


                {/* Tasks */}

                <NavLink
                    to="/manager/tasks"
                    className={linkClass}
                >
                    <span className="text-lg">
                        📋
                    </span>

                    <span className="font-medium text-sm">
                        Task Management
                    </span>
                </NavLink>


                {/* Attendance */}

                <NavLink
                    to="/manager/attendance"
                    className={linkClass}
                >
                    <span className="text-lg">
                        🕐
                    </span>

                    <span className="font-medium text-sm">
                        Attendance
                    </span>
                </NavLink>


                {/* Leave Requests */}

                <NavLink
                    to="/manager/leaves"
                    className={linkClass}
                >
                    <span className="text-lg">
                        📅
                    </span>

                    <span className="font-medium text-sm">
                        Leave Requests
                    </span>
                </NavLink>


                {/* Reviews */}

                <NavLink
                    to="/manager/reviews"
                    className={linkClass}
                >
                    <span className="text-lg">
                        ⭐
                    </span>

                    <span className="font-medium text-sm">
                        Performance Reviews
                    </span>
                </NavLink>

            </nav>


            {/* =========================
                BOTTOM BRANDING
            ========================= */}

            <div className="pt-5 mt-auto">

                <div className="border-t border-slate-800 pt-5">

                    <div className="bg-slate-900/70 rounded-xl px-4 py-3 border border-slate-800">

                        <p className="text-[11px] uppercase tracking-wider text-slate-500">
                            Workspace
                        </p>

                        <div className="flex items-center justify-between mt-1">

                            <p className="text-sm text-slate-300 font-medium">
                                Manager Portal
                            </p>

                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>

                        </div>

                    </div>

                </div>

            </div>

        </aside>
    );
};

export default ManagerSidebar;