import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeePerformance() {

    const [performance, setPerformance] = useState(null);
    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // =========================================
    // GET LOGGED-IN EMPLOYEE
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
    // FETCH PERFORMANCE
    // =========================================

    const fetchPerformance = async () => {

        try {

            setLoading(true);
            setError("");

            const employee = await getEmployee();

            const employeeId = employee.employeeId;


            // =========================================
            // PERFORMANCE
            // =========================================

            const performanceResponse = await axios.get(
                `http://localhost:8080/api/performance/employee/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            // =========================================
            // REVIEWS
            // =========================================

            const reviewsResponse = await axios.get(
                `http://localhost:8080/api/reviews/employee/${employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            setPerformance(performanceResponse.data);
            setReviews(reviewsResponse.data);

        } catch (error) {

            console.error(
                "EMPLOYEE PERFORMANCE ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            setError(
                error.response?.data ||
                "Unable to load performance details"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchPerformance();

    }, []);


    // =========================================
    // SCORE COLOR
    // =========================================

    const getScoreColor = (score) => {

        if (score >= 80) {
            return "text-green-600";
        }

        if (score >= 60) {
            return "text-yellow-600";
        }

        return "text-red-600";
    };


    // =========================================
    // SCORE BAR
    // =========================================

    const getBarWidth = (score) => {

        if (score < 0) return 0;
        if (score > 100) return 100;

        return score;
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="p-6">

                <div className="bg-white rounded-xl shadow-sm border p-10 text-center">

                    <div className="text-gray-500">
                        Loading performance...
                    </div>

                </div>

            </div>

        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="p-6">

                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">

                    <h2 className="font-semibold text-lg mb-1">
                        Unable to load performance
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchPerformance}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );
    }


    if (!performance) {

        return (

            <div className="p-6">

                <div className="bg-white rounded-xl shadow-sm border p-10 text-center text-gray-500">

                    No performance data available.

                </div>

            </div>

        );
    }


    return (

        <div className="p-6">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        My Performance
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Track your productivity, attendance and reviews.
                    </p>

                </div>


                <button
                    onClick={fetchPerformance}
                    className="mt-4 md:mt-0 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                >
                    Refresh
                </button>

            </div>


            {/* =========================================
                EMPLOYEE NAME
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

                <p className="text-sm text-gray-500">
                    Employee
                </p>

                <h2 className="text-2xl font-bold text-gray-800 mt-1">
                    {performance.employeeName}
                </h2>

            </div>


            {/* =========================================
                FINAL SCORE
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                    <div>

                        <p className="text-sm text-gray-500">
                            Overall Performance Score
                        </p>

                        <h2
                            className={`text-5xl font-bold mt-2 ${getScoreColor(
                                performance.finalScore
                            )}`}
                        >
                            {performance.finalScore.toFixed(1)}
                            <span className="text-2xl text-gray-400">
                                /100
                            </span>
                        </h2>

                    </div>


                    <div className="mt-5 md:mt-0 text-right">

                        <p className="text-sm text-gray-500">
                            Performance Level
                        </p>

                        <p className="text-lg font-semibold text-gray-800 mt-1">

                            {performance.finalScore >= 80
                                ? "Excellent"
                                : performance.finalScore >= 60
                                    ? "Good"
                                    : "Needs Improvement"}

                        </p>

                    </div>

                </div>


                {/* SCORE BAR */}

                <div className="mt-6">

                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all"
                            style={{
                                width: `${getBarWidth(
                                    performance.finalScore
                                )}%`,
                            }}
                        />

                    </div>

                </div>

            </div>


            {/* =========================================
                SCORE BREAKDOWN
            ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">


                {/* TASK SCORE */}

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-sm text-gray-500">
                        Task Performance
                    </p>

                    <h3
                        className={`text-3xl font-bold mt-2 ${getScoreColor(
                            performance.taskScore
                        )}`}
                    >
                        {performance.taskScore.toFixed(1)}%
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                        Weight: 40%
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                                width: `${getBarWidth(
                                    performance.taskScore
                                )}%`,
                            }}
                        />

                    </div>

                </div>


                {/* ATTENDANCE SCORE */}

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-sm text-gray-500">
                        Attendance
                    </p>

                    <h3
                        className={`text-3xl font-bold mt-2 ${getScoreColor(
                            performance.attendanceScore
                        )}`}
                    >
                        {performance.attendanceScore.toFixed(1)}%
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                        Weight: 30%
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                        <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                                width: `${getBarWidth(
                                    performance.attendanceScore
                                )}%`,
                            }}
                        />

                    </div>

                </div>


                {/* REVIEW SCORE */}

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-sm text-gray-500">
                        Manager Reviews
                    </p>

                    <h3
                        className={`text-3xl font-bold mt-2 ${getScoreColor(
                            performance.reviewScore
                        )}`}
                    >
                        {performance.reviewScore.toFixed(1)}%
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                        Weight: 30%
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                        <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                                width: `${getBarWidth(
                                    performance.reviewScore
                                )}%`,
                            }}
                        />

                    </div>

                </div>

            </div>


            {/* =========================================
                HOW SCORE IS CALCULATED
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

                <h2 className="text-xl font-semibold text-gray-800 mb-5">
                    Performance Calculation
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="bg-blue-50 rounded-lg p-4">

                        <p className="text-sm text-blue-600 font-medium">
                            Task Performance
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Completed tasks compared to total assigned tasks.
                        </p>

                        <p className="font-semibold text-gray-800 mt-3">
                            40% of final score
                        </p>

                    </div>


                    <div className="bg-green-50 rounded-lg p-4">

                        <p className="text-sm text-green-600 font-medium">
                            Attendance
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Percentage of attendance marked as present.
                        </p>

                        <p className="font-semibold text-gray-800 mt-3">
                            30% of final score
                        </p>

                    </div>


                    <div className="bg-purple-50 rounded-lg p-4">

                        <p className="text-sm text-purple-600 font-medium">
                            Manager Reviews
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Average manager rating converted to a percentage.
                        </p>

                        <p className="font-semibold text-gray-800 mt-3">
                            30% of final score
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================================
                REVIEWS
            ========================================= */}

            <div className="bg-white rounded-xl shadow-sm border p-6">

                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            Manager Reviews
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            Feedback and ratings received from your manager.
                        </p>

                    </div>

                </div>


                {reviews.length === 0 ? (

                    <div className="text-center py-10 text-gray-500">

                        No manager reviews available yet.

                    </div>

                ) : (

                    <div className="space-y-4">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="border rounded-xl p-5 hover:bg-gray-50"
                            >

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                                    <div>

                                        <p className="font-semibold text-gray-800">
                                            {review.managerName}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {review.reviewDate}
                                        </p>

                                    </div>


                                    <div className="flex items-center gap-2">

                                        <span className="text-yellow-500 text-lg">
                                            ★
                                        </span>

                                        <span className="font-bold text-gray-800">
                                            {review.rating}/5
                                        </span>

                                    </div>

                                </div>


                                <div className="mt-4 bg-gray-50 rounded-lg p-4">

                                    <p className="text-sm text-gray-700">
                                        {review.comments}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );
}

export default EmployeePerformance;