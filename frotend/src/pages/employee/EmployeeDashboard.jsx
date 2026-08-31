import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeDashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


  // =========================================
  // FETCH DASHBOARD
  // =========================================

  useEffect(() => {

    let cancelled = false;

    const fetchDashboard = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
              "No authentication token found"
          );
        }


        const response = await axios.get(
            "http://localhost:8080/api/dashboard/employee/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
        );


        console.log(
            "Employee dashboard:",
            response.data
        );


        if (!cancelled) {
          setDashboard(response.data);
        }

      } catch (error) {

        console.error(
            "EMPLOYEE DASHBOARD ERROR:",
            error
        );

        if (!cancelled) {

          alert(
              error.response?.data?.message ||
              error.response?.data ||
              error.message ||
              "Failed to load employee dashboard"
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    };


    void fetchDashboard();


    return () => {
      cancelled = true;
    };

  }, []);


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

        <div className="flex justify-center items-center min-h-[60vh]">

          <div className="text-center">

            <div className="w-12 h-12 mx-auto border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />

            <p className="text-slate-500 mt-4 font-medium">
              Loading your dashboard...
            </p>

          </div>

        </div>

    );

  }


  // =========================================
  // NO DATA
  // =========================================

  if (!dashboard) {

    return (

        <div className="flex justify-center items-center min-h-[60vh]">

          <div className="text-center bg-white border border-slate-200 rounded-2xl p-10 shadow-sm">

            <div className="text-5xl mb-4">
              ⚠️
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Dashboard unavailable
            </h2>

            <p className="text-slate-500 mt-2">
              We couldn't load your dashboard data.
            </p>

          </div>

        </div>

    );

  }


  // =========================================
  // CALCULATIONS
  // =========================================

  const taskCompletion =
      dashboard.assignedTasks > 0
          ? (
              (dashboard.completedTasks /
                  dashboard.assignedTasks) *
              100
          ).toFixed(1)
          : 0;


  const attendanceScore =
      Number(dashboard.attendanceScore || 0);

  const reviewScore =
      Number(dashboard.reviewScore || 0);

  const performanceScore =
      Number(dashboard.performanceScore || 0);


  const remainingTasks =
      Math.max(
          dashboard.assignedTasks -
          dashboard.completedTasks,
          0
      );


  // =========================================
  // PERFORMANCE STATUS
  // =========================================

  const getPerformanceMessage = () => {

    if (performanceScore >= 80) {
      return "Excellent work! You're performing exceptionally well.";
    }

    if (performanceScore >= 60) {
      return "Great progress! Keep up the momentum.";
    }

    if (performanceScore >= 40) {
      return "You're making progress. Keep pushing forward!";
    }

    return "Every step counts. Focus on consistent improvement.";
  };


  return (

      <div className="space-y-7">


        {/* =====================================
                HEADER
            ===================================== */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              <p className="text-indigo-600 font-semibold text-sm">
                EMPLOYEE WORKSPACE
              </p>

            </div>


            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">

              Welcome back, {dashboard.employeeName} 👋

            </h1>


            <p className="text-slate-500 mt-3">

              Here's a quick overview of your work,
              progress and performance.

            </p>

          </div>


          {/* DATE */}

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">

            <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">
              Today
            </p>

            <p className="text-sm font-semibold text-slate-700 mt-1">

              {new Date().toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  }
              )}

            </p>

          </div>

        </div>


        {/* =====================================
                STAT CARDS
            ===================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">


          {/* ASSIGNED TASKS */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Assigned Tasks
                </p>

                <p className="text-4xl font-bold text-slate-900 mt-3">
                  {dashboard.assignedTasks}
                </p>

              </div>


              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                📋
              </div>

            </div>


            <div className="mt-5 pt-4 border-t border-slate-100">

              <p className="text-sm text-slate-400">
                Total tasks assigned to you
              </p>

            </div>

          </div>


          {/* COMPLETED TASKS */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Completed Tasks
                </p>

                <p className="text-4xl font-bold text-emerald-600 mt-3">
                  {dashboard.completedTasks}
                </p>

              </div>


              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                ✓
              </div>

            </div>


            <div className="mt-5 pt-4 border-t border-slate-100">

              <p className="text-sm text-slate-400">
                Successfully completed tasks
              </p>

            </div>

          </div>


          {/* ATTENDANCE */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Attendance
                </p>

                <p className="text-4xl font-bold text-indigo-600 mt-3">
                  {attendanceScore.toFixed(1)}%
                </p>

              </div>


              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                🕐
              </div>

            </div>


            <div className="mt-5 pt-4 border-t border-slate-100">

              <p className="text-sm text-slate-400">
                Your attendance score
              </p>

            </div>

          </div>


          {/* PERFORMANCE */}

          <div className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Performance
                </p>

                <p className="text-4xl font-bold text-violet-600 mt-3">
                  {performanceScore.toFixed(1)}
                </p>

              </div>


              <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                ⭐
              </div>

            </div>


            <div className="mt-5 pt-4 border-t border-slate-100">

              <p className="text-sm text-slate-400">
                Overall performance score
              </p>

            </div>

          </div>

        </div>


        {/* =====================================
                PERFORMANCE + TASK PROGRESS
            ===================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">


          {/* PERFORMANCE OVERVIEW */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-500">
                  Insights
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Performance Overview
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your current performance metrics
                </p>

              </div>


              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                📈
              </div>

            </div>


            {/* ATTENDANCE */}

            <div className="mt-8">

              <div className="flex justify-between items-center mb-3">

                <div>

                  <p className="font-medium text-slate-700">
                    Attendance
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Consistency at work
                  </p>

                </div>


                <span className="font-bold text-indigo-600">
                                {attendanceScore.toFixed(1)}%
                            </span>

              </div>


              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                          Math.max(attendanceScore, 0),
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>


            {/* REVIEW SCORE */}

            <div className="mt-7">

              <div className="flex justify-between items-center mb-3">

                <div>

                  <p className="font-medium text-slate-700">
                    Review Score
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Based on manager feedback
                  </p>

                </div>


                <span className="font-bold text-amber-500">
                                {reviewScore.toFixed(1)} / 5
                            </span>

              </div>


              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                          Math.max(
                              (reviewScore / 5) * 100,
                              0
                          ),
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>


            {/* OVERALL PERFORMANCE */}

            <div className="mt-7">

              <div className="flex justify-between items-center mb-3">

                <div>

                  <p className="font-medium text-slate-700">
                    Overall Performance
                  </p>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Combined performance score
                  </p>

                </div>


                <span className="font-bold text-violet-600">
                                {performanceScore.toFixed(1)}
                            </span>

              </div>


              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                <div
                    className="h-full bg-violet-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                          Math.max(performanceScore, 0),
                          100
                      )}%`,
                    }}
                />

              </div>

            </div>

          </div>


          {/* =====================================
                    TASK PROGRESS
                ===================================== */}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-7">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-500">
                  Productivity
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Task Progress
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Your current task completion status
                </p>

              </div>


              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                🎯
              </div>

            </div>


            {/* CIRCULAR PROGRESS */}

            <div className="flex justify-center py-8">

              <div
                  className="relative w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(
                                    #4f46e5 ${taskCompletion * 3.6}deg,
                                    #e2e8f0 0deg
                                )`,
                  }}
              >

                {/* INNER CIRCLE */}

                <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-inner">

                  <p className="text-4xl font-bold text-slate-900">
                    {taskCompletion}%
                  </p>

                  <p className="text-sm text-slate-500 mt-1">
                    Completed
                  </p>

                </div>

              </div>

            </div>


            {/* TASK COUNTS */}

            <div className="grid grid-cols-2 gap-4">


              {/* COMPLETED */}

              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">

                <p className="text-2xl font-bold text-emerald-600">
                  {dashboard.completedTasks}
                </p>

                <p className="text-xs font-medium text-emerald-700 mt-1">
                  Completed
                </p>

              </div>


              {/* REMAINING */}

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">

                <p className="text-2xl font-bold text-slate-700">
                  {remainingTasks}
                </p>

                <p className="text-xs font-medium text-slate-500 mt-1">
                  Remaining
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================
                PERFORMANCE HIGHLIGHT
            ===================================== */}

        <div className="
                relative
                overflow-hidden
                rounded-2xl
                bg-gradient-to-r
                from-indigo-600
                via-indigo-600
                to-violet-600
                p-7
                sm:p-8
                shadow-lg
                shadow-indigo-200
            ">


          {/* BACKGROUND DECORATION */}

          <div className="
                    absolute
                    -right-16
                    -top-16
                    w-56
                    h-56
                    rounded-full
                    bg-white/10
                " />

          <div className="
                    absolute
                    right-32
                    -bottom-24
                    w-48
                    h-48
                    rounded-full
                    bg-violet-400/20
                " />


          <div className="
                    relative
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-8
                ">


            {/* TEXT */}

            <div className="max-w-2xl">

              <p className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">
                Overall Performance
              </p>


              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
                Keep pushing forward! 🚀
              </h2>


              <p className="text-indigo-100 mt-3 leading-relaxed">
                {getPerformanceMessage()}
              </p>

            </div>


            {/* SCORE */}

            <div className="
                        shrink-0
                        w-32
                        h-32
                        rounded-full
                        border-[8px]
                        border-white/30
                        bg-white/10
                        backdrop-blur-sm
                        flex
                        flex-col
                        items-center
                        justify-center
                    ">

              <p className="text-3xl font-bold text-white">
                {performanceScore.toFixed(1)}
              </p>

              <p className="text-sm text-indigo-100">
                Score
              </p>

            </div>

          </div>

        </div>

      </div>

  );
};

export default EmployeeDashboard;