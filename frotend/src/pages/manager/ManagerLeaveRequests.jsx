import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ManagerLeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // =========================================
    // FETCH LEAVES
    // =========================================

    const fetchLeaves = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:8080/api/leaves/all",
                config
            );

            setLeaves(response.data);

        } catch (error) {
            console.log(error);

            alert(
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

    // =========================================
    // APPROVE LEAVE
    // =========================================

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

            alert("Leave approved successfully");

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

    // =========================================
    // REJECT LEAVE
    // =========================================

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

            alert("Leave rejected successfully");

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

    // =========================================
    // STATISTICS
    // =========================================

    const pendingCount = leaves.filter(
        (leave) => leave.status === "PENDING"
    ).length;

    const approvedCount = leaves.filter(
        (leave) => leave.status === "APPROVED"
    ).length;

    const rejectedCount = leaves.filter(
        (leave) => leave.status === "REJECTED"
    ).length;

    // =========================================
    // SEARCH + FILTER
    // =========================================

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

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">

                <div className="text-gray-500 text-lg">
                    Loading leave requests...
                </div>

            </div>
        );
    }

    // =========================================
    // STATUS BADGE
    // =========================================

    const getStatusClass = (status) => {

        if (status === "APPROVED") {
            return "bg-green-100 text-green-700";
        }

        if (status === "REJECTED") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    // =========================================
    // MAIN UI
    // =========================================

    return (
        <div className="space-y-6">

            {/* =================================
                HEADER
            ================================= */}

            <div>

                <p className="text-blue-600 font-medium">
                    Leave Management
                </p>

                <h1 className="text-3xl font-bold mt-1">
                    Leave Requests
                </h1>

                <p className="text-gray-500 mt-2">
                    Review and manage leave requests from employees.
                </p>

            </div>


            {/* =================================
                STATISTICS
            ================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

                {/* Total */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500 text-sm">
                        Total Requests
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {leaves.length}
                    </p>

                </div>


                {/* Pending */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500 text-sm">
                        Pending
                    </p>

                    <p className="text-3xl font-bold mt-2 text-yellow-600">
                        {pendingCount}
                    </p>

                </div>


                {/* Approved */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500 text-sm">
                        Approved
                    </p>

                    <p className="text-3xl font-bold mt-2 text-green-600">
                        {approvedCount}
                    </p>

                </div>


                {/* Rejected */}

                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500 text-sm">
                        Rejected
                    </p>

                    <p className="text-3xl font-bold mt-2 text-red-600">
                        {rejectedCount}
                    </p>

                </div>

            </div>


            {/* =================================
                SEARCH + FILTER
            ================================= */}

            <div className="bg-white rounded-xl shadow p-4">

                <div className="flex flex-col md:flex-row gap-4">

                    <input
                        type="text"
                        placeholder="Search by employee name or reason..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="flex-1 border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                    />


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

            </div>


            {/* =================================
                LEAVE TABLE
            ================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Employee
                            </th>

                            <th className="text-left p-4">
                                Start Date
                            </th>

                            <th className="text-left p-4">
                                End Date
                            </th>

                            <th className="text-left p-4">
                                Reason
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredLeaves.map((leave) => (

                            <tr
                                key={leave.leaveId}
                                className="border-t hover:bg-gray-50"
                            >

                                {/* Employee */}

                                <td className="p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                            {leave.employeeName
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                {leave.employeeName}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                Leave #{leave.leaveId}
                                            </p>

                                        </div>

                                    </div>

                                </td>


                                {/* Start Date */}

                                <td className="p-4 text-gray-600">

                                    {leave.startDate}

                                </td>


                                {/* End Date */}

                                <td className="p-4 text-gray-600">

                                    {leave.endDate}

                                </td>


                                {/* Reason */}

                                <td className="p-4 max-w-xs">

                                    <p className="text-gray-600">
                                        {leave.reason}
                                    </p>

                                </td>


                                {/* Status */}

                                <td className="p-4">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                            leave.status
                                        )}`}
                                    >

                                        {leave.status}

                                    </span>

                                </td>


                                {/* Actions */}

                                <td className="p-4">

                                    {leave.status === "PENDING" ? (

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    handleApprove(
                                                        leave.leaveId
                                                    )
                                                }
                                                disabled={
                                                    processingId ===
                                                    leave.leaveId
                                                }
                                                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                            >

                                                {processingId ===
                                                leave.leaveId
                                                    ? "..."
                                                    : "Approve"}

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleReject(
                                                        leave.leaveId
                                                    )
                                                }
                                                disabled={
                                                    processingId ===
                                                    leave.leaveId
                                                }
                                                className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                            >

                                                {processingId ===
                                                leave.leaveId
                                                    ? "..."
                                                    : "Reject"}

                                            </button>

                                        </div>

                                    ) : (

                                        <span className="text-gray-400 text-sm">
                                            No action
                                        </span>

                                    )}

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {filteredLeaves.length === 0 && (

                    <div className="text-center py-12">

                        <div className="text-5xl mb-3">
                            🗓️
                        </div>

                        <h2 className="text-xl font-semibold">
                            No leave requests found
                        </h2>

                        <p className="text-gray-500 mt-1">

                            {search || statusFilter !== "ALL"
                                ? "No requests match your search or filter."
                                : "There are no leave requests yet."
                            }

                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ManagerLeaveRequests;