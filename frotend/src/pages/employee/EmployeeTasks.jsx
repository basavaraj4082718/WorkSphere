import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeTasks = () => {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingTask, setUpdatingTask] = useState(null);

    // =========================================================
    // FETCH MY TASKS
    // =========================================================

    const fetchMyTasks = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No authentication token found");
            }

            /*
             * We first get the logged-in employee dashboard.
             * This gives us the employeeId.
             */

            const dashboardResponse = await axios.get(
                "http://localhost:8080/api/dashboard/employee/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const employeeId =
                dashboardResponse.data.employeeId;

            /*
             * Now get all tasks.
             *
             * Your current backend already has:
             * GET /api/tasks
             *
             * We filter the result on the frontend
             * using employeeId.
             */

            const taskResponse = await axios.get(
                "http://localhost:8080/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const myTasks = taskResponse.data.filter(
                (task) => task.employeeId === employeeId
            );

            setTasks(myTasks);

        } catch (error) {

            console.error("MY TASKS ERROR:", error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Failed to load tasks"
            );

        } finally {

            setLoading(false);

        }
    };


    // =========================================================
    // LOAD TASKS
    // =========================================================

    useEffect(() => {

        let cancelled = false;

        const load = async () => {

            if (!cancelled) {
                await fetchMyTasks();
            }

        };

        void load();

        return () => {
            cancelled = true;
        };

    }, []);


    // =========================================================
    // UPDATE TASK STATUS
    // =========================================================

    const updateStatus = async (taskId, status) => {

        try {

            setUpdatingTask(taskId);

            const token = localStorage.getItem("token");

            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/status`,
                {
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            /*
             * Refresh tasks after updating status
             */

            await fetchMyTasks();

        } catch (error) {

            console.error(
                "UPDATE TASK STATUS ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to update task status"
            );

        } finally {

            setUpdatingTask(null);

        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <div className="flex justify-center items-center h-64">

                <div className="text-gray-500 text-lg">
                    Loading your tasks...
                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="space-y-8">

            {/* =====================================================
          HEADER
      ===================================================== */}

            <div>

                <p className="text-blue-600 font-medium">
                    Employee
                </p>

                <h1 className="text-4xl font-bold text-gray-900 mt-1">
                    My Tasks
                </h1>

                <p className="text-gray-500 mt-2 text-lg">
                    View and manage the tasks assigned to you.
                </p>

            </div>


            {/* =====================================================
          TASK COUNT
      ===================================================== */}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500 text-sm">
                            Total Assigned Tasks
                        </p>

                        <p className="text-4xl font-bold mt-2">
                            {tasks.length}
                        </p>

                    </div>

                    <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                        📋
                    </div>

                </div>

            </div>


            {/* =====================================================
          NO TASKS
      ===================================================== */}

            {tasks.length === 0 ? (

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">

                    <div className="text-6xl mb-4">
                        🎉
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800">
                        No tasks assigned
                    </h2>

                    <p className="text-gray-500 mt-2">
                        You currently don't have any tasks assigned to you.
                    </p>

                </div>

            ) : (

                /* =====================================================
                    TASK LIST
                ===================================================== */

                <div className="space-y-5">

                    {tasks.map((task) => (

                        <div
                            key={task.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
                        >

                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                                {/* =================================================
                    TASK INFORMATION
                ================================================= */}

                                <div className="flex-1">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h2 className="text-xl font-bold text-gray-900">
                                            {task.title}
                                        </h2>


                                        {/* PRIORITY */}

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                task.priority === "HIGH"
                                                    ? "bg-red-100 text-red-700"
                                                    : task.priority === "MEDIUM"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-green-100 text-green-700"
                                            }`}
                                        >
                      {task.priority}
                    </span>


                                        {/* STATUS */}

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                task.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700"
                                                    : task.status === "IN_PROGRESS"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                            }`}
                                        >
                      {task.status}
                    </span>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <p className="text-gray-600 mt-3">
                                        {task.description}
                                    </p>


                                    {/* TASK DETAILS */}

                                    <div className="flex flex-wrap gap-6 mt-5 text-sm">

                                        <div>

                      <span className="text-gray-400">
                        Deadline
                      </span>

                                            <p className="font-semibold text-gray-700 mt-1">
                                                📅 {task.deadline}
                                            </p>

                                        </div>


                                        <div>

                      <span className="text-gray-400">
                        Assigned By
                      </span>

                                            <p className="font-semibold text-gray-700 mt-1">
                                                👤 {task.managerName || "Admin"}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                    STATUS UPDATE
                ================================================= */}

                                <div className="lg:w-52">

                                    <label className="block text-sm font-medium text-gray-600 mb-2">
                                        Update Status
                                    </label>

                                    <select
                                        value={task.status}
                                        disabled={updatingTask === task.id}
                                        onChange={(e) =>
                                            updateStatus(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    >

                                        <option value="PENDING">
                                            Pending
                                        </option>

                                        <option value="IN_PROGRESS">
                                            In Progress
                                        </option>

                                        <option value="COMPLETED">
                                            Completed
                                        </option>

                                    </select>

                                    {updatingTask === task.id && (

                                        <p className="text-sm text-gray-400 mt-2">
                                            Updating...
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
};

export default EmployeeTasks;