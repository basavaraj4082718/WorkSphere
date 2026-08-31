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

            const historyResponse = await axios.get(
                `http://localhost:8080/api/attendance/employee/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAttendanceList(historyResponse.data);


            try {

                const todayResponse = await axios.get(
                    `http://localhost:8080/api/attendance/today/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setTodayAttendance(todayResponse.data);

            } catch (todayError) {

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

    const totalDays = attendanceList.length;

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

        if (!time) return "--";

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

        if (!date) return "--";

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
    // STATUS STYLE
    // =========================================

    const getStatusStyle = (status) => {

        if (status === "PRESENT") {
            return "bg-emerald-100 text-emerald-700 border border-emerald-200";
        }

        if (status === "HALF_DAY") {
            return "bg-amber-100 text-amber-700 border border-amber-200";
        }

        if (status === "ABSENT") {
            return "bg-red-100 text-red-700 border border-red-200";
        }

        return "bg-slate-100 text-slate-700 border border-slate-200";
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-500 mt-4">
                        Loading attendance...
                    </p>

                </div>

            </div>

        );
    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="space-y-8">


            {/* =================================
                HEADER
            ================================= */}

            <div>

                <p className="text-indigo-600 font-medium">
                    Employee Workspace
                </p>

                <h1 className="text-4xl font-bold text-slate-900 mt-1">
                    Attendance
                </h1>

                <p className="text-slate-500 mt-2 text-lg">
                    Track your daily attendance and working hours.
                </p>

            </div>


            {/* =================================
                ERROR
            ================================= */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                    <div className="flex items-center gap-3">

                        <span className="text-xl">
                            ⚠️
                        </span>

                        {error}

                    </div>

                </div>

            )}


            {/* =================================
                TODAY ATTENDANCE
            ================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">


                <div className="p-6 md:p-8">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">


                        {/* STATUS */}

                        <div className="flex items-center gap-5">

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                                todayAttendance
                                    ? "bg-emerald-100"
                                    : "bg-indigo-100"
                            }`}>
                                {todayAttendance ? "✓" : "🕐"}
                            </div>


                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Today's Attendance
                                </p>

                                <div className="flex items-center gap-3 mt-1">

                                    <h2 className="text-2xl font-bold text-slate-900">

                                        {todayAttendance
                                            ? todayAttendance.status
                                                ?.replace("_", " ")
                                            : "Not Marked"}

                                    </h2>

                                    {todayAttendance && (

                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                            todayAttendance.status
                                        )}`}>

                                            Active

                                        </span>

                                    )}

                                </div>

                                <p className="text-sm text-slate-400 mt-1">
                                    Mark your attendance for today
                                </p>

                            </div>

                        </div>


                        {/* ACTION BUTTONS */}

                        <div className="flex flex-col sm:flex-row gap-3">

                            <button
                                onClick={handleCheckIn}
                                disabled={
                                    actionLoading ||
                                    todayAttendance !== null
                                }
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    actionLoading ||
                                    todayAttendance !== null
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200"
                                }`}
                            >

                                {actionLoading
                                    ? "Processing..."
                                    : "✓ Check In"}

                            </button>


                            <button
                                onClick={handleCheckOut}
                                disabled={
                                    actionLoading ||
                                    !todayAttendance ||
                                    todayAttendance.checkOutTime !== null
                                }
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                                    actionLoading ||
                                    !todayAttendance ||
                                    todayAttendance.checkOutTime !== null
                                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200"
                                }`}
                            >

                                {actionLoading
                                    ? "Processing..."
                                    : "→ Check Out"}

                            </button>

                        </div>

                    </div>


                    {/* TODAY DETAILS */}

                    {todayAttendance && (

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">


                            {/* DATE */}

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                        📅
                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Date
                                        </p>

                                        <p className="font-semibold text-slate-800 mt-1">
                                            {formatDate(
                                                todayAttendance.attendanceDate
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* CHECK IN */}

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        🟢
                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Check In
                                        </p>

                                        <p className="font-semibold text-slate-800 mt-1">
                                            {formatTime(
                                                todayAttendance.checkInTime
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* CHECK OUT */}

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">

                                <div className="flex items-center gap-3">

                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        🔵
                                    </div>

                                    <div>

                                        <p className="text-xs text-slate-500">
                                            Check Out
                                        </p>

                                        <p className="font-semibold text-slate-800 mt-1">
                                            {formatTime(
                                                todayAttendance.checkOutTime
                                            )}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================
                STATISTICS
            ================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


                {/* TOTAL DAYS */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Total Days
                            </p>

                            <p className="text-4xl font-bold text-slate-900 mt-3">
                                {totalDays}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">
                            📅
                        </div>

                    </div>

                    <p className="text-slate-400 text-sm mt-4">
                        Attendance records
                    </p>

                </div>


                {/* PRESENT */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Present
                            </p>

                            <p className="text-4xl font-bold text-emerald-600 mt-3">
                                {presentDays}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-xl">
                            ✓
                        </div>

                    </div>

                    <p className="text-slate-400 text-sm mt-4">
                        Days marked present
                    </p>

                </div>


                {/* HALF DAY */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Half Days
                            </p>

                            <p className="text-4xl font-bold text-amber-500 mt-3">
                                {halfDays}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                            ◐
                        </div>

                    </div>

                    <p className="text-slate-400 text-sm mt-4">
                        Partial attendance
                    </p>

                </div>


                {/* ATTENDANCE */}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-slate-500 text-sm">
                                Attendance
                            </p>

                            <p className="text-4xl font-bold text-indigo-600 mt-3">
                                {attendancePercentage}%
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                            📊
                        </div>

                    </div>

                    <p className="text-slate-400 text-sm mt-4">
                        Overall attendance rate
                    </p>

                </div>

            </div>


            {/* =================================
                ATTENDANCE SUMMARY
            ================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    <div>

                        <p className="text-indigo-600 font-medium">
                            Attendance Overview
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mt-1">
                            Your attendance progress
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Maintain consistent attendance to improve your overall performance.
                        </p>

                    </div>


                    <div className="w-full md:w-64">

                        <div className="flex justify-between text-sm mb-2">

                            <span className="text-slate-500">
                                Attendance Rate
                            </span>

                            <span className="font-semibold text-slate-800">
                                {attendancePercentage}%
                            </span>

                        </div>

                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">

                            <div
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(
                                        attendancePercentage,
                                        100
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================
                ATTENDANCE HISTORY
            ================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">


                {/* TABLE HEADER */}

                <div className="p-6 md:p-8 border-b border-slate-100">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                        <div>

                            <h2 className="text-2xl font-bold text-slate-900">
                                Attendance History
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                View your complete attendance records.
                            </p>

                        </div>


                        <div className="px-4 py-2 rounded-lg bg-slate-100 text-sm text-slate-600">

                            {totalDays} Records

                        </div>

                    </div>

                </div>


                {/* EMPTY STATE */}

                {attendanceList.length === 0 ? (

                    <div className="py-16 text-center">

                        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mx-auto">
                            📅
                        </div>

                        <h3 className="text-xl font-semibold text-slate-800 mt-5">
                            No attendance records
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Your attendance history will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">


                            <thead className="bg-slate-50 border-b border-slate-100">

                            <tr>

                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Date
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Check In
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Check Out
                                </th>

                                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>

                            </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                            {attendanceList.map(
                                (attendance) => (

                                    <tr
                                        key={attendance.id}
                                        className="hover:bg-slate-50 transition-colors"
                                    >

                                        {/* DATE */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-sm">
                                                    📅
                                                </div>

                                                <span className="font-medium text-slate-700">

                                                        {formatDate(
                                                            attendance.attendanceDate
                                                        )}

                                                    </span>

                                            </div>

                                        </td>


                                        {/* CHECK IN */}

                                        <td className="px-6 py-5">

                                                <span className="font-medium text-emerald-600">

                                                    {formatTime(
                                                        attendance.checkInTime
                                                    )}

                                                </span>

                                        </td>


                                        {/* CHECK OUT */}

                                        <td className="px-6 py-5">

                                                <span className="font-medium text-indigo-600">

                                                    {formatTime(
                                                        attendance.checkOutTime
                                                    )}

                                                </span>

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-5">

                                                <span
                                                    className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                                                        attendance.status
                                                    )}`}
                                                >

                                                    {attendance.status?.replace(
                                                        "_",
                                                        " "
                                                    )}

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