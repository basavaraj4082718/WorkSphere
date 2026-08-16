import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
          "http://localhost:8080/auth/register",
          formData
      );

      alert(response.data);

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
          error.response?.data?.message ||
          error.response?.data ||
          "Registration failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

      <div className="min-h-screen flex justify-center items-center bg-slate-100">

        <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">


          {/* =========================
            TITLE
        ========================= */}

          <h1 className="text-3xl font-bold text-center mb-2">
            Create Account
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Register as an employee
          </p>


          {/* =========================
            FORM
        ========================= */}

          <form
              onSubmit={handleSubmit}
              className="space-y-4"
          >


            {/* NAME */}

            <input
                type="text"
                name="name"
                placeholder="Enter Name"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={handleChange}
                required
            />


            {/* EMAIL */}

            <input
                type="email"
                name="email"
                placeholder="Enter Email"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
            />


            {/* PASSWORD */}

            <input
                type="password"
                name="password"
                placeholder="Create Password"
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
            />


            {/* INFO */}

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">

              <p className="text-sm text-blue-700">
                New accounts are registered as employees.
                Managers and administrators are created by an Admin.
              </p>

            </div>


            {/* REGISTER BUTTON */}

            <button
                type="submit"
                disabled={loading}
                className={`w-full text-white p-3 rounded-lg font-medium transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >

              {loading
                  ? "Creating Account..."
                  : "Register"}

            </button>

          </form>


          {/* =========================
            LOGIN
        ========================= */}

          <p className="text-center mt-5 text-gray-600">

            Already have an account?{" "}

            <Link
                to="/login"
                className="text-blue-600 hover:underline font-medium"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

  );
}

export default Register;