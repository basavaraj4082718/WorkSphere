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


  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  // =========================================
  // LOGIN
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const response = await axios.post(
          "http://localhost:8080/auth/login",
          formData
      );


      // =========================================
      // STORE LOGIN INFORMATION
      // =========================================

      localStorage.setItem(
          "token",
          response.data.token
      );

      localStorage.setItem(
          "role",
          response.data.role
      );

      localStorage.setItem(
          "email",
          formData.email
      );


      alert("Login Successful");


      // =========================================
      // REDIRECT BASED ON ROLE
      // =========================================

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


  // =========================================
  // PAGE
  // =========================================

  return (

      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">


        {/* =====================================
                LEFT BRANDING SECTION
            ===================================== */}

        <div className="hidden lg:flex bg-slate-950 text-white relative overflow-hidden flex-col justify-between p-16">


          {/* SUBTLE GRID BACKGROUND */}

          <div className="absolute inset-0 opacity-[0.04]">

            <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                      "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
            />

          </div>


          {/* SUBTLE BLUE GLOW */}

          <div className="absolute top-1/4 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>


          {/* =====================================
                    BRAND LOGO
                ===================================== */}

          <div className="relative flex items-center gap-3">

            <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/40">
              W
            </div>

            <span className="text-2xl font-semibold tracking-tight">
                        WorkSphere
                    </span>

          </div>


          {/* =====================================
                    HERO CONTENT
                ===================================== */}

          <div className="relative max-w-lg">

            <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] mb-6">
              WORKFORCE MANAGEMENT PLATFORM
            </p>


            <h1 className="text-5xl font-bold leading-tight tracking-tight">

              Your workforce.

              <br />

              <span className="text-slate-400">
                            One workspace.
                        </span>

            </h1>


            <p className="text-slate-400 text-lg leading-relaxed mt-7 max-w-md">

              Manage employees, tasks, attendance, performance,
              leave requests and workplace operations from one
              centralized platform.

            </p>


            {/* FEATURES */}

            <div className="mt-10 space-y-4">


              <div className="flex items-center gap-3 text-slate-300">

                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                <span>
                                Centralized employee management
                            </span>

              </div>


              <div className="flex items-center gap-3 text-slate-300">

                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                <span>
                                Real-time attendance tracking
                            </span>

              </div>


              <div className="flex items-center gap-3 text-slate-300">

                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>

                <span>
                                Performance and productivity insights
                            </span>

              </div>

            </div>

          </div>


          {/* =====================================
                    FOOTER
                ===================================== */}

          <div className="relative text-sm text-slate-500">

            © 2026 WorkSphere

          </div>

        </div>



        {/* =====================================
                RIGHT LOGIN SECTION
            ===================================== */}

        <div className="bg-slate-50 flex items-center justify-center px-6 sm:px-12 lg:px-20">


          <div className="w-full max-w-md">


            {/* =====================================
                        MOBILE BRAND
                    ===================================== */}

            <div className="lg:hidden flex items-center gap-3 mb-12">

              <div className="w-11 h-11 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                W
              </div>

              <span className="text-2xl font-semibold text-slate-900">
                            WorkSphere
                        </span>

            </div>


            {/* =====================================
                        LOGIN HEADER
                    ===================================== */}

            <div className="mb-10">

              <p className="text-blue-600 font-semibold text-sm tracking-wide mb-3">
                WELCOME BACK
              </p>

              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Sign in to your account
              </h1>

              <p className="text-slate-500 mt-3 text-base">
                Enter your credentials to access your workspace.
              </p>

            </div>


            {/* =====================================
                        LOGIN FORM
                    ===================================== */}

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >


              {/* EMAIL */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Email address

                </label>


                <input
                    type="email"
                    name="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />

              </div>


              {/* PASSWORD */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-2">

                  Password

                </label>


                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3.5 text-slate-900 placeholder:text-slate-400 outline-none transition duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                />

              </div>


              {/* LOGIN BUTTON */}

              <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all duration-200 ${
                      loading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                  }`}
              >

                {loading
                    ? "Signing in..."
                    : "Sign in"
                }

              </button>

            </form>


            {/* =====================================
                        REGISTER
                    ===================================== */}

            <div className="mt-10 pt-6 border-t border-slate-200">

              <p className="text-center text-sm text-slate-600">

                Don't have an account?{" "}

                <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                >

                  Create an account

                </Link>

              </p>

            </div>


            {/* MOBILE FOOTER */}

            <p className="lg:hidden text-center text-xs text-slate-400 mt-10">

              © 2026 WorkSphere

            </p>

          </div>

        </div>

      </div>
  );
}

export default Login;