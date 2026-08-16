import { useEffect, useState } from "react";
import axios from "axios";

const ManagerManagement = () => {

  const [managers, setManagers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingManager, setEditingManager] = useState(null);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    managerCode: "",
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    password: "",
  });


  // ==========================================
  // FETCH MANAGERS
  // ==========================================

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


  useEffect(() => {
    fetchManagers();
  }, []);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {

    setFormData({
      managerCode: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      password: "",
    });

    setEditingManager(null);
    setShowForm(false);
  };


  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const handleAddManager = () => {

    setEditingManager(null);

    setFormData({
      managerCode: "",
      firstName: "",
      lastName: "",
      email: "",
      department: "",
      password: "",
    });

    setShowForm(true);
  };


  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem("token");

      // ======================================
      // EDIT MANAGER
      // ======================================

      if (editingManager) {

        const updateData = {
          managerCode: formData.managerCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          department: formData.department,
        };

        await axios.put(
            `http://localhost:8080/api/managers/${editingManager.id}`,
            updateData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        alert("Manager updated successfully");

      }

          // ======================================
          // CREATE MANAGER
      // ======================================

      else {

        await axios.post(
            "http://localhost:8080/api/managers",
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );

        alert(
            "Manager created successfully.\n\n" +
            "The manager can now login using the email and password provided."
        );
      }


      resetForm();

      fetchManagers();

    } catch (error) {

      console.log(error);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Operation failed"
      );
    }
  };


  // ==========================================
  // EDIT MANAGER
  // ==========================================

  const handleEdit = (manager) => {

    setEditingManager(manager);

    setFormData({
      managerCode: manager.managerCode || "",
      firstName: manager.firstName || "",
      lastName: manager.lastName || "",
      email: manager.email || "",
      department: manager.department || "",
      password: "",
    });

    setShowForm(true);
  };


  // ==========================================
  // DELETE MANAGER
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this manager?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const token = localStorage.getItem("token");

      await axios.delete(
          `http://localhost:8080/api/managers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      alert("Manager deleted successfully");

      fetchManagers();

    } catch (error) {

      console.log(error);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete manager"
      );
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredManagers = managers.filter((manager) => {

    const searchValue = search.toLowerCase();

    return (

        manager.firstName
            ?.toLowerCase()
            .includes(searchValue) ||

        manager.lastName
            ?.toLowerCase()
            .includes(searchValue) ||

        manager.managerCode
            ?.toLowerCase()
            .includes(searchValue) ||

        manager.email
            ?.toLowerCase()
            .includes(searchValue) ||

        manager.department
            ?.toLowerCase()
            .includes(searchValue)

    );
  });


  return (

      <div className="space-y-6">


        {/* ======================================
          HEADER
      ====================================== */}

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>

            <p className="text-blue-600 font-medium">
              Administration
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Manager Management
            </h1>

            <p className="text-gray-500 mt-1">
              Create and manage managers in your organization.
            </p>

          </div>


          <button
              onClick={handleAddManager}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + Add Manager
          </button>

        </div>


        {/* ======================================
          SEARCH
      ====================================== */}

        <div className="bg-white p-4 rounded-xl shadow-sm border">

          <div className="relative">

            <input
                type="text"
                placeholder="Search by name, code, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 p-3 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>


        {/* ======================================
          FORM
      ====================================== */}

        {showForm && (

            <div className="bg-white p-6 rounded-xl shadow-sm border">

              <div className="flex justify-between items-center mb-6">

                <div>

                  <h2 className="text-xl font-semibold text-gray-900">

                    {editingManager
                        ? "Edit Manager"
                        : "Add New Manager"}

                  </h2>

                  <p className="text-sm text-gray-500 mt-1">

                    {editingManager
                        ? "Update manager information."
                        : "Create a manager profile and login account."}

                  </p>

                </div>

              </div>


              <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >


                {/* MANAGER CODE */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager Code
                  </label>

                  <input
                      name="managerCode"
                      placeholder="Example: MGR001"
                      value={formData.managerCode}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* FIRST NAME */}

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


                {/* LAST NAME */}

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


                {/* EMAIL */}

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>

                  <input
                      type="email"
                      name="email"
                      placeholder="manager@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                  />

                </div>


                {/* DEPARTMENT */}

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


                {/* PASSWORD */}

                {!editingManager && (

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
                        The manager will use this password to login.
                      </p>

                    </div>

                )}


                {/* BUTTONS */}

                <div className="md:col-span-2 flex gap-3 pt-2">

                  <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
                  >

                    {editingManager
                        ? "Update Manager"
                        : "Create Manager"}

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


        {/* ======================================
          MANAGER COUNT
      ====================================== */}

        <div className="flex items-center justify-between">

          <h2 className="text-xl font-semibold text-gray-900">
            Managers
          </h2>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          {filteredManagers.length} Managers
        </span>

        </div>


        {/* ======================================
          MANAGER TABLE
      ====================================== */}

        <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead className="bg-gray-50">

            <tr>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Code
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Manager
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Email
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Department
              </th>

              <th className="text-left p-4 text-sm font-semibold text-gray-600">
                Actions
              </th>

            </tr>

            </thead>


            <tbody>

            {filteredManagers.map((manager) => (

                <tr
                    key={manager.id}
                    className="border-t hover:bg-gray-50 transition"
                >


                  {/* CODE */}

                  <td className="p-4">

                  <span className="bg-gray-100 px-3 py-1 rounded-md text-sm font-medium">
                    {manager.managerCode}
                  </span>

                  </td>


                  {/* NAME */}

                  <td className="p-4">

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                        {manager.firstName
                            ?.charAt(0)
                            .toUpperCase()}

                      </div>

                      <div>

                        <p className="font-semibold text-gray-900">

                          {manager.firstName}{" "}
                          {manager.lastName}

                        </p>

                        <p className="text-xs text-gray-500">
                          Manager
                        </p>

                      </div>

                    </div>

                  </td>


                  {/* EMAIL */}

                  <td className="p-4 text-gray-600">
                    {manager.email}
                  </td>


                  {/* DEPARTMENT */}

                  <td className="p-4">

                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {manager.department}
                  </span>

                  </td>


                  {/* ACTIONS */}

                  <td className="p-4">

                    <div className="flex gap-2">

                      <button
                          onClick={() =>
                              handleEdit(manager)
                          }
                          className="bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 transition text-sm"
                      >
                        Edit
                      </button>


                      <button
                          onClick={() =>
                              handleDelete(manager.id)
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

          {filteredManagers.length === 0 && (

              <div className="py-12 text-center">

                <div className="text-4xl mb-3">
                  👥
                </div>

                <p className="text-gray-500">
                  No managers found.
                </p>

              </div>

          )}

        </div>

      </div>
  );
};

export default ManagerManagement;