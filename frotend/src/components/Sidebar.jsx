import { NavLink } from "react-router-dom";

const Sidebar = () => {

    const linkClass = ({ isActive }) =>
        `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            isActive
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="w-72 bg-slate-950 text-white min-h-screen px-4 py-6 flex flex-col border-r border-slate-800">

            {/* =========================
                WORKSPHERE LOGO
            ========================= */}

            <div className="px-3 mb-10">

                <div className="flex items-center gap-3">

                    {/* Logo */}

                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/20">

                        WS

                    </div>


                    {/* Brand */}

                    <div>

                        <h1 className="text-xl font-bold tracking-tight text-white">

                            WorkSphere

                        </h1>

                        <p className="text-xs text-slate-500 mt-0.5">

                            Workforce Intelligence

                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="space-y-2">

                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-600 font-semibold px-4 mb-4">

                    Workspace

                </p>


                {/* Dashboard */}

                <NavLink
                    to="/admin/dashboard"
                    className={linkClass}
                >

                    <span className="text-lg">
                        ⊞
                    </span>

                    <span className="font-medium text-sm">
                        Dashboard
                    </span>

                </NavLink>


                {/* Employees */}

                <NavLink
                    to="/admin/employees"
                    className={linkClass}
                >

                    <span className="text-lg">
                        ♧
                    </span>

                    <span className="font-medium text-sm">
                        Employees
                    </span>

                </NavLink>


                {/* Managers */}

                <NavLink
                    to="/admin/managers"
                    className={linkClass}
                >

                    <span className="text-lg">
                        ◉
                    </span>

                    <span className="font-medium text-sm">
                        Managers
                    </span>

                </NavLink>


                {/* Tasks */}

                <NavLink
                    to="/admin/tasks"
                    className={linkClass}
                >

                    <span className="text-lg">
                        ✓
                    </span>

                    <span className="font-medium text-sm">
                        Tasks
                    </span>

                </NavLink>


                {/* Reviews */}

                <NavLink
                    to="/admin/reviews"
                    className={linkClass}
                >

                    <span className="text-lg">
                        ☆
                    </span>

                    <span className="font-medium text-sm">
                        Reviews
                    </span>

                </NavLink>

            </nav>


            {/* =========================
                AI INSIGHT CARD
            ========================= */}

            <div className="mt-auto">

                <div className="rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 border border-indigo-500/20 p-4 mb-5">

                    <div className="flex items-center gap-2 mb-2">

                        <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-sm">

                            ✦

                        </div>

                        <p className="text-sm font-semibold text-white">

                            WorkSphere AI

                        </p>

                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">

                        Intelligent workforce insights and smarter work management.

                    </p>

                    <div className="mt-3 text-xs text-indigo-400 font-medium">

                        Coming soon →

                    </div>

                </div>


                {/* =========================
                    SYSTEM INFO
                ========================= */}

                <div className="border-t border-slate-800 pt-5 px-3">

                    <p className="text-[11px] uppercase tracking-wider text-slate-600">

                        Platform

                    </p>

                    <p className="text-sm text-slate-400 mt-1">

                        WorkSphere v1.0

                    </p>

                </div>

            </div>

        </aside>
    );
};

export default Sidebar;