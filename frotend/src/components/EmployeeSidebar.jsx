import { NavLink, useNavigate } from "react-router-dom";

const EmployeeSidebar = () => {

    const navigate = useNavigate();


    // =========================================
    // MENU ITEMS
    // =========================================

    const menuItems = [
        {
            name: "Dashboard",
            path: "/employee/dashboard",
            icon: "🏠",
        },
        {
            name: "My Tasks",
            path: "/employee/tasks",
            icon: "📋",
        },
        {
            name: "Attendance",
            path: "/employee/attendance",
            icon: "🕐",
        },
        {
            name: "Performance",
            path: "/employee/performance",
            icon: "⭐",
        },
        {
            name: "Reviews",
            path: "/employee/reviews",
            icon: "📝",
        },
        {
            name: "Leave Requests",
            path: "/employee/leaves",
            icon: "🌴",
        },
    ];


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");

    };


    return (

        <aside
            className="
                fixed
                top-0
                left-0
                z-40
                w-64
                h-screen
                bg-slate-950
                text-white
                flex
                flex-col
                border-r
                border-slate-800
            "
        >


            {/* =====================================
                WORKSPHERE LOGO
            ===================================== */}

            <div className="px-5 py-6">

                <div className="flex items-center gap-3">


                    {/* LOGO */}

                    <div className="
                        w-11 h-11
                        shrink-0
                        bg-gradient-to-br
                        from-indigo-500
                        to-violet-600
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-sm
                        shadow-lg
                        shadow-indigo-950/40
                    ">
                        WS
                    </div>


                    {/* BRAND */}

                    <div>

                        <h1 className="
                            text-lg
                            font-bold
                            tracking-tight
                            text-white
                        ">
                            WorkSphere
                        </h1>

                        <p className="
                            text-xs
                            text-indigo-400
                            mt-0.5
                        ">
                            Workforce Intelligence
                        </p>

                    </div>

                </div>

            </div>


            {/* DIVIDER */}

            <div className="border-t border-slate-800" />


            {/* =====================================
                NAVIGATION
            ===================================== */}

            <nav className="
                flex-1
                px-4
                py-6
                space-y-2
                overflow-y-auto
            ">


                {/* SECTION TITLE */}

                <p className="
                    text-[11px]
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                    px-4
                    mb-4
                    font-semibold
                ">
                    Employee Workspace
                </p>


                {/* MENU ITEMS */}

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}

                        className={({ isActive }) =>

                            `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? `
                                        bg-indigo-600
                                        text-white
                                        shadow-lg
                                        shadow-indigo-950/30
                                    `
                                    : `
                                        text-slate-400
                                        hover:bg-slate-800
                                        hover:text-white
                                    `
                            }`
                        }
                    >


                        {/* ICON */}

                        <span className="
                            text-lg
                            w-6
                            flex
                            justify-center
                            transition-transform
                            duration-200
                            group-hover:scale-110
                        ">
                            {item.icon}
                        </span>


                        {/* TEXT */}

                        <span className="
                            font-medium
                            text-sm
                        ">
                            {item.name}
                        </span>

                    </NavLink>

                ))}

            </nav>


            {/* =====================================
                USER SECTION
            ===================================== */}

            <div className="px-4 pb-5">


                <div className="
                    border-t
                    border-slate-800
                    pt-5
                ">


                    {/* USER CARD */}

                    <div className="
                        bg-slate-900/70
                        rounded-xl
                        p-3
                        border
                        border-slate-800
                        mb-3
                    ">

                        <div className="
                            flex
                            items-center
                            gap-3
                        ">


                            {/* AVATAR */}

                            <div className="
                                w-10
                                h-10
                                shrink-0
                                rounded-xl
                                bg-gradient-to-br
                                from-indigo-500
                                to-violet-600
                                flex
                                items-center
                                justify-center
                                font-bold
                                text-sm
                                shadow-lg
                                shadow-indigo-950/30
                            ">
                                E
                            </div>


                            {/* USER INFO */}

                            <div className="min-w-0">

                                <p className="
                                    font-semibold
                                    text-sm
                                    text-slate-200
                                    truncate
                                ">
                                    Employee
                                </p>

                                <p className="
                                    text-xs
                                    text-slate-500
                                    mt-0.5
                                ">
                                    Employee Account
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}

                        className="
                            w-full
                            flex
                            items-center
                            gap-3
                            px-4
                            py-3
                            rounded-xl
                            text-slate-400
                            hover:bg-red-500/10
                            hover:text-red-400
                            transition-all
                            duration-200
                        "
                    >

                        <span className="text-lg w-6 text-center">
                            🚪
                        </span>

                        <span className="
                            font-medium
                            text-sm
                        ">
                            Logout
                        </span>

                    </button>

                </div>

            </div>

        </aside>
    );
};

export default EmployeeSidebar;