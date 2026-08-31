import { useEffect, useState } from "react";
import axios from "axios";

const TaskManagement = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [priorityFilter, setPriorityFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        priority: "MEDIUM",
        deadline: "",
    });

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // =====================================================
    // FETCH TASKS
    // =====================================================

    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:8080/api/tasks",
                authConfig
            );

            setTasks(response.data);

        } catch (error) {
            console.log(error);
            alert("Failed to load tasks");

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH EMPLOYEES
    // =====================================================

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/employees",
                authConfig
            );

            setEmployees(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // FETCH MANAGERS
    // =====================================================

    const fetchManagers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/managers",
                authConfig
            );

            setManagers(response.data);

        } catch (error) {
            console.log(error);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
        fetchManagers();
    }, []);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =====================================================
    // RESET FORM
    // =====================================================

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

    // =====================================================
    // OPEN CREATE FORM
    // =====================================================

    const handleCreateTask = () => {
        setEditingTask(null);

        setFormData({
            title: "",
            description: "",
            priority: "MEDIUM",
            deadline: "",
        });

        setShowForm(true);
    };

    // =====================================================
    // CREATE / UPDATE TASK
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingTask) {

                await axios.put(
                    `http://localhost:8080/api/tasks/${editingTask.id}`,
                    formData,
                    authConfig
                );

                alert("Task updated successfully");

            } else {

                await axios.post(
                    "http://localhost:8080/api/tasks",
                    formData,
                    authConfig
                );

                alert("Task created successfully");
            }

            resetForm();
            fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Task operation failed"
            );
        }
    };

    // =====================================================
    // EDIT TASK
    // =====================================================

    const handleEdit = (task) => {
        setEditingTask(task);

        setFormData({
            title: task.title || "",
            description: task.description || "",
            priority: task.priority || "MEDIUM",
            deadline: task.deadline || "",
        });

        setShowForm(true);
    };

    // =====================================================
    // DELETE TASK
    // =====================================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmed) return;

        try {

            await axios.delete(
                `http://localhost:8080/api/tasks/${id}`,
                authConfig
            );

            alert("Task deleted successfully");

            fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete task"
            );
        }
    };

    // =====================================================
    // ASSIGN EMPLOYEE
    // =====================================================

    const handleAssignEmployee = async (
        taskId,
        employeeId
    ) => {
        if (!employeeId) return;

        try {

            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/assign-employee/${employeeId}`,
                {},
                authConfig
            );

            fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign employee"
            );
        }
    };

    // =====================================================
    // ASSIGN MANAGER
    // =====================================================

    const handleAssignManager = async (
        taskId,
        managerId
    ) => {
        if (!managerId) return;

        try {

            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/assign-manager/${managerId}`,
                {},
                authConfig
            );

            fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign manager"
            );
        }
    };

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    const handleStatusChange = async (
        taskId,
        status
    ) => {
        if (!status) return;

        try {

            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/status`,
                {
                    status,
                },
                authConfig
            );

            fetchTasks();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task status"
            );
        }
    };

    // =====================================================
    // FILTER TASKS
    // =====================================================

    const filteredTasks = tasks.filter((task) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            task.title?.toLowerCase().includes(searchValue) ||
            task.description?.toLowerCase().includes(searchValue) ||
            task.employeeName?.toLowerCase().includes(searchValue) ||
            task.managerName?.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "ALL" ||
            task.status === statusFilter;

        const matchesPriority =
            priorityFilter === "ALL" ||
            task.priority === priorityFilter;

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
        );
    });

    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusClass = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";

            case "IN_PROGRESS":
                return "bg-blue-50 text-blue-700 border border-blue-200";

            case "PENDING":
                return "bg-amber-50 text-amber-700 border border-amber-200";

            default:
                return "bg-gray-100 text-gray-700 border border-gray-200";
        }
    };

    // =====================================================
    // PRIORITY STYLE
    // =====================================================

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "HIGH":
                return "bg-red-50 text-red-700 border border-red-200";

            case "MEDIUM":
                return "bg-orange-50 text-orange-700 border border-orange-200";

            case "LOW":
                return "bg-green-50 text-green-700 border border-green-200";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) return "No deadline";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // CHECK OVERDUE
    // =====================================================

    const isOverdue = (task) => {
        if (!task.deadline) return false;

        if (task.status === "COMPLETED") return false;

        return new Date(task.deadline) < new Date();
    };

    return (

        <div className="space-y-4">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <div>

                    <p className="text-blue-600 font-semibold text-xs uppercase tracking-wider">
                        Administration
                    </p>

                    <h1 className="text-2xl font-bold text-gray-900 mt-1">
                        Task Management
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                        Create, assign and monitor organization tasks.
                    </p>

                </div>

                <button
                    onClick={handleCreateTask}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm"
                >
                    + Create Task
                </button>

            </div>


            {/* =====================================================
                SEARCH & FILTERS
            ===================================================== */}

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >

                        <option value="ALL">
                            All Statuses
                        </option>

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


                    <select
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                        className="border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >

                        <option value="ALL">
                            All Priorities
                        </option>

                        <option value="HIGH">
                            High Priority
                        </option>

                        <option value="MEDIUM">
                            Medium Priority
                        </option>

                        <option value="LOW">
                            Low Priority
                        </option>

                    </select>

                </div>

            </div>


            {/* =====================================================
                TABLE HEADER
            ===================================================== */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-lg font-semibold text-gray-900">
                        All Tasks
                    </h2>

                    <p className="text-xs text-gray-500 mt-0.5">
                        Manage and track all organization tasks.
                    </p>

                </div>


                <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold">

                    {filteredTasks.length} Tasks

                </span>

            </div>


            {/* =====================================================
                TASK TABLE
            ===================================================== */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {loading ? (

                    <div className="py-12 text-center">

                        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>

                        <p className="text-sm text-gray-500 mt-3">
                            Loading tasks...
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1150px]">

                            <thead className="bg-gray-50 border-b border-gray-200">

                            <tr>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Task
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Priority
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Status
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Deadline
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Employee
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Manager
                                </th>

                                <th className="text-left px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                                    Actions
                                </th>

                            </tr>

                            </thead>


                            <tbody className="divide-y divide-gray-100">

                            {filteredTasks.map((task) => (

                                <tr
                                    key={task.id}
                                    className="hover:bg-gray-50 transition"
                                >

                                    {/* TASK */}

                                    <td className="px-4 py-3 max-w-[240px]">

                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                            {task.title}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                            {task.description}
                                        </p>

                                    </td>


                                    {/* PRIORITY */}

                                    <td className="px-4 py-3">

                                            <span
                                                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityClass(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority}
                                            </span>

                                    </td>


                                    {/* STATUS */}

                                    <td className="px-4 py-3">

                                        <select
                                            value={task.status || "PENDING"}
                                            onChange={(e) =>
                                                handleStatusChange(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer ${getStatusClass(
                                                task.status
                                            )}`}
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


                                    {/* DEADLINE */}

                                    <td className="px-4 py-3">

                                        <div>

                                            <p
                                                className={
                                                    isOverdue(task)
                                                        ? "text-red-600 font-semibold text-xs"
                                                        : "text-gray-700 text-xs font-medium"
                                                }
                                            >
                                                {formatDate(task.deadline)}
                                            </p>

                                            {isOverdue(task) && (

                                                <span className="text-xs text-red-500">
                                                        Overdue
                                                    </span>

                                            )}

                                        </div>

                                    </td>


                                    {/* EMPLOYEE */}

                                    <td className="px-4 py-3">

                                        <select
                                            value={task.employeeId || ""}
                                            onChange={(e) =>
                                                handleAssignEmployee(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                            className="border border-gray-300 bg-white px-2.5 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                        >

                                            <option value="">
                                                {task.employeeName ||
                                                    "Assign Employee"}
                                            </option>

                                            {employees.map((employee) => (

                                                <option
                                                    key={employee.id}
                                                    value={employee.id}
                                                >
                                                    {employee.firstName}{" "}
                                                    {employee.lastName}
                                                </option>

                                            ))}

                                        </select>

                                    </td>


                                    {/* MANAGER */}

                                    <td className="px-4 py-3">

                                        <select
                                            value={task.managerId || ""}
                                            onChange={(e) =>
                                                handleAssignManager(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                            className="border border-gray-300 bg-white px-2.5 py-1.5 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                        >

                                            <option value="">
                                                {task.managerName ||
                                                    "Assign Manager"}
                                            </option>

                                            {managers.map((manager) => (

                                                <option
                                                    key={manager.id}
                                                    value={manager.id}
                                                >
                                                    {manager.firstName}{" "}
                                                    {manager.lastName}
                                                </option>

                                            ))}

                                        </select>

                                    </td>


                                    {/* ACTIONS */}

                                    <td className="px-4 py-3">

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() =>
                                                    handleEdit(task)
                                                }
                                                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-xs font-medium"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(task.id)
                                                }
                                                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-xs font-medium"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                            </tbody>

                        </table>


                        {/* EMPTY STATE */}

                        {filteredTasks.length === 0 && (

                            <div className="py-12 text-center">

                                <div className="text-4xl mb-3">
                                    📋
                                </div>

                                <h3 className="text-base font-semibold text-gray-800">
                                    No tasks found
                                </h3>

                                <p className="text-gray-500 text-xs mt-1">
                                    Try adjusting your search or filters.
                                </p>

                            </div>

                        )}

                    </div>

                )}

            </div>


            {/* =====================================================
                CREATE / EDIT TASK MODAL
            ===================================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">

                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl">

                        {/* MODAL HEADER */}

                        <div className="flex items-center justify-between px-6 py-4 border-b">

                            <div>

                                <h2 className="text-xl font-bold text-gray-900">

                                    {editingTask
                                        ? "Edit Task"
                                        : "Create New Task"}

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    {editingTask
                                        ? "Update task information."
                                        : "Add a new task to the organization."}

                                </p>

                            </div>


                            <button
                                onClick={resetForm}
                                className="w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 text-xl transition"
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="p-6"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* TITLE */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Task Title
                                    </label>

                                    <input
                                        name="title"
                                        placeholder="Enter task title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        maxLength={100}
                                        required
                                        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>


                                {/* PRIORITY */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Priority
                                    </label>

                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <option value="LOW">
                                            Low Priority
                                        </option>

                                        <option value="MEDIUM">
                                            Medium Priority
                                        </option>

                                        <option value="HIGH">
                                            High Priority
                                        </option>

                                    </select>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="md:col-span-2">

                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        placeholder="Describe the task..."
                                        value={formData.description}
                                        onChange={handleChange}
                                        maxLength={1000}
                                        rows="4"
                                        required
                                        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />

                                </div>


                                {/* DEADLINE */}

                                <div>

                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
                                        required
                                        className="w-full border border-gray-300 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                </div>

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-5 py-2.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition text-sm font-medium"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium"
                                >

                                    {editingTask
                                        ? "Update Task"
                                        : "Create Task"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default TaskManagement;