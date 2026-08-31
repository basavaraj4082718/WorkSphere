import { useLocation } from "react-router-dom";

const Navbar = () => {

    const location = useLocation();


    const handleLogout = () => {

        localStorage.removeItem("token");

        window.location.href = "/login";

    };


    const getPageTitle = () => {

        if (location.pathname.includes("employees")) {

            return "Employees";

        }

        if (location.pathname.includes("managers")) {

            return "Managers";

        }

        if (location.pathname.includes("tasks")) {

            return "Tasks";

        }

        if (location.pathname.includes("reviews")) {

            return "Reviews";

        }

        return "Dashboard";

    };


    const getPageDescription = () => {

        if (location.pathname.includes("employees")) {

            return "Manage your organization's workforce";

        }

        if (location.pathname.includes("managers")) {

            return "Manage teams and leadership";

        }

        if (location.pathname.includes("tasks")) {

            return "Track and manage organization tasks";

        }

        if (location.pathname.includes("reviews")) {

            return "Monitor employee performance reviews";

        }

        return "Monitor your organization at a glance";

    };


    return (

        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200 px-6 md:px-8 py-4">

            <div className="flex items-center justify-between">


                {/* =========================
                    PAGE INFO
                ========================= */}

                <div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">

                        <span>
                            WorkSphere
                        </span>

                        <span>
                            /
                        </span>

                        <span className="text-indigo-500">
                            Admin
                        </span>

                    </div>


                    <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">

                        {getPageTitle()}

                    </h2>


                    <p className="hidden sm:block text-sm text-slate-500 mt-1">

                        {getPageDescription()}

                    </p>

                </div>


                {/* =========================
                    USER ACTIONS
                ========================= */}

                <div className="flex items-center gap-3">


                    {/* Notification */}

                    <button
                        className="hidden sm:flex w-10 h-10 rounded-xl border border-slate-200 items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition"
                    >

                        🔔

                    </button>


                    {/* Divider */}

                    <div className="hidden md:block h-9 w-px bg-slate-200"></div>


                    {/* Admin Profile */}

                    <div className="hidden sm:flex items-center gap-3">

                        <div className="text-right">

                            <p className="text-sm font-semibold text-slate-800">

                                Administrator

                            </p>

                            <p className="text-xs text-slate-400">

                                System Admin

                            </p>

                        </div>


                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">

                            A

                        </div>

                    </div>


                    {/* Logout */}

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
                    >

                        Logout

                    </button>

                </div>

            </div>

        </header>

    );
};

export default Navbar;