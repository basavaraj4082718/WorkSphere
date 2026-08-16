import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeManagement = () => {

  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    employeeCode: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    designation: "",
    password: "",
  });


  // =========================================================
  // FETCH EMPLOYEES
  // =========================================================

  const fetchEmployees = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/employees",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setEmployees(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load employees");
    }
  };


  // =========================================================
  // FETCH MANAGERS
  // =========================================================

  const fetchManagers = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/managers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setManagers(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load managers");
    }
  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchEmployees();
    fetchManagers();

  }, []);


  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {

    setFormData({
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      designation: "",
      password: "",
    });

    setEditingEmployee(null);
    setShowForm(false);
  };


  // =========================================================
  // ADD EMPLOYEE
  // =========================================================

  const handleAddEmployee = () => {

    setEditingEmployee(null);

    setFormData({
      employeeCode: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      designation: "",
      password: "",
    });

    setShowForm(true);
  };


  // =========================================================
  // SUBMIT FORM
  // =========================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");


      // =====================================================
      // UPDATE EMPLOYEE
      // =====================================================

      if (editingEmployee) {

        const updateData = {
          employeeCode: formData.employeeCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          department: formData.department,
          designation: formData.designation,
        };

        await axios.put(
            `http://localhost:8080/api/employees/${editingEmployee.id}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        alert("Employee updated successfully");

      }


          // =====================================================
          // CREATE EMPLOYEE
      // =====================================================

      else {

        await axios.post(
            "http://localhost:8080/api/employees",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        alert(
            "Employee created successfully.\n\n" +
            "The employee can now login using the email and password provided."
        );
      }


      resetForm();

      fetchEmployees();

    } catch (error) {

      console.log(error);

      console.log("STATUS:", error.response?.status);

      console.log("DATA:", error.response?.data);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Operation failed"
      );
    }
  };


  // =========================================================
  // EDIT EMPLOYEE
  // =========================================================

  const handleEdit = (employee) => {

    setEditingEmployee(employee);

    setFormData({
      employeeCode: employee.employeeCode || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      department: employee.department || "",
      designation: employee.designation || "",
      password: "",
    });

    setShowForm(true);
  };


  // =========================================================
  // DELETE EMPLOYEE
  // =========================================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
          `http://localhost:8080/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      alert("Employee deleted successfully");

      fetchEmployees();

    } catch (error) {

      console.log(error);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete employee"
      );
    }
  };


  // =========================================================
  // ASSIGN MANAGER
  // =========================================================

  const handleAssignManager = async (
      employeeId,
      managerId
  ) => {

    if (!managerId) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.put(
          `http://localhost:8080/api/employees/${employeeId}/assign-manager/${managerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      alert("Manager assigned successfully");

      fetchEmployees();

    } catch (error) {

      console.log(error);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to assign manager"
      );
    }
  };


  // =========================================================
  // SEARCH
  // =========================================================

  const filteredEmployees = employees.filter((employee) => {

    const searchValue = search.toLowerCase();

    return (
        employee.firstName
            ?.toLowerCase()
            .includes(searchValue) ||

        employee.lastName
            ?.toLowerCase()
            .includes(searchValue) ||

        employee.employeeCode
            ?.toLowerCase()
            .includes(searchValue) ||

        employee.email
            ?.toLowerCase()
            .includes(searchValue) ||

        employee.department
            ?.toLowerCase()
            .includes(searchValue) ||

        employee.designation
            ?.toLowerCase()
            .includes(searchValue)
    );
  });


  // =========================================================
  // UI
  // =========================================================

  return (

      <div className="space-y-6">


        {/* =====================================================
          HEADER
      ===================================================== */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>

            <p className="text-blue-600 font-medium">
              Administration
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Employee Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage employees, login accounts and assign managers.
            </p>

          </div>


          <button
              onClick={handleAddEmployee}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Employee
          </button>

        </div>


        {/* =====================================================
          SEARCH
      ===================================================== */}

        <div className="bg-white p-4 rounded-xl shadow-sm border">

          <input
              type="text"
              placeholder="Search by name, code, email, department or designation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        {/* =====================================================
          FORM
      ===================================================== */}

        {showForm && (

            <div className="bg-white p-6 rounded-xl shadow-sm border">


              <div className="mb-6">

                <h2 className="text-xl font-semibold text-gray-900">

                  {editingEmployee
                      ? "Edit Employee"
                      : "Add New Employee"}

                </h2>

                <p className="text-sm text-gray-500 mt-1">

                  {editingEmployee
                      ? "Update employee information."
                      : "Create an employee profile and login account."}

                </p>

              </div>


              <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >


                {/* =================================================
                EMPLOYEE CODE
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee Code
                  </label>

                  <input
                      name="employeeCode"
                      placeholder="Example: EMP001"
                      value={formData.employeeCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                FIRST NAME
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>

                  <input
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                LAST NAME
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>

                  <input
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                EMAIL
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>

                  <input
                      type="email"
                      name="email"
                      placeholder="employee@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                DEPARTMENT
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>

                  <input
                      name="department"
                      placeholder="Example: IT"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                DESIGNATION
            ================================================= */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>

                  <input
                      name="designation"
                      placeholder="Example: Java Developer"
                      value={formData.designation}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* =================================================
                PASSWORD
            ================================================= */}

                {!editingEmployee && (

                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Login Password
                      </label>

                      <input
                          type="password"
                          name="password"
                          placeholder="Create login password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />

                      <p className="text-xs text-gray-500 mt-1">
                        The employee will use this password to login.
                      </p>

                    </div>

                )}


                {/* =================================================
                BUTTONS
            ================================================= */}

                <div className="md:col-span-2 flex gap-3 pt-2">

                  <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >

                    {editingEmployee
                        ? "Update Employee"
                        : "Create Employee"}

                  </button>


                  <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-medium"
                  >
                    Cancel
                  </button>

                </div>

              </form>

            </div>

        )}


        {/* =====================================================
          EMPLOYEE COUNT
      ===================================================== */}

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-gray-900">
            Employees
          </h2>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {filteredEmployees.length} Employees
        </span>

        </div>


        {/* =====================================================
          EMPLOYEE TABLE
      ===================================================== */}

        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Code
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Employee
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Email
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Department
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Designation
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Manager
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

            </thead>


            <tbody>

            {filteredEmployees.map((employee) => (

                <tr
                    key={employee.id}
                    className="border-t hover:bg-gray-50 transition"
                >


                  {/* CODE */}

                  <td className="p-4">

                  <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                    {employee.employeeCode}
                  </span>

                  </td>


                  {/* NAME */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                        {employee.firstName
                            ?.charAt(0)
                            .toUpperCase()}

                      </div>

                      <div>

                        <p className="font-semibold text-gray-900">

                          {employee.firstName}{" "}
                          {employee.lastName}

                        </p>

                        <p className="text-xs text-gray-500">
                          Employee
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* EMAIL */}

                  <td className="p-4 text-gray-600">
                    {employee.email}
                  </td>


                  {/* DEPARTMENT */}

                  <td className="p-4">

                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {employee.department}
                  </span>

                  </td>


                  {/* DESIGNATION */}

                  <td className="p-4 text-gray-600">
                    {employee.designation}
                  </td>


                  {/* MANAGER */}

                  <td className="p-4">

                    <select
                        value={employee.managerId || ""}
                        onChange={(e) =>
                            handleAssignManager(
                                employee.id,
                                e.target.value
                            )
                        }
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >

                      <option value="">

                        {employee.managerName ||
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
                              handleEdit(employee)
                          }
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                      >
                        Edit
                      </button>


                      <button
                          onClick={() =>
                              handleDelete(employee.id)
                          }
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

            ))}

            </tbody>

          </table>


          {/* NO RESULTS */}

          {filteredEmployees.length === 0 && (

              <div className="py-12 text-center">

                <div className="text-4xl mb-3">
                  👥
                </div>

                <p className="text-gray-500">
                  No employees found.
                </p>

              </div>

          )}

        </div>

      </div>
  );
};

export default EmployeeManagement;