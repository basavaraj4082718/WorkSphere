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


            const taskResponse = await axios.get(
                "http://localhost:8080/api/tasks",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const myTasks = taskResponse.data.filter(
                (task) => Number(task.employeeId) === Number(employeeId)
            );

            setTasks(myTasks);

        } catch (error) {

            console.error("MY TASKS ERROR:", error);

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

        fetchMyTasks();

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
    // CALCULATIONS
    // =========================================================

    const pendingTasks =
        tasks.filter(
            (task) => task.status === "PENDING"
        ).length;


    const inProgressTasks =
        tasks.filter(
            (task) => task.status === "IN_PROGRESS"
        ).length;


    const completedTasks =
        tasks.filter(
            (task) => task.status === "COMPLETED"
        ).length;


    // =========================================================
    // PRIORITY STYLE
    // =========================================================

    const getPriorityClass = (priority) => {

        if (priority === "HIGH") {
            return "bg-red-50 text-red-700 border-red-100";
        }

        if (priority === "MEDIUM") {
            return "bg-amber-50 text-amber-700 border-amber-100";
        }

        return "bg-emerald-50 text-emerald-700 border-emerald-100";
    };


    // =========================================================
    // STATUS STYLE
    // =========================================================

    const getStatusClass = (status) => {

        if (status === "COMPLETED") {
            return "bg-emerald-50 text-emerald-700 border-emerald-100";
        }

        if (status === "IN_PROGRESS") {
            return "bg-indigo-50 text-indigo-700 border-indigo-100";
        }

        return "bg-slate-100 text-slate-600 border-slate-200";
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto" />

                    <p className="text-slate-500 font-medium mt-4">
                        Loading your tasks...
                    </p>

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

            <div className="flex flex-col gap-2">

                <p className="text-indigo-600 font-semibold text-sm">
                    Employee Workspace
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    My Tasks
                </h1>

                <p className="text-slate-500 text-base sm:text-lg">
                    Track your assignments and keep your work progress up to date.
                </p>

            </div>


            {/* =====================================================
                TASK STATISTICS
            ===================================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">


                {/* TOTAL */}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Tasks
                            </p>

                            <p className="text-4xl font-bold text-slate-900 mt-3">
                                {tasks.length}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                            📋
                        </div>

                    </div>

                    <p className="text-sm text-slate-400 mt-5">
                        Tasks assigned to you
                    </p>

                </div>


                {/* PENDING */}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="text-4xl font-bold text-slate-700 mt-3">
                                {pendingTasks}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                            ⏳
                        </div>

                    </div>

                    <p className="text-sm text-slate-400 mt-5">
                        Waiting to be started
                    </p>

                </div>


                {/* IN PROGRESS */}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                In Progress
                            </p>

                            <p className="text-4xl font-bold text-indigo-600 mt-3">
                                {inProgressTasks}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                            🚀
                        </div>

                    </div>

                    <p className="text-sm text-slate-400 mt-5">
                        Currently being worked on
                    </p>

                </div>


                {/* COMPLETED */}

                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="text-4xl font-bold text-emerald-600 mt-3">
                                {completedTasks}
                            </p>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
                            ✓
                        </div>

                    </div>

                    <p className="text-sm text-slate-400 mt-5">
                        Successfully completed
                    </p>

                </div>

            </div>


            {/* =====================================================
                TASK LIST HEADER
            ===================================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-bold text-slate-900">
                        Your Assignments
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        Manage and update the progress of your assigned work.
                    </p>

                </div>


                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">

                    <span className="w-2 h-2 rounded-full bg-indigo-500" />

                    {tasks.length} Active Records

                </div>

            </div>


            {/* =====================================================
                NO TASKS
            ===================================================== */}

            {tasks.length === 0 ? (

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-14 text-center">

                    <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center text-4xl">
                        🎉
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mt-6">
                        You're all caught up!
                    </h2>

                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                        You currently don't have any tasks assigned to you.
                        New assignments will appear here when available.
                    </p>

                </div>

            ) : (

                /* =====================================================
                    TASK LIST
                ===================================================== */

                <div className="space-y-4">

                    {tasks.map((task) => (

                        <div
                            key={task.id}
                            className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                        >

                            <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">


                                {/* =================================================
                                    TASK INFORMATION
                                ================================================= */}

                                <div className="flex-1 min-w-0">


                                    {/* TITLE + BADGES */}

                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                            {task.title}
                                        </h2>


                                        {/* PRIORITY */}

                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border ${getPriorityClass(
                                                task.priority
                                            )}`}
                                        >
                                            {task.priority}
                                        </span>


                                        {/* STATUS */}

                                        <span
                                            className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border ${getStatusClass(
                                                task.status
                                            )}`}
                                        >
                                            {task.status.replace("_", " ")}
                                        </span>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <p className="text-slate-500 mt-3 leading-relaxed max-w-3xl">
                                        {task.description || "No task description provided."}
                                    </p>


                                    {/* DETAILS */}

                                    <div className="flex flex-wrap gap-6 sm:gap-10 mt-6">


                                        {/* DEADLINE */}

                                        <div>

                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                                                Deadline
                                            </p>

                                            <p className="font-semibold text-slate-700 mt-1.5 text-sm">
                                                📅 {task.deadline}
                                            </p>

                                        </div>


                                        {/* ASSIGNED BY */}

                                        <div>

                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                                                Assigned By
                                            </p>

                                            <p className="font-semibold text-slate-700 mt-1.5 text-sm">
                                                👤 {task.managerName || "Admin"}
                                            </p>

                                        </div>


                                        {/* TASK ID */}

                                        <div>

                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                                                Task Reference
                                            </p>

                                            <p className="font-semibold text-slate-600 mt-1.5 text-sm">
                                                #{task.id}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    STATUS UPDATE
                                ================================================= */}

                                <div className="w-full xl:w-56 shrink-0">

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">

                                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                                            Update Progress
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
                                            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
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


                                        {updatingTask === task.id ? (

                                            <div className="flex items-center gap-2 mt-3">

                                                <div className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />

                                                <p className="text-xs text-indigo-600 font-medium">
                                                    Updating task...
                                                </p>

                                            </div>

                                        ) : (

                                            <p className="text-xs text-slate-400 mt-3">
                                                Changes are saved automatically
                                            </p>

                                        )}

                                    </div>

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