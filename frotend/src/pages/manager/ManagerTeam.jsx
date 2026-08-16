import { useEffect, useState } from "react";
import axios from "axios";

const ManagerTeam = () => {
    const [employees, setEmployees] = useState([]);
    const [manager, setManager] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMyTeam = async () => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            // Get logged-in manager information
            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                config
            );

            const managerData = managerResponse.data;

            setManager(managerData);

            // Get all employees
            const employeeResponse = await axios.get(
                "http://localhost:8080/api/employees",
                config
            );

            // Keep only employees belonging to this manager
            const myEmployees = employeeResponse.data.filter(
                (employee) =>
                    employee.managerId === managerData.managerId
            );

            setEmployees(myEmployees);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load your team"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyTeam();
    }, []);

    // Search
    const filteredEmployees = employees.filter((employee) => {
        const searchValue = search.toLowerCase();

        return (
            employee.firstName
                ?.toLowerCase()
                .includes(searchValue) ||

            employee.lastName
                ?.toLowerCase()
                .includes(searchValue) ||

            employee.employeeCode
                ?.toLowerCase()
                .includes(searchValue) ||

            employee.email
                ?.toLowerCase()
                .includes(searchValue) ||

            employee.department
                ?.toLowerCase()
                .includes(searchValue) ||

            employee.designation
                ?.toLowerCase()
                .includes(searchValue)
        );
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500 text-lg">
                    Loading your team...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* =========================
          HEADER
      ========================= */}

            <div className="flex justify-between items-center">

                <div>
                    <p className="text-blue-600 font-medium">
                        My Team
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        {manager?.managerName
                            ? `${manager.managerName}'s Team`
                            : "My Team"}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage and monitor the employees assigned to you.
                    </p>
                </div>

                {/* Team Count */}

                <div className="bg-blue-50 border border-blue-100 px-6 py-4 rounded-xl text-center">

                    <p className="text-gray-500 text-sm">
                        Team Size
                    </p>

                    <p className="text-3xl font-bold text-blue-600">
                        {employees.length}
                    </p>

                </div>

            </div>


            {/* =========================
          SEARCH
      ========================= */}

            <div className="bg-white rounded-xl shadow p-4">

                <input
                    type="text"
                    placeholder="Search employees by name, code, email, department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =========================
          EMPLOYEE TABLE
      ========================= */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left p-4">
                            Employee
                        </th>

                        <th className="text-left p-4">
                            Code
                        </th>

                        <th className="text-left p-4">
                            Email
                        </th>

                        <th className="text-left p-4">
                            Department
                        </th>

                        <th className="text-left p-4">
                            Designation
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {filteredEmployees.map((employee) => (

                        <tr
                            key={employee.id}
                            className="border-t hover:bg-gray-50"
                        >

                            {/* Employee */}

                            <td className="p-4">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                        {employee.firstName
                                            ?.charAt(0)
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <p className="font-semibold">

                                            {employee.firstName}{" "}
                                            {employee.lastName}

                                        </p>

                                        <p className="text-sm text-gray-500">

                                            ID: {employee.id}

                                        </p>

                                    </div>

                                </div>

                            </td>


                            {/* Code */}

                            <td className="p-4">

                  <span className="bg-gray-100 px-3 py-1 rounded-md text-sm">

                    {employee.employeeCode}

                  </span>

                            </td>


                            {/* Email */}

                            <td className="p-4 text-gray-600">

                                {employee.email}

                            </td>


                            {/* Department */}

                            <td className="p-4">

                                {employee.department}

                            </td>


                            {/* Designation */}

                            <td className="p-4">

                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">

                    {employee.designation}

                  </span>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>


                {/* No Employees */}

                {filteredEmployees.length === 0 && (

                    <div className="text-center py-12">

                        <div className="text-5xl mb-3">
                            👥
                        </div>

                        <h2 className="text-xl font-semibold">
                            No employees found
                        </h2>

                        <p className="text-gray-500 mt-1">

                            {search
                                ? "No employees match your search."
                                : "You currently have no employees assigned to your team."}

                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ManagerTeam;