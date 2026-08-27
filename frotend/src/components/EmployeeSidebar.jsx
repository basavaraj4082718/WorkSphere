import { NavLink, useNavigate } from "react-router-dom";

const EmployeeSidebar = () => {

    const navigate = useNavigate();

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


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/login");

    };


    return (

        <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

            {/* =====================================================
                WORKSPHERE LOGO
            ===================================================== */}

            <div className="px-6 py-6 border-b border-slate-700">

                <h1 className="text-2xl font-bold">
                    Work<span className="text-blue-400">Sphere</span>
                </h1>

                <p className="text-sm text-slate-400 mt-1">
                    Employee Portal
                </p>

            </div>


            {/* =====================================================
                MENU
            ===================================================== */}

            <nav className="flex-1 px-4 py-6 space-y-2">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`
                        }
                    >

                        <span className="text-xl">
                            {item.icon}
                        </span>

                        <span className="font-medium">
                            {item.name}
                        </span>

                    </NavLink>

                ))}

            </nav>


            {/* =====================================================
                USER
            ===================================================== */}

            <div className="px-4 pb-4">

                <div className="bg-slate-800 rounded-xl p-4 mb-3">

                    <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                            E
                        </div>

                        <div>

                            <p className="font-semibold">
                                Employee
                            </p>

                            <p className="text-xs text-slate-400">
                                Employee Account
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    LOGOUT
                ===================================================== */}

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-600 hover:text-white transition"
                >

                    <span className="text-xl">
                        🚪
                    </span>

                    <span className="font-medium">
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
};

export default EmployeeSidebar;