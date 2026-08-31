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


    // =====================================================
    // SEARCH
    // =====================================================

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


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">

                <div className="text-center">

                    <div className="relative mx-auto h-14 w-14">

                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>

                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-slate-800">
                        Loading your team
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Gathering your team information...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-8">


            {/* =====================================================
                HERO SECTION
            ===================================================== */}

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 md:px-10 md:py-10">

                {/* Background Effects */}

                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"></div>


                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


                    {/* LEFT */}

                    <div>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">

                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                            <span className="text-xs font-medium text-indigo-300">
                                Team Workspace
                            </span>

                        </div>


                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">

                            {manager?.managerName
                                ? `${manager.managerName}'s Team`
                                : "My Team"}

                        </h1>


                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">

                            View, monitor and manage the employees assigned
                            to your team from one centralized workspace.

                        </p>

                    </div>


                    {/* TEAM SIZE */}

                    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
                            👥
                        </div>

                        <div>

                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Team Size
                            </p>

                            <p className="mt-1 text-3xl font-bold text-white">
                                {employees.length}
                            </p>

                            <p className="text-xs text-indigo-300">
                                Active team members
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SECTION HEADER
            ===================================================== */}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

                <div>

                    <p className="text-sm font-semibold text-indigo-600">
                        Team Directory
                    </p>

                    <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        Your team members
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Search and explore employees currently assigned to you.
                    </p>

                </div>


                <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2">

                    <span className="text-sm font-semibold text-indigo-700">

                        {filteredEmployees.length}

                        {" "}

                        {filteredEmployees.length === 1
                            ? "Member"
                            : "Members"}

                    </span>

                </div>

            </div>


            {/* =====================================================
                SEARCH
            ===================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="relative">

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        🔍
                    </div>

                    <input
                        type="text"
                        placeholder="Search by name, employee code, email, department or designation..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />

                </div>

            </section>


            {/* =====================================================
                EMPLOYEE TABLE
            ===================================================== */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


                {/* TABLE HEADER */}

                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Team Members
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Employee information and organizational details.
                        </p>

                    </div>


                    <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">

                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>

                        <span className="text-xs font-semibold text-emerald-700">
                            Team Active
                        </span>

                    </div>

                </div>


                {/* TABLE */}

                {filteredEmployees.length > 0 ? (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            <thead className="border-b border-slate-100 bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Employee
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Employee Code
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Contact
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Department
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Designation
                                </th>

                            </tr>

                            </thead>


                            <tbody className="divide-y divide-slate-100">

                            {filteredEmployees.map((employee) => (

                                <tr
                                    key={employee.id}
                                    className="group transition-colors duration-200 hover:bg-indigo-50/40"
                                >


                                    {/* EMPLOYEE */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-sm">

                                                {employee.firstName
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                                {employee.lastName
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div>

                                                <p className="font-semibold text-slate-900 transition group-hover:text-indigo-700">

                                                    {employee.firstName}{" "}
                                                    {employee.lastName}

                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">

                                                    Employee ID: {employee.id}

                                                </p>

                                            </div>

                                        </div>

                                    </td>


                                    {/* EMPLOYEE CODE */}

                                    <td className="px-6 py-5">

                                            <span className="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-medium text-slate-600">

                                                {employee.employeeCode}

                                            </span>

                                    </td>


                                    {/* EMAIL */}

                                    <td className="px-6 py-5">

                                        <p className="max-w-[220px] truncate text-sm text-slate-600">

                                            {employee.email}

                                        </p>

                                    </td>


                                    {/* DEPARTMENT */}

                                    <td className="px-6 py-5">

                                            <span className="text-sm font-medium text-slate-700">

                                                {employee.department || "—"}

                                            </span>

                                    </td>


                                    {/* DESIGNATION */}

                                    <td className="px-6 py-5">

                                            <span className="inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">

                                                {employee.designation || "Not assigned"}

                                            </span>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    /* =============================================
                        EMPTY STATE
                    ============================================= */

                    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-4xl">
                            👥
                        </div>


                        <h2 className="mt-6 text-xl font-bold text-slate-900">

                            No employees found

                        </h2>


                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">

                            {search
                                ? "No employees match your current search. Try using a different name, department or employee code."
                                : "You currently don't have any employees assigned to your team."}

                        </p>


                        {search && (

                            <button
                                onClick={() => setSearch("")}
                                className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                            >

                                Clear Search

                            </button>

                        )}

                    </div>

                )}

            </section>


            {/* =====================================================
                TEAM INSIGHT
            ===================================================== */}

            {employees.length > 0 && (

                <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-6 md:p-8">

                    <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl"></div>


                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-200">

                            ✦

                        </div>


                        <div>

                            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">

                                WorkSphere Insight

                            </p>

                            <h3 className="mt-2 text-lg font-bold text-slate-900">

                                Your team is your biggest advantage

                            </h3>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                                WorkSphere helps you keep employee information organized
                                today, while future intelligence features will provide
                                deeper insights into skills, workloads and team performance.

                            </p>

                        </div>

                    </div>

                </section>

            )}

        </div>
    );
};

export default ManagerTeam;