import { useEffect, useState } from "react";
import axios from "axios";

const ManagerDashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchDashboard = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/dashboard/manager/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      console.log("Manager Dashboard:", response.data);

      setDashboard(response.data);

    } catch (error) {

      console.error("Dashboard error:", error);

      setError(
          error.response?.data?.message ||
          "Failed to load manager dashboard"
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    fetchDashboard();
  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
        <div className="flex justify-center items-center min-h-[400px]">

          <div className="text-gray-500 text-lg">
            Loading dashboard...
          </div>

        </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">

          <h2 className="font-semibold text-lg">
            Unable to load dashboard
          </h2>

          <p className="mt-1">
            {error}
          </p>

          <button
              onClick={fetchDashboard}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>

        </div>
    );
  }


  if (!dashboard) {
    return null;
  }


  return (

      <div className="space-y-6">


        {/* ======================================
          HEADER
      ====================================== */}

        <div>

          <p className="text-blue-600 font-medium">
            Manager Dashboard
          </p>

          <h1 className="text-3xl font-bold text-gray-900 mt-1">

            Welcome, {dashboard.managerName} 👋

          </h1>

          <p className="text-gray-500 mt-2">
            Here's an overview of your team's performance.
          </p>

        </div>


        {/* ======================================
          STAT CARDS
      ====================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


          {/* TEAM SIZE */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Team Size
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.teamSize}
                </h2>

              </div>

              <div className="bg-blue-100 text-blue-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                👥
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Employees in your team
            </p>

          </div>


          {/* TASKS ASSIGNED */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Tasks Assigned
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.tasksAssigned}
                </h2>

              </div>

              <div className="bg-purple-100 text-purple-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                📋
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Tasks assigned to your team
            </p>

          </div>


          {/* COMPLETED */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Completed Tasks
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {dashboard.completedTasks}
                </h2>

              </div>

              <div className="bg-green-100 text-green-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                ✓
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Successfully completed
            </p>

          </div>


          {/* PERFORMANCE */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-gray-500 text-sm">
                  Team Performance
                </p>

                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  {Number(
                      dashboard.averageTeamPerformance
                  ).toFixed(1)}
                </h2>

              </div>

              <div className="bg-blue-100 text-blue-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                📈
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-4">
              Average performance score
            </p>

          </div>

        </div>


        {/* ======================================
          PERFORMANCE + TOP PERFORMER
      ====================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


          {/* PERFORMANCE CARD */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Team Performance
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Average performance across your team
            </p>


            <div className="flex items-center justify-center py-8">

              <div className="w-40 h-40 rounded-full border-[12px] border-blue-500 flex items-center justify-center">

                <div className="text-center">

                  <p className="text-3xl font-bold text-gray-900">

                    {Number(
                        dashboard.averageTeamPerformance
                    ).toFixed(1)}

                  </p>

                  <p className="text-sm text-gray-500">
                    Score
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* TOP PERFORMER */}

          <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-xl font-semibold text-gray-900">
              Top Performer
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Highest performing employee on your team
            </p>


            <div className="flex flex-col items-center justify-center py-8">

              <div className="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center text-4xl">
                🏆
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mt-4">
                {dashboard.topPerformer}
              </h3>

              <p className="text-gray-500 mt-1">
                Team Top Performer
              </p>

            </div>

          </div>

        </div>


        {/* ======================================
          QUICK ACTIONS
      ====================================== */}

        <div className="bg-white rounded-xl shadow-sm border p-6">

          <h2 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-gray-500 text-sm mt-1 mb-5">
            Manage your team from one place.
          </p>


          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


            <a
                href="/manager/team"
                className="border rounded-lg p-4 hover:bg-blue-50 hover:border-blue-300 transition"
            >

              <p className="font-semibold text-gray-900">
                👥 My Team
              </p>

              <p className="text-sm text-gray-500 mt-1">
                View your employees
              </p>

            </a>


            <a
                href="/manager/tasks"
                className="border rounded-lg p-4 hover:bg-purple-50 hover:border-purple-300 transition"
            >

              <p className="font-semibold text-gray-900">
                📋 Manage Tasks
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Create and assign tasks
              </p>

            </a>


            <a
                href="/manager/reviews"
                className="border rounded-lg p-4 hover:bg-green-50 hover:border-green-300 transition"
            >

              <p className="font-semibold text-gray-900">
                ⭐ Reviews
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Review employee performance
              </p>

            </a>

          </div>

        </div>

      </div>
  );
};

export default ManagerDashboard;