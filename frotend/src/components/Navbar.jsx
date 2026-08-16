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

        return "Dashboard";
    };

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

            <div>

                <p className="text-sm text-gray-500">
                    Admin Panel
                </p>

                <h2 className="text-xl font-semibold text-gray-900">
                    {getPageTitle()}
                </h2>

            </div>


            <div className="flex items-center gap-4">

                <div className="hidden sm:block text-right">

                    <p className="text-sm font-semibold text-gray-900">
                        Administrator
                    </p>

                    <p className="text-xs text-gray-500">
                        System Admin
                    </p>

                </div>

                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    A
                </div>

                <button
                    onClick={handleLogout}
                    className="border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                >
                    Logout
                </button>

            </div>

        </header>
    );
};

export default Navbar;