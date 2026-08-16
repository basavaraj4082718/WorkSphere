import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let cancelled = false;

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await axios.get(
            "http://localhost:8080/api/dashboard/employee/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        console.log(
            "Employee dashboard:",
            response.data
        );

        if (!cancelled) {
          setDashboard(response.data);
        }

      } catch (error) {

        console.error(
            "EMPLOYEE DASHBOARD ERROR:",
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

        if (!cancelled) {

          alert(
              error.response?.data?.message ||
              error.response?.data ||
              error.message ||
              "Failed to load employee dashboard"
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    };

    void fetchDashboard();

    return () => {
      cancelled = true;
    };

  }, []);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
        <div className="flex justify-center items-center h-64">

          <div className="text-gray-500 text-lg">
            Loading your dashboard...
          </div>

        </div>
    );
  }


  // =========================================
  // NO DATA
  // =========================================

  if (!dashboard) {

    return (
        <div className="flex justify-center items-center h-64">

          <div className="text-center">

            <div className="text-5xl mb-4">
              ⚠️
            </div>

            <h2 className="text-xl font-semibold">
              Dashboard unavailable
            </h2>

            <p className="text-gray-500 mt-2">
              We couldn't load your dashboard data.
            </p>

          </div>

        </div>
    );
  }


  // =========================================
  // CALCULATIONS
  // =========================================

  const taskCompletion =
      dashboard.assignedTasks > 0
          ? (
              (dashboard.completedTasks /
                  dashboard.assignedTasks) *
              100
          ).toFixed(1)
          : 0;


  const attendanceScore =
      Number(dashboard.attendanceScore || 0);

  const reviewScore =
      Number(dashboard.reviewScore || 0);

  const performanceScore =
      Number(dashboard.performanceScore || 0);


  return (

      <div className="space-y-8">

        {/* HEADER */}

        <div>

          <p className="text-blue-600 font-medium">
            Employee Dashboard
          </p>

          <h1 className="text-4xl font-bold text-gray-900 mt-1">
            Welcome, {dashboard.employeeName} 👋
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Here's an overview of your work and performance.
          </p>

        </div>


        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Assigned Tasks */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Assigned Tasks
                </p>

                <p className="text-4xl font-bold mt-3">
                  {dashboard.assignedTasks}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                📋
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Tasks assigned to you
            </p>

          </div>


          {/* Completed Tasks */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Completed Tasks
                </p>

                <p className="text-4xl font-bold mt-3 text-green-600">
                  {dashboard.completedTasks}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                ✅
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Successfully completed
            </p>

          </div>


          {/* Attendance */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Attendance
                </p>

                <p className="text-4xl font-bold mt-3 text-blue-600">
                  {attendanceScore.toFixed(1)}%
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                🕐
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Attendance score
            </p>

          </div>


          {/* Performance */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Performance
                </p>

                <p className="text-4xl font-bold mt-3 text-purple-600">
                  {performanceScore.toFixed(1)}
                </p>

              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                ⭐
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Overall performance score
            </p>

          </div>

        </div>


        {/* PERFORMANCE + TASK PROGRESS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Performance Overview */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-2xl font-bold">
              Performance Overview
            </h2>

            <p className="text-gray-500 mt-1">
              Your current performance metrics
            </p>


            {/* Attendance */}

            <div className="mt-7">

              <div className="flex justify-between mb-2">

                            <span className="text-gray-600">
                                Attendance
                            </span>

                <span className="font-semibold">
                                {attendanceScore.toFixed(1)}%
                            </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                          attendanceScore,
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>


            {/* Review */}

            <div className="mt-6">

              <div className="flex justify-between mb-2">

                            <span className="text-gray-600">
                                Review Score
                            </span>

                <span className="font-semibold">
                                {reviewScore.toFixed(1)} / 5
                            </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                    className="bg-yellow-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                          (reviewScore / 5) * 100,
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>


            {/* Overall */}

            <div className="mt-6">

              <div className="flex justify-between mb-2">

                            <span className="text-gray-600">
                                Overall Performance
                            </span>

                <span className="font-semibold">
                                {performanceScore.toFixed(1)}
                            </span>

              </div>

              <div className="w-full bg-gray-200 rounded-full h-3">

                <div
                    className="bg-purple-600 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                          performanceScore,
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>

          </div>


          {/* Task Progress */}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

            <h2 className="text-2xl font-bold">
              Task Progress
            </h2>

            <p className="text-gray-500 mt-1">
              Your current task completion
            </p>


            <div className="flex justify-center items-center py-8">

              <div className="relative w-44 h-44">

                <div className="w-full h-full rounded-full border-[14px] border-gray-200" />

                <div
                    className="absolute inset-0 rounded-full border-[14px] border-blue-600"
                    style={{
                      clipPath: `polygon(
                                        0 0,
                                        ${taskCompletion}% 0,
                                        ${taskCompletion}% 100%,
                                        0 100%
                                    )`,
                    }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-4xl font-bold">
                    {taskCompletion}%
                  </p>

                  <p className="text-gray-500 text-sm">
                    Completed
                  </p>

                </div>

              </div>

            </div>


            <div className="flex justify-center gap-8">

              <div className="text-center">

                <p className="text-2xl font-bold">
                  {dashboard.completedTasks}
                </p>

                <p className="text-sm text-gray-500">
                  Completed
                </p>

              </div>


              <div className="text-center">

                <p className="text-2xl font-bold">
                  {dashboard.assignedTasks -
                      dashboard.completedTasks}
                </p>

                <p className="text-sm text-gray-500">
                  Remaining
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* PERFORMANCE SCORE */}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div>

              <p className="text-blue-600 font-medium">
                Overall Performance
              </p>

              <h2 className="text-3xl font-bold mt-1">
                Keep pushing forward! 🚀
              </h2>

              <p className="text-gray-500 mt-2">
                Your performance score is based on
                attendance, reviews and task progress.
              </p>

            </div>


            <div className="w-32 h-32 rounded-full border-[10px] border-purple-500 flex flex-col items-center justify-center">

              <p className="text-3xl font-bold">
                {performanceScore.toFixed(1)}
              </p>

              <p className="text-gray-500 text-sm">
                Score
              </p>

            </div>

          </div>

        </div>

      </div>
  );
};

export default EmployeeDashboard;