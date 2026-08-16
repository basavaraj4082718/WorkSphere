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
    // LOAD EMPLOYEE DASHBOARD
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

            return "bg-green-100 text-green-700";

        }

        if (status === "REJECTED") {

            return "bg-red-100 text-red-700";

        }

        return "bg-yellow-100 text-yellow-700";
    };


    return (

        <div className="p-6">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Leave Requests
                </h1>

                <p className="text-gray-500 mt-1">
                    Apply for leave and track your requests.
                </p>

            </div>


            {/* =========================================
                APPLY LEAVE
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                    Apply for Leave
                </h2>


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* DATE ROW */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>

                    </div>


                    {/* REASON */}

                    <div>

                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reason
                        </label>

                        <textarea
                            name="reason"
                            value={formData.reason}
                            onChange={handleChange}
                            placeholder="Enter reason for leave"
                            required
                            rows="4"
                            className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        disabled={submitting}
                        className={`px-6 py-3 rounded-lg text-white font-medium ${
                            submitting
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >

                        {submitting
                            ? "Submitting..."
                            : "Apply Leave"}

                    </button>

                </form>

            </div>


            {/* =========================================
                LEAVE HISTORY
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex justify-between items-center mb-5">

                    <div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            My Leave History
                        </h2>

                        <p className="text-sm text-gray-500">
                            Track your previous leave requests.
                        </p>

                    </div>

                    <button
                        onClick={fetchLeaves}
                        className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                    >
                        Refresh
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-5">
                        {error}
                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="text-center py-10 text-gray-500">
                        Loading leave requests...
                    </div>

                ) : leaves.length === 0 ? (

                    <div className="text-center py-10 text-gray-500">
                        No leave requests found.
                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                            <tr className="border-b text-left">

                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                    #
                                </th>

                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                    Start Date
                                </th>

                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                    End Date
                                </th>

                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                    Reason
                                </th>

                                <th className="py-3 px-4 text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                            </tr>

                            </thead>


                            <tbody>

                            {leaves.map((leave, index) => (

                                <tr
                                    key={leave.leaveId}
                                    className="border-b last:border-b-0 hover:bg-gray-50"
                                >

                                    <td className="py-4 px-4 text-gray-700">
                                        {index + 1}
                                    </td>

                                    <td className="py-4 px-4 text-gray-700">
                                        {leave.startDate}
                                    </td>

                                    <td className="py-4 px-4 text-gray-700">
                                        {leave.endDate}
                                    </td>

                                    <td className="py-4 px-4 text-gray-700 max-w-xs">
                                        {leave.reason}
                                    </td>

                                    <td className="py-4 px-4">

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
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