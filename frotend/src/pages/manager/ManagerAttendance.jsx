import { useEffect, useState } from "react";
import axios from "axios";

const ManagerAttendance = () => {

    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [manager, setManager] = useState(null);

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    // =========================================
    // FETCH MANAGER + TEAM ATTENDANCE
    // =========================================

    const fetchAttendance = async () => {

        try {

            setLoading(true);

            // Get logged-in manager
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


            // Keep only manager's employees
            const myEmployees =
                employeeResponse.data.filter(
                    (employee) =>
                        employee.managerId ===
                        managerData.managerId
                );


            setEmployees(myEmployees);


            // =========================================
            // GET TODAY'S ATTENDANCE
            // =========================================

            const attendanceResults = {};

            await Promise.all(

                myEmployees.map(async (employee) => {

                    try {

                        const response =
                            await axios.get(
                                `http://localhost:8080/api/attendance/today/${employee.id}`,
                                config
                            );

                        attendanceResults[employee.id] =
                            response.data;

                    } catch (error) {

                        // Employee has no attendance
                        // record today

                        attendanceResults[employee.id] = null;

                    }

                })

            );


            setAttendance(attendanceResults);


        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load attendance"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchAttendance();

    }, []);


    // =========================================
    // SEARCH
    // =========================================

    const filteredEmployees =
        employees.filter((employee) => {

            const searchValue =
                search.toLowerCase();

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

                employee.department
                    ?.toLowerCase()
                    .includes(searchValue)

            );

        });


    // =========================================
    // STATISTICS
    // =========================================

    const presentCount =
        employees.filter(
            (employee) =>
                attendance[employee.id]?.status ===
                "PRESENT"
        ).length;


    const halfDayCount =
        employees.filter(
            (employee) =>
                attendance[employee.id]?.status ===
                "HALF_DAY"
        ).length;


    const absentCount =
        employees.length -
        presentCount -
        halfDayCount;


    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (dateTime) => {

        if (!dateTime) {
            return "--";
        }

        return new Date(dateTime).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <p className="text-gray-500 text-lg">
                    Loading attendance...
                </p>

            </div>

        );

    }


    return (

        <div className="space-y-6">


            {/* =========================================
                HEADER
            ========================================= */}

            <div>

                <p className="text-blue-600 font-medium">
                    Attendance
                </p>

                <h1 className="text-3xl font-bold mt-1">

                    {manager?.managerName
                        ? `${manager.managerName}'s Team`
                        : "Team Attendance"}

                </h1>

                <p className="text-gray-500 mt-2">

                    Monitor today's attendance of your team.

                </p>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


                {/* Team */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Team Size
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {employees.length}
                            </p>

                        </div>

                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            👥
                        </div>

                    </div>

                </div>


                {/* Present */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Present
                            </p>

                            <p className="text-3xl font-bold mt-2 text-green-600">
                                {presentCount}
                            </p>

                        </div>

                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                            ✅
                        </div>

                    </div>

                </div>


                {/* Half Day */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Half Day
                            </p>

                            <p className="text-3xl font-bold mt-2 text-yellow-600">
                                {halfDayCount}
                            </p>

                        </div>

                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                            🌓
                        </div>

                    </div>

                </div>


                {/* Absent */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Not Marked
                            </p>

                            <p className="text-3xl font-bold mt-2 text-red-600">
                                {absentCount}
                            </p>

                        </div>

                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
                            ❌
                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH + REFRESH
            ========================================= */}

            <div className="bg-white rounded-xl shadow p-4">

                <div className="flex flex-col md:flex-row gap-3">

                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={fetchAttendance}
                        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Refresh
                    </button>

                </div>

            </div>


            {/* =========================================
                ATTENDANCE TABLE
            ========================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Employee
                            </th>

                            <th className="text-left p-4">
                                Department
                            </th>

                            <th className="text-left p-4">
                                Date
                            </th>

                            <th className="text-left p-4">
                                Check In
                            </th>

                            <th className="text-left p-4">
                                Check Out
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredEmployees.map(
                            (employee) => {

                                const record =
                                    attendance[
                                        employee.id
                                        ];


                                return (

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

                                                        {
                                                            employee.firstName
                                                        }{" "}

                                                        {
                                                            employee.lastName
                                                        }

                                                    </p>

                                                    <p className="text-xs text-gray-500">

                                                        {
                                                            employee.employeeCode
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* Department */}

                                        <td className="p-4">

                                            {employee.department}

                                        </td>


                                        {/* Date */}

                                        <td className="p-4 text-gray-600">

                                            {record?.attendanceDate ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]}

                                        </td>


                                        {/* Check In */}

                                        <td className="p-4">

                                            {record
                                                ? formatTime(
                                                    record.checkInTime
                                                )
                                                : "--"}

                                        </td>


                                        {/* Check Out */}

                                        <td className="p-4">

                                            {record
                                                ? formatTime(
                                                    record.checkOutTime
                                                )
                                                : "--"}

                                        </td>


                                        {/* Status */}

                                        <td className="p-4">

                                            {record ? (

                                                record.status ===
                                                "PRESENT" ? (

                                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">

                                                        Present

                                                    </span>

                                                ) : record.status ===
                                                "HALF_DAY" ? (

                                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">

                                                        Half Day

                                                    </span>

                                                ) : (

                                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">

                                                        Absent

                                                    </span>

                                                )

                                            ) : (

                                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">

                                                    Not Marked

                                                </span>

                                            )}

                                        </td>

                                    </tr>

                                );

                            }

                        )}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    EMPTY STATE
                ========================================= */}

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
                                : "You currently have no employees assigned to your team."
                            }

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};

export default ManagerAttendance;