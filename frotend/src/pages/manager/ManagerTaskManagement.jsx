import { useEffect, useState } from "react";
import axios from "axios";

const ManagerTaskManagement = () => {

    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [showAssign, setShowAssign] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [assigningTask, setAssigningTask] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        deadline: "",
    });

    const [selectedEmployee, setSelectedEmployee] = useState("");


    // =========================================
    // FETCH TASKS OF LOGGED-IN MANAGER'S TEAM
    // =========================================

    const fetchTasks = async () => {

        try {

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                config
            );

            const managerId = managerResponse.data.managerId;


            const employeeResponse = await axios.get(
                "http://localhost:8080/api/employees",
                config
            );


            const myEmployees =
                employeeResponse.data.filter(
                    (employee) =>
                        Number(employee.managerId) ===
                        Number(managerId)
                );


            const myEmployeeIds =
                myEmployees.map(
                    (employee) => Number(employee.id)
                );


            const taskResponse = await axios.get(
                "http://localhost:8080/api/tasks",
                config
            );


            const myTasks =
                taskResponse.data.filter(
                    (task) =>
                        task.employeeId &&
                        myEmployeeIds.includes(
                            Number(task.employeeId)
                        )
                );


            setTasks(myTasks);

        } catch (error) {

            console.log("MANAGER TASK ERROR:", error);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load tasks"
            );

        }
    };


    // =========================================
    // FETCH EMPLOYEES
    // =========================================

    const fetchEmployees = async () => {

        try {

            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };


            const response = await axios.get(
                "http://localhost:8080/api/employees",
                config
            );


            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                config
            );


            const managerId =
                managerResponse.data.managerId;


            const myEmployees =
                response.data.filter(
                    (employee) =>
                        Number(employee.managerId) ===
                        Number(managerId)
                );


            setEmployees(myEmployees);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load employees"
            );

        }
    };


    // =========================================
    // INITIAL LOAD
    // =========================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            await Promise.all([
                fetchTasks(),
                fetchEmployees()
            ]);

            setLoading(false);

        };

        loadData();

    }, []);


    // =========================================
    // HANDLE FORM CHANGE
    // =========================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setFormData({
            title: "",
            description: "",
            priority: "MEDIUM",
            deadline: "",
        });

        setEditingTask(null);
        setShowForm(false);

    };


    // =========================================
    // CREATE / UPDATE TASK
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };


            if (editingTask) {

                await axios.put(
                    `http://localhost:8080/api/tasks/${editingTask.id}`,
                    formData,
                    config
                );

                alert("Task updated successfully");

            } else {

                await axios.post(
                    "http://localhost:8080/api/tasks",
                    formData,
                    config
                );

                alert("Task created successfully");

            }


            resetForm();

            await fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Task operation failed"
            );

        }

    };


    // =========================================
    // EDIT TASK
    // =========================================

    const handleEdit = (task) => {

        setEditingTask(task);

        setFormData({
            title: task.title,
            description: task.description,
            priority: task.priority,
            deadline: task.deadline,
        });

        setShowForm(true);

    };


    // =========================================
    // OPEN CREATE TASK MODAL
    // =========================================

    const openCreateTask = () => {

        setEditingTask(null);

        setFormData({
            title: "",
            description: "",
            priority: "MEDIUM",
            deadline: "",
        });

        setShowForm(true);

    };


    // =========================================
    // OPEN ASSIGN MODAL
    // =========================================

    const openAssignEmployee = (task) => {

        setAssigningTask(task);

        setSelectedEmployee(
            task.employeeId
                ? String(task.employeeId)
                : ""
        );

        setShowAssign(true);

    };


    // =========================================
    // ASSIGN EMPLOYEE
    // =========================================

    const assignEmployee = async () => {

        if (!selectedEmployee) {

            alert("Please select an employee");

            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            await axios.put(
                `http://localhost:8080/api/tasks/${assigningTask.id}/assign-employee/${selectedEmployee}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            alert("Employee assigned successfully");


            setShowAssign(false);
            setAssigningTask(null);
            setSelectedEmployee("");


            await fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign employee"
            );

        }

    };


    // =========================================
    // UPDATE STATUS
    // =========================================

    const updateStatus = async (taskId, status) => {

        try {

            const token =
                localStorage.getItem("token");


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


            await fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update status"
            );

        }

    };


    // =========================================
    // SEARCH
    // =========================================

    const filteredTasks =
        tasks.filter((task) => {

            const value =
                search.toLowerCase();

            return (
                task.title
                    ?.toLowerCase()
                    .includes(value) ||

                task.description
                    ?.toLowerCase()
                    .includes(value) ||

                task.employeeName
                    ?.toLowerCase()
                    .includes(value) ||

                task.managerName
                    ?.toLowerCase()
                    .includes(value) ||

                task.priority
                    ?.toLowerCase()
                    .includes(value) ||

                task.status
                    ?.toLowerCase()
                    .includes(value)
            );

        });


    // =========================================
    // STATISTICS
    // =========================================

    const totalTasks = tasks.length;

    const pendingTasks =
        tasks.filter(
            task => task.status === "PENDING"
        ).length;

    const inProgressTasks =
        tasks.filter(
            task => task.status === "IN_PROGRESS"
        ).length;

    const completedTasks =
        tasks.filter(
            task => task.status === "COMPLETED"
        ).length;


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex min-h-[600px] items-center justify-center">

                <div className="text-center">

                    <div className="relative mx-auto h-14 w-14">

                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>

                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-slate-800">
                        Loading Tasks
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Preparing your team's workspace...
                    </p>

                </div>

            </div>

        );

    }


    return (

        <div className="space-y-8">


            {/* HERO HEADER */}

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 md:px-10 md:py-10">

                <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

                <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"></div>


                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">

                            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                            <span className="text-xs font-medium text-indigo-300">
                                Team Workspace
                            </span>

                        </div>


                        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                            Task Management
                        </h1>


                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">
                            Create, assign and track tasks across your team
                            from one centralized workspace.
                        </p>

                    </div>


                    <button
                        onClick={openCreateTask}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                    >

                        <span className="text-lg">
                            +
                        </span>

                        Create Task

                    </button>

                </div>

            </section>


            {/* SECTION HEADER */}

            <div>

                <p className="text-sm font-semibold text-indigo-600">
                    Task Overview
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Team productivity at a glance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Monitor task progress and manage your team's workload.
                </p>

            </div>


            {/* STATISTICS */}

            <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">

                    <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-50 transition group-hover:scale-125"></div>

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Tasks
                            </p>

                            <p className="mt-3 text-3xl font-bold text-slate-900">
                                {totalTasks}
                            </p>

                            <p className="mt-3 text-xs text-slate-400">
                                Tasks under your management
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
                            📋
                        </div>

                    </div>

                </div>


                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-xl">

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="mt-3 text-3xl font-bold text-amber-600">
                                {pendingTasks}
                            </p>

                            <p className="mt-3 text-xs text-slate-400">
                                Awaiting action
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                            ◷
                        </div>

                    </div>

                </div>


                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                In Progress
                            </p>

                            <p className="mt-3 text-3xl font-bold text-blue-600">
                                {inProgressTasks}
                            </p>

                            <p className="mt-3 text-xs text-slate-400">
                                Currently being worked on
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                            ↻
                        </div>

                    </div>

                </div>


                <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl">

                    <div className="relative flex items-start justify-between">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-3 text-3xl font-bold text-emerald-600">
                                {completedTasks}
                            </p>

                            <p className="mt-3 text-xs text-slate-400">
                                Successfully delivered
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                            ✓
                        </div>

                    </div>

                </div>

            </section>


            {/* SEARCH */}

            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search by task, employee, priority or status..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />

                </div>

            </section>


            {/* TASK TABLE */}

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Team Tasks
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage assignments and track task progress.
                        </p>

                    </div>


                    <div className="rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600">
                        {filteredTasks.length} Tasks Found
                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1000px]">

                        <thead className="bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Task
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Employee
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Priority
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Deadline
                            </th>

                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Status
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Actions
                            </th>

                        </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                        {filteredTasks.map((task) => (

                            <tr
                                key={task.id}
                                className="group transition hover:bg-slate-50/80"
                            >

                                <td className="px-6 py-5">

                                    <div>

                                        <p className="font-semibold text-slate-800">
                                            {task.title}
                                        </p>

                                        <p className="mt-1 max-w-xs truncate text-sm text-slate-500">
                                            {task.description}
                                        </p>

                                    </div>

                                </td>


                                <td className="px-6 py-5">

                                    {task.employeeName ? (

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                                                {task.employeeName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                            <span className="font-medium text-slate-700">
                                                    {task.employeeName}
                                                </span>

                                        </div>

                                    ) : (

                                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-400">
                                                Not Assigned
                                            </span>

                                    )}

                                </td>


                                <td className="px-6 py-5">

                                        <span
                                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                                                task.priority === "HIGH"
                                                    ? "bg-red-50 text-red-600 ring-1 ring-red-100"
                                                    : task.priority === "MEDIUM"
                                                        ? "bg-amber-50 text-amber-600 ring-1 ring-amber-100"
                                                        : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100"
                                            }`}
                                        >
                                            {task.priority}
                                        </span>

                                </td>


                                <td className="px-6 py-5">

                                        <span className="text-sm font-medium text-slate-600">
                                            {task.deadline}
                                        </span>

                                </td>


                                <td className="px-6 py-5">

                                    <select
                                        value={task.status}
                                        onChange={(e) =>
                                            updateStatus(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                        className={`rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition ${
                                            task.status === "COMPLETED"
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : task.status === "IN_PROGRESS"
                                                    ? "border-blue-200 bg-blue-50 text-blue-700"
                                                    : "border-amber-200 bg-amber-50 text-amber-700"
                                        }`}
                                    >

                                        <option value="PENDING">
                                            PENDING
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN PROGRESS
                                        </option>

                                        <option value="COMPLETED">
                                            COMPLETED
                                        </option>

                                    </select>

                                </td>


                                <td className="px-6 py-5">

                                    <div className="flex justify-end gap-2">

                                        <button
                                            onClick={() =>
                                                openAssignEmployee(task)
                                            }
                                            className="rounded-xl bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
                                        >
                                            Assign
                                        </button>


                                        <button
                                            onClick={() =>
                                                handleEdit(task)
                                            }
                                            className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600 transition hover:bg-amber-500 hover:text-white"
                                        >
                                            Edit
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                {filteredTasks.length === 0 && (

                    <div className="px-6 py-16 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                            📋
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-800">
                            No tasks found
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Create a new task or try changing your search.
                        </p>

                    </div>

                )}

            </section>


            {/* =========================================
                CREATE / EDIT TASK MODAL
            ========================================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">

                                    {editingTask ? "✎" : "+"}

                                </div>

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {editingTask
                                            ? "Edit Task"
                                            : "Create New Task"}

                                    </h2>

                                    <p className="mt-1 text-sm text-indigo-100">

                                        {editingTask
                                            ? "Update task information."
                                            : "Create a new task for your team."}

                                    </p>

                                </div>

                            </div>


                            <button
                                onClick={resetForm}
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl transition hover:bg-white/20"
                            >
                                ×
                            </button>

                        </div>


                        {/* MODAL FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
                        >

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Task Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Enter task title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    required
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Task Description
                                </label>

                                <textarea
                                    name="description"
                                    placeholder="Describe the task and expected outcome..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                    required
                                />

                            </div>


                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                        required
                                    >

                                        <option value="LOW">
                                            LOW
                                        </option>

                                        <option value="MEDIUM">
                                            MEDIUM
                                        </option>

                                        <option value="HIGH">
                                            HIGH
                                        </option>

                                    </select>

                                </div>


                                <div>

                                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                                        Deadline
                                    </label>

                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                        required
                                    />

                                </div>

                            </div>


                            {/* BUTTONS */}

                            <div className="flex gap-3 border-t border-slate-100 pt-5">

                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                                >

                                    {editingTask
                                        ? "Update Task"
                                        : "Create Task"}

                                </button>


                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* =========================================
                ASSIGN EMPLOYEE MODAL
            ========================================= */}

            {showAssign && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">
                                    👤
                                </div>

                                <div>

                                    <h2 className="text-xl font-bold">
                                        Assign Employee
                                    </h2>

                                    <p className="mt-1 text-sm text-indigo-100">
                                        Choose a team member for this task.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* MODAL CONTENT */}

                        <div className="p-6">

                            <div className="mb-6 rounded-2xl bg-slate-50 p-4">

                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Selected Task
                                </p>

                                <p className="mt-2 font-semibold text-slate-800">
                                    {assigningTask?.title}
                                </p>

                            </div>


                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                Select Employee
                            </label>


                            <select
                                value={selectedEmployee}
                                onChange={(e) =>
                                    setSelectedEmployee(e.target.value)
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                            >

                                <option value="">
                                    Select Employee
                                </option>


                                {employees.map((employee) => (

                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >

                                        {employee.firstName}{" "}
                                        {employee.lastName}

                                        {" - "}

                                        {employee.employeeCode}

                                    </option>

                                ))}

                            </select>


                            <div className="mt-7 flex gap-3">

                                <button
                                    onClick={assignEmployee}
                                    className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
                                >
                                    Assign Employee
                                </button>


                                <button
                                    onClick={() => {

                                        setShowAssign(false);
                                        setAssigningTask(null);
                                        setSelectedEmployee("");

                                    }}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

export default ManagerTaskManagement;