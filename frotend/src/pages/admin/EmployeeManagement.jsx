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

      } else {

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
        employee.firstName?.toLowerCase().includes(searchValue) ||
        employee.lastName?.toLowerCase().includes(searchValue) ||
        employee.employeeCode?.toLowerCase().includes(searchValue) ||
        employee.email?.toLowerCase().includes(searchValue) ||
        employee.department?.toLowerCase().includes(searchValue) ||
        employee.designation?.toLowerCase().includes(searchValue)
    );
  });


  // =========================================================
  // UI
  // =========================================================

  return (

      <div className="space-y-8">


        {/* =====================================================
          HEADER
      ===================================================== */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>

            <p className="text-blue-600 font-semibold text-sm tracking-wide uppercase">
              Administration
            </p>

            <h1 className="text-4xl font-bold text-gray-900 mt-2">
              Employee Management
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Manage employee profiles, login accounts and manager assignments.
            </p>

          </div>


          <button
              onClick={handleAddEmployee}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition font-medium shadow-sm"
          >
            <span className="text-xl leading-none">+</span>
            Add Employee
          </button>

        </div>


        {/* =====================================================
          OVERVIEW + SEARCH
      ===================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


          {/* EMPLOYEE COUNT */}

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-sm font-medium text-gray-500">
                  Total Employees
                </p>

                <h2 className="text-4xl font-bold text-gray-900 mt-2">
                  {employees.length}
                </h2>

                <p className="text-sm text-gray-400 mt-2">
                  Active employee records
                </p>

              </div>

              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">
                👥
              </div>

            </div>

          </div>


          {/* SEARCH */}

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            <div className="flex flex-col justify-center h-full">

              <label className="text-sm font-semibold text-gray-700 mb-3">
                Search Employees
              </label>

              <div className="relative">

              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

                <input
                    type="text"
                    placeholder="Search by name, employee code, email, department or designation..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                />

              </div>

              <p className="text-xs text-gray-400 mt-2">
                Showing {filteredEmployees.length} matching employee
                {filteredEmployees.length !== 1 ? "s" : ""}
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
          ADD / EDIT EMPLOYEE MODAL
      ===================================================== */}

        {showForm && (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">


              {/* MODAL */}

              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">


                {/* ===============================================
                MODAL HEADER
            =============================================== */}

                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 text-white">

                  <div className="flex items-start justify-between gap-4">


                    <div className="flex items-center gap-4">

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">

                        {editingEmployee ? "✏️" : "👤"}

                      </div>


                      <div>

                        <h2 className="text-xl font-bold">

                          {editingEmployee
                              ? "Edit Employee"
                              : "Add New Employee"}

                        </h2>

                        <p className="mt-1 text-sm text-blue-100">

                          {editingEmployee
                              ? "Update employee information and save your changes."
                              : "Create a new employee profile and login account."}

                        </p>

                      </div>

                    </div>


                    {/* CLOSE BUTTON */}

                    <button
                        type="button"
                        onClick={resetForm}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl text-white transition hover:bg-white/20"
                    >
                      ×
                    </button>

                  </div>

                </div>


                {/* ===============================================
                MODAL BODY
            =============================================== */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6 md:p-8"
                >


                  {/* FORM INTRO */}

                  <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">

                    <p className="text-sm font-semibold text-blue-800">

                      {editingEmployee
                          ? "Employee Information"
                          : "New Employee Details"}

                    </p>

                    <p className="mt-1 text-xs text-blue-600">

                      Please fill in all required details carefully.

                    </p>

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    {/* EMPLOYEE CODE */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Employee Code
                      </label>

                      <input
                          name="employeeCode"
                          placeholder="EMP001"
                          value={formData.employeeCode}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* EMAIL */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>

                      <input
                          type="email"
                          name="email"
                          placeholder="employee@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* FIRST NAME */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>

                      <input
                          name="firstName"
                          placeholder="Enter first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* LAST NAME */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>

                      <input
                          name="lastName"
                          placeholder="Enter last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* DEPARTMENT */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Department
                      </label>

                      <input
                          name="department"
                          placeholder="Example: Engineering"
                          value={formData.department}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* DESIGNATION */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Designation
                      </label>

                      <input
                          name="designation"
                          placeholder="Example: Software Developer"
                          value={formData.designation}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                          required
                      />

                    </div>


                    {/* PASSWORD */}

                    {!editingEmployee && (

                        <div className="md:col-span-2">

                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Login Password
                          </label>

                          <input
                              type="password"
                              name="password"
                              placeholder="Create a secure login password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                              required
                          />

                          <p className="text-xs text-gray-400 mt-2">
                            The employee will use this email and password to access their WorkSphere account.
                          </p>

                        </div>

                    )}

                  </div>


                  {/* ===============================================
                  FORM ACTIONS
              =============================================== */}

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 mt-8 border-t border-gray-100">


                    <button
                        type="button"
                        onClick={resetForm}
                        className="sm:w-auto border border-gray-200 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition font-semibold"
                    >
                      Cancel
                    </button>


                    <button
                        type="submit"
                        className="sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition font-semibold shadow-lg shadow-blue-200"
                    >

                      {editingEmployee
                          ? "Save Changes"
                          : "Create Employee"}

                    </button>

                  </div>

                </form>

              </div>

            </div>

        )}


        {/* =====================================================
          EMPLOYEE TABLE HEADER
      ===================================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Employee Directory
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View, update and manage your organization's employees.
            </p>

          </div>

          <span className="inline-flex w-fit items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
          {filteredEmployees.length} Employee
            {filteredEmployees.length !== 1 ? "s" : ""}
        </span>

        </div>


        {/* =====================================================
          EMPLOYEE TABLE
      ===================================================== */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px]">

              <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Code
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Employee
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Contact
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Department
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Designation
                </th>

                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Manager
                </th>

                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

              {filteredEmployees.map((employee) => (

                  <tr
                      key={employee.id}
                      className="hover:bg-slate-50 transition-colors"
                  >


                    {/* CODE */}

                    <td className="px-6 py-5">

                    <span className="inline-flex bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide">
                      {employee.employeeCode}
                    </span>

                    </td>


                    {/* NAME */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                          {employee.firstName
                              ?.charAt(0)
                              .toUpperCase()}

                        </div>

                        <div>

                          <p className="font-semibold text-gray-900 whitespace-nowrap">

                            {employee.firstName}{" "}
                            {employee.lastName}

                          </p>

                          <p className="text-xs text-gray-400 mt-0.5">
                            Employee
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {employee.email}
                    </td>


                    {/* DEPARTMENT */}

                    <td className="px-6 py-5">

                    <span className="inline-flex bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                      {employee.department}
                    </span>

                    </td>


                    {/* DESIGNATION */}

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {employee.designation}
                    </td>


                    {/* MANAGER */}

                    <td className="px-6 py-5">

                      <select
                          value={employee.managerId || ""}
                          onChange={(e) =>
                              handleAssignManager(
                                  employee.id,
                                  e.target.value
                              )
                          }
                          className="min-w-[160px] border border-gray-200 bg-white px-3 py-2 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition"
                      >

                        <option value="">
                          {employee.managerName || "Assign Manager"}
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

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                            onClick={() => handleEdit(employee)}
                            className="px-3.5 py-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition text-sm font-semibold"
                        >
                          Edit
                        </button>


                        <button
                            onClick={() => handleDelete(employee.id)}
                            className="px-3.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm font-semibold"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

              ))}

              </tbody>

            </table>

          </div>


          {/* =====================================================
            EMPTY STATE
        ===================================================== */}

          {filteredEmployees.length === 0 && (

              <div className="py-16 text-center">

                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">
                  👥
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No employees found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search or add a new employee.
                </p>

              </div>

          )}

        </div>

      </div>
  );
};

export default EmployeeManagement;