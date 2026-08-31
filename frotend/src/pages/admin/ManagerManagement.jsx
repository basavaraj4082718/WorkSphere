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

      } else {

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <span className="w-2 h-2 rounded-full bg-blue-600"></span>

              <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase">
                Administration
              </p>

            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Manager Management
            </h1>

            <p className="text-gray-500 mt-2">
              Create, organize and manage managers across your organization.
            </p>

          </div>


          <button
              onClick={handleAddManager}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all font-medium shadow-sm"
          >
            <span className="text-lg leading-none">+</span>
            Add Manager
          </button>

        </div>


        {/* ======================================
          SEARCH
      ====================================== */}

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

          <div className="relative">

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

            <input
                type="text"
                placeholder="Search by name, manager code, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50 p-3 pl-11 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />

          </div>

        </div>


        {/* ======================================
          MANAGER COUNT
      ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              All Managers
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              View and manage all registered managers.
            </p>

          </div>


          <span className="inline-flex items-center w-fit bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-sm font-semibold">
          {filteredManagers.length} Manager{filteredManagers.length !== 1 ? "s" : ""}
        </span>

        </div>


        {/* ======================================
          MANAGER TABLE
      ====================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="bg-gray-50 border-b border-gray-200">

              <tr>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Code
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Manager
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Department
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>

              </thead>


              <tbody className="divide-y divide-gray-100">

              {filteredManagers.map((manager) => (

                  <tr
                      key={manager.id}
                      className="hover:bg-blue-50/30 transition-colors"
                  >


                    {/* CODE */}

                    <td className="px-6 py-4">

                    <span className="inline-flex bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide">
                      {manager.managerCode}
                    </span>

                    </td>


                    {/* NAME */}

                    <td className="px-6 py-4">

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

                          <p className="text-xs text-gray-500 mt-0.5">
                            Manager
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* EMAIL */}

                    <td className="px-6 py-4">

                      <p className="text-sm text-gray-600">
                        {manager.email}
                      </p>

                    </td>


                    {/* DEPARTMENT */}

                    <td className="px-6 py-4">

                    <span className="inline-flex bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-medium">
                      {manager.department}
                    </span>

                    </td>


                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2">

                        <button
                            onClick={() => handleEdit(manager)}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>


                        <button
                            onClick={() => handleDelete(manager.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
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


          {/* NO RESULTS */}

          {filteredManagers.length === 0 && (

              <div className="py-16 text-center">

                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
                  👥
                </div>

                <h3 className="font-semibold text-gray-900">
                  No managers found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or create a new manager.
                </p>

              </div>

          )}

        </div>


        {/* ======================================
          CREATE / EDIT MANAGER MODAL
      ====================================== */}

        {showForm && (

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">


              {/* BACKDROP */}

              <div
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                  onClick={resetForm}
              ></div>


              {/* MODAL */}

              <div className="relative z-10 w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">


                {/* MODAL HEADER */}

                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50 flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">

                      {editingManager ? "✏️" : "👨‍💼"}

                    </div>


                    <div>

                      <h2 className="text-xl font-bold text-gray-900">

                        {editingManager
                            ? "Edit Manager"
                            : "Create New Manager"}

                      </h2>

                      <p className="text-sm text-gray-500 mt-1">

                        {editingManager
                            ? "Update the manager information below."
                            : "Add manager details and create their login account."}

                      </p>

                    </div>

                  </div>


                  {/* CLOSE */}

                  <button
                      type="button"
                      onClick={resetForm}
                      className="w-9 h-9 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-700 transition flex items-center justify-center text-2xl"
                  >
                    ×
                  </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    {/* MANAGER CODE */}

                    <div>

                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Manager Code
                      </label>

                      <input
                          name="managerCode"
                          placeholder="Example: MGR001"
                          value={formData.managerCode}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
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
                          placeholder="manager@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                          required
                      />

                    </div>


                    {/* PASSWORD */}

                    {!editingManager && (

                        <div>

                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Login Password
                          </label>

                          <input
                              type="password"
                              name="password"
                              placeholder="Create a secure password"
                              value={formData.password}
                              onChange={handleChange}
                              className="w-full border border-gray-200 bg-gray-50 px-4 py-3 rounded-xl outline-none transition focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                              required
                          />

                          <p className="text-xs text-gray-400 mt-2">
                            The manager will use this password to access their account.
                          </p>

                        </div>

                    )}

                  </div>


                  {/* BUTTONS */}

                  <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-100">

                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition font-medium"
                    >
                      Cancel
                    </button>


                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition font-medium shadow-sm"
                    >

                      {editingManager
                          ? "Save Changes"
                          : "Create Manager"}

                    </button>

                  </div>

                </form>

              </div>

            </div>

        )}

      </div>
  );
};

export default ManagerManagement;