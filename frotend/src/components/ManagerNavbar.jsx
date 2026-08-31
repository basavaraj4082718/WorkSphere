const ManagerNavbar = () => {

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/login";
    };


    return (

        <header className="h-[73px] shrink-0 bg-white/95 backdrop-blur border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex justify-between items-center">

            {/* =========================
                PAGE TITLE
            ========================= */}

            <div>

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
                    WorkSphere
                </p>

                <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
                    Manager Workspace
                </h2>

            </div>


            {/* =========================
                RIGHT SECTION
            ========================= */}

            <div className="flex items-center gap-3 sm:gap-4">


                {/* Manager Info */}

                <div className="hidden md:block text-right">

                    <p className="text-sm font-semibold text-slate-800">
                        Manager
                    </p>

                    <p className="text-xs text-slate-500 mt-0.5">
                        Team Management
                    </p>

                </div>


                {/* Avatar */}

                <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-200">
                    M
                </div>


                {/* Divider */}

                <div className="hidden sm:block h-8 w-px bg-slate-200"></div>


                {/* Logout */}

                <button
                    onClick={handleLogout}
                    className="px-3 sm:px-4 py-2 text-sm font-medium border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 active:scale-95 transition-all duration-200"
                >
                    <span className="hidden sm:inline">
                        Logout
                    </span>

                    <span className="sm:hidden">
                        ↪
                    </span>
                </button>

            </div>

        </header>
    );
};

export default ManagerNavbar;