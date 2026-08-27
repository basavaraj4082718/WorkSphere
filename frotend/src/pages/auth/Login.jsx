import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
          "http://localhost:8080/auth/login",
          formData
      );

      // =========================
      // STORE LOGIN INFORMATION
      // =========================

      localStorage.setItem(
          "token",
          response.data.token
      );

      localStorage.setItem(
          "role",
          response.data.role
      );

      // Store email so Manager/Employee
      // dashboards can identify the user
      localStorage.setItem(
          "email",
          formData.email
      );

      alert("Login Successful");

      // =========================
      // REDIRECT BASED ON ROLE
      // =========================

      if (response.data.role === "ADMIN") {
        navigate("/admin");

      } else if (response.data.role === "MANAGER") {
        navigate("/manager");

      } else if (response.data.role === "EMPLOYEE") {
        navigate("/employee");

      } else {
        alert("Unknown user role");
      }

    } catch (error) {

      console.log("LOGIN ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);
      console.log("MESSAGE:", error.message);

      alert(
          `Login failed\n\nStatus: ${
              error.response?.status || "No response"
          }\n\nError: ${
              typeof error.response?.data === "string"
                  ? error.response.data
                  : JSON.stringify(error.response?.data)
          }`
      );

    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">

          {/* =========================
            WORKSPHERE BRANDING
        ========================= */}

          <div className="text-center mb-6">

            <h1 className="text-3xl font-bold text-slate-900">
              WorkSphere
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Intelligent Workforce Management
            </p>

            <h2 className="text-xl font-semibold mt-5">
              Welcome Back
            </h2>

          </div>


          {/* =========================
            LOGIN FORM
        ========================= */}

          <form
              onSubmit={handleSubmit}
              className="space-y-4"
          >

            {/* EMAIL */}

            <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="w-full border p-3 rounded"
                value={formData.email}
                onChange={handleChange}
                required
            />


            {/* PASSWORD */}

            <input
                type="password"
                name="password"
                placeholder="Enter Password"
                className="w-full border p-3 rounded"
                value={formData.password}
                onChange={handleChange}
                required
            />


            {/* LOGIN BUTTON */}

            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white p-3 rounded transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>


          {/* =========================
            REGISTER LINK
        ========================= */}

          <p className="text-center mt-4">

            Don't have an account?{" "}

            <Link
                to="/register"
                className="text-blue-600 hover:underline"
            >
              Register
            </Link>

          </p>

        </div>

      </div>
  );
}

export default Login;