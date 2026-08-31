import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeePerformance() {

    const [performance, setPerformance] = useState(null);

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


            setPerformance(performanceResponse.data);

        } catch (error) {

            console.error(
                "EMPLOYEE PERFORMANCE ERROR:",
                error
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

            <div className="flex justify-center items-center h-64">

                <div className="text-gray-500 text-lg">
                    Loading performance...
                </div>

            </div>

        );
    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-6">

                <h2 className="font-semibold text-lg mb-1">
                    Unable to load performance
                </h2>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchPerformance}
                    className="mt-4 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Try Again
                </button>

            </div>

        );
    }


    // =========================================
    // NO DATA
    // =========================================

    if (!performance) {

        return (

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">

                <div className="text-5xl mb-4">
                    📊
                </div>

                <p className="text-gray-500">
                    No performance data available.
                </p>

            </div>

        );
    }


    return (

        <div className="space-y-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <p className="text-blue-600 font-medium">
                        Employee
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 mt-1">
                        My Performance
                    </h1>

                    <p className="text-gray-500 mt-2 text-lg">
                        Track your productivity and attendance performance.
                    </p>

                </div>


                <button
                    onClick={fetchPerformance}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =========================================
                EMPLOYEE NAME
            ========================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

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

                            <span className="text-2xl text-gray-400 ml-1">
                                /100
                            </span>

                        </h2>

                    </div>


                    <div className="text-left md:text-right">

                        <p className="text-sm text-gray-500">
                            Performance Level
                        </p>

                        <p className="text-lg font-semibold text-gray-800 mt-1">

                            {performance.finalScore >= 80
                                ? "Excellent 🚀"
                                : performance.finalScore >= 60
                                    ? "Good 👍"
                                    : "Needs Improvement 📈"}

                        </p>

                    </div>

                </div>


                {/* SCORE BAR */}

                <div className="mt-6">

                    <div className="flex justify-between text-sm mb-2">

                        <span className="text-gray-500">
                            Overall Progress
                        </span>

                        <span className="font-semibold">
                            {performance.finalScore.toFixed(1)}%
                        </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">

                        <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
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

            <div>

                <div className="mb-5">

                    <h2 className="text-2xl font-bold text-gray-900">
                        Performance Breakdown
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Detailed overview of your performance metrics.
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">


                    {/* TASK SCORE */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                        <div className="flex justify-between items-start">

                            <div>

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

                            </div>

                            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
                                📋
                            </div>

                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Contribution: 40%
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${getBarWidth(
                                        performance.taskScore
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* ATTENDANCE SCORE */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                        <div className="flex justify-between items-start">

                            <div>

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

                            </div>

                            <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center text-xl">
                                🕐
                            </div>

                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Contribution: 30%
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                            <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${getBarWidth(
                                        performance.attendanceScore
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* REVIEW SCORE */}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                        <div className="flex justify-between items-start">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Review Score
                                </p>

                                <h3
                                    className={`text-3xl font-bold mt-2 ${getScoreColor(
                                        performance.reviewScore
                                    )}`}
                                >
                                    {performance.reviewScore.toFixed(1)}%
                                </h3>

                            </div>

                            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
                                ⭐
                            </div>

                        </div>

                        <p className="text-xs text-gray-400 mt-3">
                            Contribution: 30%
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                            <div
                                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                                style={{
                                    width: `${getBarWidth(
                                        performance.reviewScore
                                    )}%`,
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                PERFORMANCE CALCULATION
            ========================================= */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                <div className="mb-6">

                    <p className="text-blue-600 font-medium">
                        Understanding Your Score
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        Performance Calculation
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Your final performance score is calculated using the following metrics.
                    </p>

                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">

                        <div className="text-2xl mb-3">
                            📋
                        </div>

                        <p className="text-sm text-blue-600 font-semibold">
                            Task Performance
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Based on completed tasks compared to your total assigned tasks.
                        </p>

                        <p className="font-bold text-gray-800 mt-4">
                            40% weight
                        </p>

                    </div>


                    <div className="bg-green-50 rounded-xl p-5 border border-green-100">

                        <div className="text-2xl mb-3">
                            🕐
                        </div>

                        <p className="text-sm text-green-600 font-semibold">
                            Attendance
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Based on your attendance consistency and presence.
                        </p>

                        <p className="font-bold text-gray-800 mt-4">
                            30% weight
                        </p>

                    </div>


                    <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">

                        <div className="text-2xl mb-3">
                            ⭐
                        </div>

                        <p className="text-sm text-purple-600 font-semibold">
                            Manager Reviews
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                            Based on ratings and feedback provided by your manager.
                        </p>

                        <p className="font-bold text-gray-800 mt-4">
                            30% weight
                        </p>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default EmployeePerformance;