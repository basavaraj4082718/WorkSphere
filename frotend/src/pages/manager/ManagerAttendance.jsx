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

            <div className="flex min-h-[600px] items-center justify-center">

                <div className="text-center">

                    <div className="relative mx-auto h-14 w-14">

                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>

                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-slate-800">

                        Loading Attendance

                    </h3>

                    <p className="mt-2 text-sm text-slate-500">

                        Fetching your team's attendance records...

                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="space-y-8">


            {/* =========================================
                HERO HEADER
            ========================================= */}

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 md:px-10 md:py-10">

                {/* Background Effects */}

                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"></div>


                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                    {/* LEFT */}

                    <div>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">

                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                            <span className="text-xs font-medium text-indigo-300">

                                Live Team Overview

                            </span>

                        </div>


                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">

                            {manager?.managerName
                                ? `${manager.managerName}'s Team`
                                : "Team Attendance"}

                        </h1>


                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">

                            Monitor today's attendance, track team availability,
                            and stay updated on your workforce activity.

                        </p>

                    </div>


                    {/* RIGHT */}

                    <div className="flex items-center gap-3">

                        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">

                                Team Size

                            </p>

                            <p className="mt-1 text-3xl font-bold text-white">

                                {employees.length}

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                SECTION HEADER
            ========================================= */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-indigo-600">

                        Attendance Overview

                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">

                        Today's workforce status

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        A real-time snapshot of your team's availability.

                    </p>

                </div>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


                {/* TEAM SIZE */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    Team Size

                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">

                                    {employees.length}

                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">

                                👥

                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">

                                Employees assigned to your team

                            </p>

                        </div>

                    </div>

                </div>


                {/* PRESENT */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-100">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    Present

                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">

                                    {presentCount}

                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">

                                ✓

                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">

                                Employees currently present

                            </p>

                        </div>

                    </div>

                </div>


                {/* HALF DAY */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    Half Day

                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-amber-600">

                                    {halfDayCount}

                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">

                                ◐

                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">

                                Employees on half-day attendance

                            </p>

                        </div>

                    </div>

                </div>


                {/* NOT MARKED */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-rose-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    Not Marked

                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-rose-600">

                                    {absentCount}

                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-xl">

                                !

                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">

                                Attendance not recorded today

                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                SEARCH + REFRESH
            ========================================= */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 md:flex-row">

                    <div className="relative flex-1">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                            ⌕

                        </span>

                        <input
                            type="text"
                            placeholder="Search by employee name, code or department..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                    </div>


                    <button
                        onClick={fetchAttendance}
                        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200"
                    >

                        <span>

                            ↻

                        </span>

                        Refresh

                    </button>

                </div>

            </section>


            {/* =========================================
                ATTENDANCE TABLE
            ========================================= */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


                {/* TABLE HEADER */}

                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-bold text-slate-900">

                            Team Attendance

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Detailed attendance records for today.

                        </p>

                    </div>


                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-xs font-medium text-slate-500">

                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>

                        {filteredEmployees.length} employees

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[900px]">


                        <thead className="border-b border-slate-100 bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Employee

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Department

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Date

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Check In

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Check Out

                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Status

                            </th>

                        </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                        {filteredEmployees.map(
                            (employee) => {

                                const record =
                                    attendance[
                                        employee.id
                                        ];


                                return (

                                    <tr
                                        key={employee.id}
                                        className="group transition hover:bg-slate-50/80"
                                    >


                                        {/* EMPLOYEE */}

                                        <td className="px-6 py-5">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 font-bold text-indigo-600">

                                                    {employee.firstName
                                                        ?.charAt(0)
                                                        .toUpperCase()}

                                                </div>


                                                <div>

                                                    <p className="font-semibold text-slate-900">

                                                        {
                                                            employee.firstName
                                                        }{" "}

                                                        {
                                                            employee.lastName
                                                        }

                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-400">

                                                        {
                                                            employee.employeeCode
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        {/* DEPARTMENT */}

                                        <td className="px-6 py-5">

                                            <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">

                                                {employee.department}

                                            </span>

                                        </td>


                                        {/* DATE */}

                                        <td className="px-6 py-5 text-sm text-slate-600">

                                            {record?.attendanceDate ||
                                                new Date()
                                                    .toISOString()
                                                    .split("T")[0]}

                                        </td>


                                        {/* CHECK IN */}

                                        <td className="px-6 py-5">

                                            {record ? (

                                                <span className="text-sm font-medium text-slate-700">

                                                    {formatTime(
                                                        record.checkInTime
                                                    )}

                                                </span>

                                            ) : (

                                                <span className="text-sm text-slate-400">

                                                    --

                                                </span>

                                            )}

                                        </td>


                                        {/* CHECK OUT */}

                                        <td className="px-6 py-5">

                                            {record ? (

                                                <span className="text-sm font-medium text-slate-700">

                                                    {formatTime(
                                                        record.checkOutTime
                                                    )}

                                                </span>

                                            ) : (

                                                <span className="text-sm text-slate-400">

                                                    --

                                                </span>

                                            )}

                                        </td>


                                        {/* STATUS */}

                                        <td className="px-6 py-5">

                                            {record ? (

                                                record.status ===
                                                "PRESENT" ? (

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                                                        Present

                                                    </span>

                                                ) : record.status ===
                                                "HALF_DAY" ? (

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>

                                                        Half Day

                                                    </span>

                                                ) : (

                                                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200">

                                                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>

                                                        Absent

                                                    </span>

                                                )

                                            ) : (

                                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200">

                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>

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

                    <div className="px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">

                            👥

                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">

                            No employees found

                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

                            {search
                                ? "No employees match your current search. Try using a different keyword."
                                : "You currently have no employees assigned to your team."
                            }

                        </p>

                    </div>

                )}

            </section>


            {/* =========================================
                TEAM INSIGHT
            ========================================= */}

            <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-6 md:p-8">

                <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl"></div>


                <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">


                    <div className="flex items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-200">

                            ✦

                        </div>


                        <div>

                            <p className="text-sm font-semibold text-indigo-600">

                                TEAM INSIGHT

                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">

                                Stay connected with your workforce

                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                                Track attendance patterns and team availability
                                to maintain better visibility into your workforce
                                and daily operations.

                            </p>

                        </div>

                    </div>


                    <div className="shrink-0">

                        <span className="inline-flex rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">

                            WorkSphere Insight

                        </span>

                    </div>

                </div>

            </section>

        </div>

    );

};

export default ManagerAttendance;