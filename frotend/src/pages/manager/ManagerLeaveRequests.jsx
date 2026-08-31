import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ManagerLeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // =====================================================
    // FETCH ONLY LOGGED-IN MANAGER'S TEAM LEAVES
    // =====================================================

    const fetchLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8080/api/leaves/manager/me",
                config
            );

            setLeaves(response.data);
        } catch (error) {
            console.log(error);

            setError(
                error.response?.data?.message ||
                "Failed to load leave requests"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // =====================================================
    // APPROVE LEAVE
    // =====================================================

    const handleApprove = async (leaveId) => {
        const confirmApprove = window.confirm(
            "Are you sure you want to approve this leave request?"
        );

        if (!confirmApprove) return;

        try {
            setProcessingId(leaveId);

            await axios.put(
                `http://localhost:8080/api/leaves/${leaveId}/approve`,
                {},
                config
            );

            await fetchLeaves();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to approve leave"
            );
        } finally {
            setProcessingId(null);
        }
    };

    // =====================================================
    // REJECT LEAVE
    // =====================================================

    const handleReject = async (leaveId) => {
        const confirmReject = window.confirm(
            "Are you sure you want to reject this leave request?"
        );

        if (!confirmReject) return;

        try {
            setProcessingId(leaveId);

            await axios.put(
                `http://localhost:8080/api/leaves/${leaveId}/reject`,
                {},
                config
            );

            await fetchLeaves();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to reject leave"
            );
        } finally {
            setProcessingId(null);
        }
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const pendingCount = leaves.filter(
        (leave) => leave.status === "PENDING"
    ).length;

    const approvedCount = leaves.filter(
        (leave) => leave.status === "APPROVED"
    ).length;

    const rejectedCount = leaves.filter(
        (leave) => leave.status === "REJECTED"
    ).length;

    // =====================================================
    // SEARCH + FILTER
    // =====================================================

    const filteredLeaves = useMemo(() => {
        const searchValue = search.toLowerCase();

        return leaves.filter((leave) => {
            const matchesSearch =
                leave.employeeName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                leave.reason
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                leave.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [leaves, search, statusFilter]);

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusStyle = (status) => {
        switch (status) {
            case "APPROVED":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";

            case "REJECTED":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-amber-50 text-amber-700 border-amber-200";
        }
    };

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
                        Loading Leave Requests
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Preparing your team's leave information...
                    </p>
                </div>
            </div>
        );
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">
                        !
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold text-red-700">
                            Unable to load leave requests
                        </h3>

                        <p className="mt-1 text-sm text-red-600">
                            {error}
                        </p>
                    </div>

                    <button
                        onClick={fetchLeaves}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
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

                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">

                            <span className="h-2 w-2 rounded-full bg-amber-400"></span>

                            <span className="text-xs font-medium text-indigo-300">
                                Leave Management
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Team Leave Requests
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">
                            Review employee leave requests, manage approvals,
                            and keep your team's availability organized.
                        </p>

                    </div>

                    <button
                        onClick={fetchLeaves}
                        className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                    >
                        <span>↻</span>
                        Refresh Data
                    </button>

                </div>

            </section>

            {/* =====================================================
                SECTION HEADER
            ===================================================== */}

            <div>

                <p className="text-sm font-semibold text-indigo-600">
                    Overview
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Leave activity at a glance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Track pending requests and review leave decisions.
                </p>

            </div>

            {/* =====================================================
                STATISTICS
            ===================================================== */}

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Total Requests
                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                    {leaves.length}
                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
                                🗓️
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">
                                Team leave requests
                            </p>

                        </div>

                    </div>

                </div>

                {/* PENDING */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-amber-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Pending
                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-amber-600">
                                    {pendingCount}
                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                                ◷
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">
                                Require your attention
                            </p>

                        </div>

                    </div>

                </div>

                {/* APPROVED */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-emerald-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Approved
                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-emerald-600">
                                    {approvedCount}
                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                                ✓
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">
                                Successfully approved
                            </p>

                        </div>

                    </div>

                </div>

                {/* REJECTED */}

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-red-50 transition group-hover:scale-125"></div>

                    <div className="relative">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">
                                    Rejected
                                </p>

                                <h3 className="mt-3 text-3xl font-bold tracking-tight text-red-600">
                                    {rejectedCount}
                                </h3>

                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl">
                                ✕
                            </div>

                        </div>

                        <div className="mt-6 border-t border-slate-100 pt-4">

                            <p className="text-xs text-slate-400">
                                Requests declined
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                SEARCH + FILTER
            ===================================================== */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-4 md:flex-row">

                    <div className="relative flex-1">

                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search by employee name or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                    >

                        <option value="ALL">
                            All Status
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="APPROVED">
                            Approved
                        </option>

                        <option value="REJECTED">
                            Rejected
                        </option>

                    </select>

                </div>

            </section>

            {/* =====================================================
                LEAVE REQUEST TABLE
            ===================================================== */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Leave Requests
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage your team's leave applications.
                        </p>

                    </div>

                    <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {filteredLeaves.length} requests
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
                                Duration
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Reason
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Status
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Action
                            </th>

                        </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                        {filteredLeaves.map((leave) => (

                            <tr
                                key={leave.leaveId}
                                className="transition hover:bg-slate-50/80"
                            >

                                {/* EMPLOYEE */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 font-bold text-indigo-600">

                                            {leave.employeeName
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <div>

                                            <p className="font-semibold text-slate-800">
                                                {leave.employeeName}
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-400">
                                                Leave Request #{leave.leaveId}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                {/* DURATION */}

                                <td className="px-6 py-5">

                                    <div className="text-sm">

                                        <p className="font-medium text-slate-700">
                                            {leave.startDate}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            to {leave.endDate}
                                        </p>

                                    </div>

                                </td>

                                {/* REASON */}

                                <td className="max-w-xs px-6 py-5">

                                    <p className="truncate text-sm text-slate-600">
                                        {leave.reason}
                                    </p>

                                </td>

                                {/* STATUS */}

                                <td className="px-6 py-5">

                                        <span
                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                leave.status
                                            )}`}
                                        >
                                            {leave.status}
                                        </span>

                                </td>

                                {/* ACTIONS */}

                                <td className="px-6 py-5">

                                    {leave.status === "PENDING" ? (

                                        <div className="flex justify-end gap-2">

                                            <button
                                                onClick={() =>
                                                    handleApprove(leave.leaveId)
                                                }
                                                disabled={
                                                    processingId === leave.leaveId
                                                }
                                                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {processingId === leave.leaveId
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleReject(leave.leaveId)
                                                }
                                                disabled={
                                                    processingId === leave.leaveId
                                                }
                                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="text-right text-xs text-slate-400">
                                            Decision completed
                                        </div>

                                    )}

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>

                {/* EMPTY STATE */}

                {filteredLeaves.length === 0 && (

                    <div className="px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                            🗓️
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-slate-800">
                            No leave requests found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">

                            {search || statusFilter !== "ALL"
                                ? "No leave requests match your current search or filter."
                                : "There are currently no leave requests from your team waiting for review."}

                        </p>

                    </div>

                )}

            </section>

        </div>
    );
};

export default ManagerLeaveRequests;