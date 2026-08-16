import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/dashboard/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
    );
  }

  if (!dashboard) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-xl">
          Unable to load dashboard data.
        </div>
    );
  }

  const completionRate =
      dashboard.totalTasks > 0
          ? Math.round(
              (dashboard.completedTasks /
                  dashboard.totalTasks) *
              100
          )
          : 0;

  return (
      <div className="space-y-8">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <p className="text-blue-600 font-medium">
              Overview
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-1">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor your organization's employees,
              managers and overall performance.
            </p>
          </div>

          <button
              onClick={fetchDashboard}
              className="border border-gray-300 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            ↻ Refresh
          </button>

        </div>


        {/* Main Statistics */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Employees */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Employees
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalEmployees}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>

            <Link
                to="/admin/employees"
                className="text-blue-600 text-sm mt-4 inline-block hover:underline"
            >
              Manage employees →
            </Link>

          </div>


          {/* Managers */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Managers
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalManagers}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">
                👔
              </div>

            </div>

            <Link
                to="/admin/managers"
                className="text-purple-600 text-sm mt-4 inline-block hover:underline"
            >
              Manage managers →
            </Link>

          </div>


          {/* Tasks */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Tasks
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {dashboard.totalTasks}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
                📋
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Organization-wide tasks
            </p>

          </div>


          {/* Completed */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Completed Tasks
                </p>

                <p className="text-3xl font-bold text-green-600 mt-2">
                  {dashboard.completedTasks}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
                ✓
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Successfully completed
            </p>

          </div>


          {/* Pending */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Pending Tasks
                </p>

                <p className="text-3xl font-bold text-red-500 mt-2">
                  {dashboard.pendingTasks}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
                ⏳
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Tasks requiring attention
            </p>

          </div>


          {/* Performance */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Average Performance
                </p>

                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {dashboard.averagePerformanceScore.toFixed(2)}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                📈
              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4">
              Overall employee performance
            </p>

          </div>

        </div>


        {/* Performance Section */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Task Completion */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Task Completion
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Organization-wide completion rate
                </p>
              </div>

              <span className="text-2xl font-bold text-blue-600">
              {completionRate}%
            </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-4">

              <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-700"
                  style={{
                    width: `${completionRate}%`,
                  }}
              />

            </div>

            <div className="flex justify-between text-sm mt-4">

            <span className="text-green-600">
              {dashboard.completedTasks} completed
            </span>

              <span className="text-red-500">
              {dashboard.pendingTasks} pending
            </span>

            </div>

          </div>


          {/* Top Performer */}

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">

            <p className="text-sm text-gray-500">
              Top Performer
            </p>

            <div className="flex items-center gap-4 mt-5">

              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl">
                👤
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  {dashboard.topPerformer}
                </h2>

                <p className="text-gray-500 mt-1">
                  Highest performance score
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Quick Actions */}

        <div>

          <h2 className="text-xl font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-gray-500 text-sm mt-1 mb-4">
            Frequently used administration tools
          </p>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <Link
                to="/admin/employees"
                className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition"
            >

              <div className="text-2xl mb-3">
                👤+
              </div>

              <h3 className="font-semibold text-lg">
                Manage Employees
              </h3>

              <p className="text-blue-100 text-sm mt-1">
                Add, edit, delete and assign employees.
              </p>

            </Link>


            <Link
                to="/admin/managers"
                className="bg-purple-600 text-white rounded-xl p-5 hover:bg-purple-700 transition"
            >

              <div className="text-2xl mb-3">
                👔+
              </div>

              <h3 className="font-semibold text-lg">
                Manage Managers
              </h3>

              <p className="text-purple-100 text-sm mt-1">
                Add, edit and manage managers.
              </p>

            </Link>


            <Link
                to="/admin/employees"
                className="bg-gray-900 text-white rounded-xl p-5 hover:bg-gray-800 transition"
            >

              <div className="text-2xl mb-3">
                🔍
              </div>

              <h3 className="font-semibold text-lg">
                View Organization
              </h3>

              <p className="text-gray-300 text-sm mt-1">
                Browse your employee directory.
              </p>

            </Link>

          </div>

        </div>

      </div>
  );
};

export default AdminDashboard;