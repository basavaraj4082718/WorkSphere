const ManagerNavbar = () => {

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/login";
    };


    return (

        <div className="bg-white shadow-sm border-b p-4 flex justify-between items-center">

            <div>

                <p className="text-sm text-gray-500">
                    WorkSphere
                </p>

                <h2 className="text-xl font-semibold text-gray-900">
                    Manager Panel
                </h2>

            </div>


            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>

        </div>
    );
};

export default ManagerNavbar;