import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeLeaveRequests() {

    const [leaves, setLeaves] = useState([]);

    const [formData, setFormData] = useState({
        startDate: "",
        endDate: "",
        reason: "",
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // =========================================
    // LOAD EMPLOYEE
    // =========================================

    const getEmployee = async () => {

        const response = await axios.get(
            "http://localhost:8080/api/dashboard/employee/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    };


    // =========================================
    // LOAD LEAVES
    // =========================================

    const fetchLeaves = async () => {

        try {

            setLoading(true);
            setError("");

            const employee = await getEmployee();

            const response = await axios.get(
                `http://localhost:8080/api/leaves/employee/${employee.employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setLeaves(response.data);

        } catch (error) {

            console.error("LEAVE FETCH ERROR:", error);

            setError(
                error.response?.data ||
                "Unable to load leave requests"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchLeaves();

    }, []);


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =========================================
    // APPLY LEAVE
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSubmitting(true);
            setError("");

            const employee = await getEmployee();

            await axios.post(
                "http://localhost:8080/api/leaves/apply",
                {
                    employeeId: employee.employeeId,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    reason: formData.reason,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Leave request submitted successfully!");

            setFormData({
                startDate: "",
                endDate: "",
                reason: "",
            });

            fetchLeaves();

        } catch (error) {

            console.error("APPLY LEAVE ERROR:", error);

            alert(
                error.response?.data ||
                "Failed to apply for leave"
            );

        } finally {

            setSubmitting(false);

        }
    };


    // =========================================
    // STATUS STYLE
    // =========================================

    const getStatusStyle = (status) => {

        if (status === "APPROVED") {

            return "bg-emerald-50 text-emerald-700 border border-emerald-200";

        }

        if (status === "REJECTED") {

            return "bg-red-50 text-red-700 border border-red-200";

        }

        return "bg-amber-50 text-amber-700 border border-amber-200";
    };


    return (

        <div className="space-y-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div>

                <p className="text-indigo-600 font-semibold text-sm">
                    Employee Workspace
                </p>

                <h1 className="text-4xl font-bold text-slate-900 mt-1 tracking-tight">
                    Leave Requests
                </h1>

                <p className="text-slate-500 mt-2 text-lg">
                    Apply for time off and track the status of your requests.
                </p>

            </div>


            {/* =========================================
                APPLY LEAVE CARD
            ========================================= */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


                {/* CARD HEADER */}

                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-4">

                    <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center text-xl">

                        🏖️

                    </div>


                    <div>

                        <h2 className="text-xl font-bold text-slate-900">
                            Apply for Leave
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Submit your leave request for manager approval.
                        </p>

                    </div>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-6"
                >


                    {/* DATE ROW */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                        {/* START DATE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                Start Date

                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                        </div>


                        {/* END DATE */}

                        <div>

                            <label className="block text-sm font-semibold text-slate-700 mb-2">

                                End Date

                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                        </div>

                    </div>


                    {/* REASON */}

                    <div>

                        <label className="block text-sm font-semibold text-slate-700 mb-2">

                            Reason for Leave

                        </label>

                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Briefly explain the reason for your leave request..."
                            required
                            rows="5"
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-700 resize-none outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>


                    {/* SUBMIT */}

                    <div className="flex justify-end pt-2">

                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
                                submitting
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98]"
                            }`}
                        >

                            {submitting
                                ? "Submitting..."
                                : "Submit Leave Request"}

                        </button>

                    </div>

                </form>

            </div>


            {/* =========================================
                LEAVE HISTORY
            ========================================= */}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">


                {/* HISTORY HEADER */}

                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-4">

                        <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center text-xl">

                            📋

                        </div>


                        <div>

                            <h2 className="text-xl font-bold text-slate-900">

                                My Leave History

                            </h2>

                            <p className="text-sm text-slate-500 mt-1">

                                Track all your previous and current leave requests.

                            </p>

                        </div>

                    </div>


                    <button
                        onClick={fetchLeaves}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                    >

                        ↻ Refresh

                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="m-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">

                        {error}

                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="py-16 text-center">

                        <div className="text-3xl mb-3 animate-pulse">
                            📋
                        </div>

                        <p className="text-slate-500">
                            Loading your leave requests...
                        </p>

                    </div>

                ) : leaves.length === 0 ? (

                    <div className="py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl mb-4">

                            🏖️

                        </div>

                        <h3 className="text-lg font-semibold text-slate-800">

                            No leave requests yet

                        </h3>

                        <p className="text-slate-500 mt-2">

                            Your submitted leave requests will appear here.

                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">


                        <table className="w-full">


                            {/* TABLE HEADER */}

                            <thead className="bg-slate-50">

                            <tr>

                                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    #
                                </th>

                                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Start Date
                                </th>

                                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    End Date
                                </th>

                                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Reason
                                </th>

                                <th className="py-4 px-6 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Status
                                </th>

                            </tr>

                            </thead>


                            {/* TABLE BODY */}

                            <tbody className="divide-y divide-slate-100">

                            {leaves.map((leave, index) => (

                                <tr
                                    key={leave.leaveId}
                                    className="hover:bg-slate-50 transition-colors"
                                >

                                    <td className="py-5 px-6 text-sm font-medium text-slate-500">

                                        {String(index + 1).padStart(2, "0")}

                                    </td>


                                    <td className="py-5 px-6">

                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                                            <span>
                                                📅
                                            </span>

                                            {leave.startDate}

                                        </div>

                                    </td>


                                    <td className="py-5 px-6">

                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                                            <span>
                                                📅
                                            </span>

                                            {leave.endDate}

                                        </div>

                                    </td>


                                    <td className="py-5 px-6 max-w-xs">

                                        <p className="text-sm text-slate-600 truncate">

                                            {leave.reason}

                                        </p>

                                    </td>


                                    <td className="py-5 px-6">

                                        <span
                                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusStyle(
                                                leave.status
                                            )}`}
                                        >

                                            {leave.status}

                                        </span>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default EmployeeLeaveRequests;