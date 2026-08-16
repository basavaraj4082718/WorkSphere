import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeAttendance() {

    const [employeeId, setEmployeeId] = useState(null);

    const [todayAttendance, setTodayAttendance] = useState(null);

    const [attendanceList, setAttendanceList] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================
    // GET EMPLOYEE ID
    // =========================================

    const getEmployee = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/dashboard/employee/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEmployeeId(response.data.employeeId);

            return response.data.employeeId;

        } catch (error) {

            console.error(
                "EMPLOYEE FETCH ERROR:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to load employee information"
            );

            return null;
        }
    };


    // =========================================
    // FETCH ATTENDANCE
    // =========================================

    const fetchAttendance = async (id) => {

        try {

            const token = localStorage.getItem("token");

            // -------------------------------
            // GET ATTENDANCE HISTORY
            // -------------------------------

            const historyResponse = await axios.get(
                `http://localhost:8080/api/attendance/employee/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAttendanceList(
                historyResponse.data
            );


            // -------------------------------
            // GET TODAY ATTENDANCE
            // -------------------------------

            try {

                const todayResponse = await axios.get(
                    `http://localhost:8080/api/attendance/today/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTodayAttendance(
                    todayResponse.data
                );

            } catch (todayError) {

                // No attendance marked today

                setTodayAttendance(null);
            }

        } catch (error) {

            console.error(
                "ATTENDANCE FETCH ERROR:",
                error
            );

            setError(
                error.response?.data ||
                "Unable to load attendance"
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        const loadAttendance = async () => {

            const id = await getEmployee();

            if (id) {

                await fetchAttendance(id);

            } else {

                setLoading(false);
            }
        };

        loadAttendance();

    }, []);


    // =========================================
    // CHECK IN
    // =========================================

    const handleCheckIn = async () => {

        if (!employeeId) return;

        setActionLoading(true);

        setError("");

        try {

            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:8080/api/attendance/checkin/${employeeId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Checked in successfully!");

            await fetchAttendance(employeeId);

        } catch (error) {

            console.error(
                "CHECK IN ERROR:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to check in"
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =========================================
    // CHECK OUT
    // =========================================

    const handleCheckOut = async () => {

        if (!employeeId) return;

        setActionLoading(true);

        setError("");

        try {

            const token = localStorage.getItem("token");

            await axios.post(
                `http://localhost:8080/api/attendance/checkout/${employeeId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Checked out successfully!");

            await fetchAttendance(employeeId);

        } catch (error) {

            console.error(
                "CHECK OUT ERROR:",
                error
            );

            alert(
                error.response?.data ||
                "Unable to check out"
            );

        } finally {

            setActionLoading(false);
        }
    };


    // =========================================
    // CALCULATE STATISTICS
    // =========================================

    const totalDays =
        attendanceList.length;

    const presentDays =
        attendanceList.filter(
            item => item.status === "PRESENT"
        ).length;

    const halfDays =
        attendanceList.filter(
            item => item.status === "HALF_DAY"
        ).length;

    const absentDays =
        attendanceList.filter(
            item => item.status === "ABSENT"
        ).length;

    const attendancePercentage =
        totalDays > 0
            ? Math.round(
                ((presentDays + halfDays * 0.5) /
                    totalDays) * 100
            )
            : 0;


    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (time) => {

        if (!time) {
            return "--";
        }

        return new Date(time).toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "--";
        }

        return new Date(
            date + "T00:00:00"
        ).toLocaleDateString(
            [],
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Attendance
                </h1>

                <p className="text-gray-500 mt-2">
                    Loading attendance...
                </p>

            </div>
        );
    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="p-6 space-y-6">

            {/* =================================
                HEADER
            ================================= */}

            <div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Attendance
                </h1>

                <p className="text-gray-500 mt-1">
                    Track your daily attendance and working hours.
                </p>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">

                    {error}

                </div>

            )}


            {/* =================================
                TODAY CARD
            ================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex justify-between items-center">

                    <div>

                        <p className="text-sm text-gray-500">
                            Today's Attendance
                        </p>

                        <h2 className="text-2xl font-bold mt-1">

                            {todayAttendance
                                ? todayAttendance.status
                                : "Not Marked"}

                        </h2>

                    </div>


                    <div className="flex gap-3">

                        <button
                            onClick={handleCheckIn}
                            disabled={
                                actionLoading ||
                                todayAttendance !== null
                            }
                            className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                                actionLoading ||
                                todayAttendance !== null
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                        >

                            {actionLoading
                                ? "Processing..."
                                : "Check In"}

                        </button>


                        <button
                            onClick={handleCheckOut}
                            disabled={
                                actionLoading ||
                                !todayAttendance ||
                                todayAttendance.checkOutTime !== null
                            }
                            className={`px-5 py-2.5 rounded-lg font-medium text-white ${
                                actionLoading ||
                                !todayAttendance ||
                                todayAttendance.checkOutTime !== null
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >

                            Check Out

                        </button>

                    </div>

                </div>


                {/* TODAY DETAILS */}

                {todayAttendance && (

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Date
                            </p>

                            <p className="font-semibold mt-1">
                                {formatDate(
                                    todayAttendance.attendanceDate
                                )}
                            </p>

                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Check In
                            </p>

                            <p className="font-semibold mt-1">
                                {formatTime(
                                    todayAttendance.checkInTime
                                )}
                            </p>

                        </div>


                        <div className="bg-gray-50 rounded-lg p-4">

                            <p className="text-sm text-gray-500">
                                Check Out
                            </p>

                            <p className="font-semibold mt-1">
                                {formatTime(
                                    todayAttendance.checkOutTime
                                )}
                            </p>

                        </div>

                    </div>

                )}

            </div>


            {/* =================================
                STATISTICS
            ================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* TOTAL */}

                <div className="bg-white rounded-xl shadow-sm border p-5">

                    <p className="text-sm text-gray-500">
                        Total Days
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {totalDays}
                    </p>

                </div>


                {/* PRESENT */}

                <div className="bg-white rounded-xl shadow-sm border p-5">

                    <p className="text-sm text-gray-500">
                        Present
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {presentDays}
                    </p>

                </div>


                {/* HALF DAY */}

                <div className="bg-white rounded-xl shadow-sm border p-5">

                    <p className="text-sm text-gray-500">
                        Half Days
                    </p>

                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {halfDays}
                    </p>

                </div>


                {/* PERCENTAGE */}

                <div className="bg-white rounded-xl shadow-sm border p-5">

                    <p className="text-sm text-gray-500">
                        Attendance
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {attendancePercentage}%
                    </p>

                </div>

            </div>


            {/* =================================
                ATTENDANCE HISTORY
            ================================= */}

            <div className="bg-white rounded-xl shadow-sm border">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-bold">
                        Attendance History
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Your attendance records
                    </p>

                </div>


                {attendanceList.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            No attendance records found.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-50">

                            <tr>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Date
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Check In
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Check Out
                                </th>

                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {attendanceList.map(
                                (attendance) => (

                                    <tr
                                        key={attendance.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="px-6 py-4">

                                            {formatDate(
                                                attendance.attendanceDate
                                            )}

                                        </td>


                                        <td className="px-6 py-4">

                                            {formatTime(
                                                attendance.checkInTime
                                            )}

                                        </td>


                                        <td className="px-6 py-4">

                                            {formatTime(
                                                attendance.checkOutTime
                                            )}

                                        </td>


                                        <td className="px-6 py-4">

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        attendance.status ===
                                                        "PRESENT"
                                                            ? "bg-green-100 text-green-700"
                                                            : attendance.status ===
                                                            "HALF_DAY"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                                >

                                                    {attendance.status}

                                                </span>

                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default EmployeeAttendance;