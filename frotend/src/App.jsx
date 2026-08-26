import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// =========================================
// AUTH
// =========================================

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// =========================================
// ADMIN
// =========================================

import AdminDashboard from "./pages/admin/AdminDashboard";
import EmployeeManagement from "./pages/admin/EmployeeManagement";
import ManagerManagement from "./pages/admin/ManagerManagement";
import TaskManagement from "./pages/admin/TaskManagement";

// =========================================
// MANAGER
// =========================================

import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerTeam from "./pages/manager/ManagerTeam";
import ManagerTaskManagement from "./pages/manager/ManagerTaskManagement";
import ManagerAttendance from "./pages/manager/ManagerAttendance";
import ManagerLeaveRequests from "./pages/manager/ManagerLeaveRequests";
import ManagerReviews from "./pages/manager/ManagerReviews";

// =========================================
// EMPLOYEE
// =========================================

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeTasks from "./pages/employee/EmployeeTasks";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import EmployeePerformance from "./pages/employee/EmployeePerformance";
import EmployeeReviews from "./pages/employee/EmployeeReviews";
import EmployeeLeaveRequests from "./pages/employee/EmployeeLeaveRequests";

// =========================================
// LAYOUTS
// =========================================

import AdminLayout from "./layouts/AdminLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =================================
                    DEFAULT
                ================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* =================================
                    AUTH
                ================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =================================
                    ADMIN ROUTES
                ================================= */}

                <Route element={<AdminLayout />}>

                    {/* Admin */}

                    <Route
                        path="/admin"
                        element={
                            <Navigate
                                to="/admin/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Dashboard */}

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />


                    {/* Employees */}

                    <Route
                        path="/admin/employees"
                        element={<EmployeeManagement />}
                    />


                    {/* Managers */}

                    <Route
                        path="/admin/managers"
                        element={<ManagerManagement />}
                    />


                    {/* Tasks */}

                    <Route
                        path="/admin/tasks"
                        element={<TaskManagement />}
                    />

                </Route>


                {/* =================================
                    MANAGER ROUTES
                ================================= */}

                <Route element={<ManagerLayout />}>

                    {/* Manager */}

                    <Route
                        path="/manager"
                        element={
                            <Navigate
                                to="/manager/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Dashboard */}

                    <Route
                        path="/manager/dashboard"
                        element={<ManagerDashboard />}
                    />


                    {/* My Team */}

                    <Route
                        path="/manager/team"
                        element={<ManagerTeam />}
                    />


                    {/* Tasks */}

                    <Route
                        path="/manager/tasks"
                        element={<ManagerTaskManagement />}
                    />


                    {/* Attendance */}

                    <Route
                        path="/manager/attendance"
                        element={<ManagerAttendance />}
                    />


                    {/* Leave Requests */}

                    <Route
                        path="/manager/leaves"
                        element={<ManagerLeaveRequests />}
                    />


                    {/* Reviews */}

                    <Route
                        path="/manager/reviews"
                        element={<ManagerReviews />}
                    />

                </Route>


                {/* =================================
                    EMPLOYEE ROUTES
                ================================= */}

                <Route element={<EmployeeLayout />}>

                    {/* Employee */}

                    <Route
                        path="/employee"
                        element={
                            <Navigate
                                to="/employee/dashboard"
                                replace
                            />
                        }
                    />


                    {/* Employee Dashboard */}

                    <Route
                        path="/employee/dashboard"
                        element={<EmployeeDashboard />}
                    />


                    {/* Employee Tasks */}

                    <Route
                        path="/employee/tasks"
                        element={<EmployeeTasks />}
                    />


                    {/* Employee Attendance */}

                    <Route
                        path="/employee/attendance"
                        element={<EmployeeAttendance />}
                    />


                    {/* Employee Performance */}

                    <Route
                        path="/employee/performance"
                        element={<EmployeePerformance />}
                    />


                    {/* Employee Reviews */}

                    <Route
                        path="/employee/reviews"
                        element={<EmployeeReviews />}
                    />


                    {/* Employee Leave Requests */}

                    <Route
                        path="/employee/leaves"
                        element={<EmployeeLeaveRequests />}
                    />

                </Route>


                {/* =================================
                    FALLBACK
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;