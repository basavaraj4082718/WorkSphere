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


            // =========================================
            // GET LOGGED-IN MANAGER
            // =========================================

            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                config
            );

            const managerId =
                managerResponse.data.managerId;


            // =========================================
            // GET ALL EMPLOYEES
            // =========================================

            const employeeResponse = await axios.get(
                "http://localhost:8080/api/employees",
                config
            );


            // =========================================
            // GET ONLY THIS MANAGER'S EMPLOYEES
            // =========================================

            const myEmployees =
                employeeResponse.data.filter(
                    (employee) =>
                        Number(employee.managerId) ===
                        Number(managerId)
                );


            // Get employee IDs
            const myEmployeeIds =
                myEmployees.map(
                    (employee) => Number(employee.id)
                );


            // =========================================
            // GET ALL TASKS
            // =========================================

            const taskResponse = await axios.get(
                "http://localhost:8080/api/tasks",
                config
            );


            // =========================================
            // KEEP ONLY MY EMPLOYEES' TASKS
            // =========================================

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

            console.log(
                "MANAGER TASK ERROR:",
                error
            );

            console.log(
                "STATUS:",
                error.response?.status
            );

            console.log(
                "DATA:",
                error.response?.data
            );

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

            const token =
                localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/employees",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            // =========================================
            // GET LOGGED-IN MANAGER
            // =========================================

            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            const managerId =
                managerResponse.data.managerId;


            // =========================================
            // ONLY THIS MANAGER'S EMPLOYEES
            // =========================================

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

    const totalTasks =
        tasks.length;


    const pendingTasks =
        tasks.filter(
            task =>
                task.status === "PENDING"
        ).length;


    const inProgressTasks =
        tasks.filter(
            task =>
                task.status === "IN_PROGRESS"
        ).length;


    const completedTasks =
        tasks.filter(
            task =>
                task.status === "COMPLETED"
        ).length;


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <p className="text-gray-500 text-lg">
                    Loading tasks...
                </p>

            </div>

        );

    }


    return (

        <div className="space-y-6">


            {/* =================================
                HEADER
            ================================= */}

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-blue-600 font-medium">
                        Manager Portal
                    </p>

                    <h1 className="text-3xl font-bold mt-1">
                        Task Management
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Create, assign and manage tasks for your team.
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
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                >
                    + Create Task
                </button>

            </div>


            {/* =================================
                STATISTICS
            ================================= */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">


                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500">
                        Total Tasks
                    </p>

                    <p className="text-3xl font-bold mt-2">
                        {totalTasks}
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500">
                        Pending
                    </p>

                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                        {pendingTasks}
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500">
                        In Progress
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-2">
                        {inProgressTasks}
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow p-5">

                    <p className="text-gray-500">
                        Completed
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                        {completedTasks}
                    </p>

                </div>

            </div>


            {/* =================================
                SEARCH
            ================================= */}

            <div className="bg-white rounded-xl shadow p-4">

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =================================
                CREATE / EDIT FORM
            ================================= */}

            {showForm && (

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-5">

                        {editingTask
                            ? "Edit Task"
                            : "Create New Task"}

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >


                        <input
                            type="text"
                            name="title"
                            placeholder="Task title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <textarea
                            name="description"
                            placeholder="Task description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border p-3 rounded-lg"
                            required
                        />


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
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


                            <input
                                type="date"
                                name="deadline"
                                value={formData.deadline}
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                required
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


            {/* =================================
                TASK TABLE
            ================================= */}

            <div className="bg-white rounded-xl shadow overflow-x-auto">

                <table className="w-full">


                    <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left p-4">
                            Task
                        </th>

                        <th className="text-left p-4">
                            Employee
                        </th>

                        <th className="text-left p-4">
                            Priority
                        </th>

                        <th className="text-left p-4">
                            Deadline
                        </th>

                        <th className="text-left p-4">
                            Status
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

                            <td className="p-4">

                                <p className="font-semibold">
                                    {task.title}
                                </p>

                                <p className="text-sm text-gray-500 max-w-xs truncate">
                                    {task.description}
                                </p>

                            </td>


                            {/* EMPLOYEE */}

                            <td className="p-4">

                                {task.employeeName ? (

                                    <span className="font-medium">
                                        {task.employeeName}
                                    </span>

                                ) : (

                                    <span className="text-gray-400">
                                        Not assigned
                                    </span>

                                )}

                            </td>


                            {/* PRIORITY */}

                            <td className="p-4">

                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        task.priority === "HIGH"
                                            ? "bg-red-100 text-red-700"
                                            : task.priority === "MEDIUM"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                    }`}
                                >

                                    {task.priority}

                                </span>

                            </td>


                            {/* DEADLINE */}

                            <td className="p-4">
                                {task.deadline}
                            </td>


                            {/* STATUS */}

                            <td className="p-4">

                                <select
                                    value={task.status}
                                    onChange={(e) =>
                                        updateStatus(
                                            task.id,
                                            e.target.value
                                        )
                                    }
                                    className="border rounded-lg px-3 py-2"
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


                            {/* ACTIONS */}

                            <td className="p-4">

                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            openAssignEmployee(task)
                                        }
                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Assign
                                    </button>


                                    <button
                                        onClick={() =>
                                            handleEdit(task)
                                        }
                                        className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>


                {filteredTasks.length === 0 && (

                    <div className="text-center py-12">

                        <div className="text-5xl mb-3">
                            📋
                        </div>

                        <h2 className="text-xl font-semibold">
                            No tasks found
                        </h2>

                        <p className="text-gray-500 mt-1">
                            Create a task or change your search.
                        </p>

                    </div>

                )}

            </div>


            {/* =================================
                ASSIGN EMPLOYEE MODAL
            ================================= */}

            {showAssign && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl shadow-xl p-6 w-[400px]">

                        <h2 className="text-xl font-semibold mb-4">
                            Assign Employee
                        </h2>


                        <p className="text-gray-500 mb-4">

                            Task:

                            <span className="font-semibold text-gray-800 ml-1">
                                {assigningTask?.title}
                            </span>

                        </p>


                        <select
                            value={selectedEmployee}
                            onChange={(e) =>
                                setSelectedEmployee(e.target.value)
                            }
                            className="w-full border p-3 rounded-lg mb-5"
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


                        <div className="flex gap-3">

                            <button
                                onClick={assignEmployee}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                            >
                                Assign
                            </button>


                            <button
                                onClick={() => {

                                    setShowAssign(false);
                                    setAssigningTask(null);

                                }}
                                className="bg-gray-500 text-white px-5 py-2 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
};

export default ManagerTaskManagement;