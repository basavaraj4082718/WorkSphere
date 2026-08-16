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

    // =========================
    // FETCH TASKS
    // =========================

    const fetchTasks = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/tasks",
                authConfig
            );

            setTasks(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load tasks");
        }
    };

    // =========================
    // FETCH EMPLOYEES
    // =========================

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/employees",
                authConfig
            );

            setEmployees(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load employees");
        }
    };

    // =========================
    // FETCH MANAGERS
    // =========================

    const fetchManagers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/managers",
                authConfig
            );

            setManagers(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load managers");
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
        fetchManagers();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // RESET FORM
    // =========================

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

    // =========================
    // CREATE / UPDATE TASK
    // =========================

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
                "Task operation failed"
            );
        }
    };

    // =========================
    // EDIT TASK
    // =========================

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

    // =========================
    // DELETE TASK
    // =========================

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
                "Failed to delete task"
            );
        }
    };

    // =========================
    // ASSIGN EMPLOYEE
    // =========================

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

            alert("Employee assigned successfully");

            fetchTasks();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign employee"
            );
        }
    };

    // =========================
    // ASSIGN MANAGER
    // =========================

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

            alert("Manager assigned successfully");

            fetchTasks();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign manager"
            );
        }
    };

    // =========================
    // UPDATE STATUS
    // =========================

    const handleStatusChange = async (
        taskId,
        status
    ) => {
        if (!status) return;

        try {
            await axios.put(
                `http://localhost:8080/api/tasks/${taskId}/status`,
                {
                    status: status,
                },
                authConfig
            );

            alert("Task status updated");

            fetchTasks();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update task status"
            );
        }
    };

    // =========================
    // FILTER TASKS
    // =========================

    const filteredTasks = tasks.filter((task) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            task.title
                ?.toLowerCase()
                .includes(searchValue) ||
            task.description
                ?.toLowerCase()
                .includes(searchValue) ||
            task.employeeName
                ?.toLowerCase()
                .includes(searchValue) ||
            task.managerName
                ?.toLowerCase()
                .includes(searchValue);

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

    // =========================
    // STATUS STYLE
    // =========================

    const getStatusClass = (status) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =========================
    // PRIORITY STYLE
    // =========================

    const getPriorityClass = (priority) => {
        switch (priority) {
            case "HIGH":
                return "bg-red-100 text-red-700";

            case "MEDIUM":
                return "bg-orange-100 text-orange-700";

            case "LOW":
                return "bg-green-100 text-green-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <p className="text-blue-600 font-medium">
                        Administration
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Task Management
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Create, assign and monitor organization tasks.
                    </p>

                </div>

                <button
                    onClick={() => {
                        setEditingTask(null);

                        setFormData({
                            title: "",
                            description: "",
                            priority: "MEDIUM",
                            deadline: "",
                        });

                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    + Create Task
                </button>

            </div>


            {/* FILTERS */}

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="Search tasks, employees or managers..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="border border-gray-300 p-3 rounded-lg"
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
                        className="border border-gray-300 p-3 rounded-lg"
                    >

                        <option value="ALL">
                            All Priorities
                        </option>

                        <option value="HIGH">
                            High
                        </option>

                        <option value="MEDIUM">
                            Medium
                        </option>

                        <option value="LOW">
                            Low
                        </option>

                    </select>

                </div>

            </div>


            {/* CREATE / EDIT FORM */}

            {showForm && (

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                    <div className="flex justify-between items-center mb-5">

                        <h2 className="text-xl font-semibold">
                            {editingTask
                                ? "Edit Task"
                                : "Create Task"}
                        </h2>

                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-800 text-xl"
                        >
                            ×
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            <input
                                name="title"
                                placeholder="Task title"
                                value={formData.title}
                                onChange={handleChange}
                                maxLength={100}
                                required
                                className="border p-3 rounded-lg"
                            />

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                required
                                className="border p-3 rounded-lg"
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

                        <textarea
                            name="description"
                            placeholder="Task description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength={1000}
                            rows="4"
                            required
                            className="w-full border p-3 rounded-lg"
                        />

                        <div>

                            <label className="block text-sm text-gray-600 mb-2">
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
                                className="border p-3 rounded-lg"
                            />

                        </div>

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                            >
                                {editingTask
                                    ? "Update Task"
                                    : "Create Task"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* TASK TABLE */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

                <table className="w-full min-w-[1200px]">

                    <thead className="bg-gray-50">

                    <tr>

                        <th className="text-left p-4">
                            Task
                        </th>

                        <th className="text-left p-4">
                            Priority
                        </th>

                        <th className="text-left p-4">
                            Status
                        </th>

                        <th className="text-left p-4">
                            Deadline
                        </th>

                        <th className="text-left p-4">
                            Employee
                        </th>

                        <th className="text-left p-4">
                            Manager
                        </th>

                        <th className="text-left p-4">
                            Actions
                        </th>

                    </tr>

                    </thead>

                    <tbody>

                    {filteredTasks.map((task) => (

                        <tr
                            key={task.id}
                            className="border-t hover:bg-gray-50"
                        >

                            {/* TASK */}

                            <td className="p-4 max-w-[250px]">

                                <p className="font-semibold text-gray-900">
                                    {task.title}
                                </p>

                                <p className="text-sm text-gray-500 truncate">
                                    {task.description}
                                </p>

                            </td>


                            {/* PRIORITY */}

                            <td className="p-4">

                  <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityClass(
                          task.priority
                      )}`}
                  >
                    {task.priority}
                  </span>

                            </td>


                            {/* STATUS */}

                            <td className="p-4">

                                <select
                                    value={task.status || "PENDING"}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            task.id,
                                            e.target.value
                                        )
                                    }
                                    className={`px-3 py-2 rounded-lg border-0 text-sm font-medium ${getStatusClass(
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

                            <td className="p-4">

                  <span
                      className={
                          task.deadline &&
                          new Date(task.deadline) <
                          new Date()
                              ? "text-red-600 font-medium"
                              : "text-gray-700"
                      }
                  >
                    {task.deadline}
                  </span>

                            </td>


                            {/* EMPLOYEE */}

                            <td className="p-4">

                                <select
                                    value={task.employeeId || ""}
                                    onChange={(e) =>
                                        handleAssignEmployee(
                                            task.id,
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded-lg text-sm"
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

                            <td className="p-4">

                                <select
                                    value={task.managerId || ""}
                                    onChange={(e) =>
                                        handleAssignManager(
                                            task.id,
                                            e.target.value
                                        )
                                    }
                                    className="border p-2 rounded-lg text-sm"
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

                            <td className="p-4">

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            handleEdit(task)
                                        }
                                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleDelete(task.id)
                                        }
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                                    >
                                        Delete
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>


                {filteredTasks.length === 0 && (

                    <div className="text-center py-12">

                        <p className="text-gray-500">
                            No tasks found.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Try changing your search or filters.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default TaskManagement;