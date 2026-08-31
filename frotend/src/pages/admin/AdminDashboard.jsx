import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminDashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/dashboard/admin",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      setDashboard(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {

    fetchDashboard();

  }, []);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

        <div className="flex min-h-[600px] items-center justify-center">

          <div className="text-center">

            <div className="relative mx-auto h-14 w-14">

              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>

              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>

            </div>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">

              Loading WorkSphere

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Preparing your workspace...

            </p>

          </div>

        </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (!dashboard) {

    return (

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl">

              !

            </div>

            <div>

              <h3 className="font-semibold text-red-700">

                Unable to load dashboard

              </h3>

              <p className="mt-1 text-sm text-red-600">

                Please check your connection and try again.

              </p>

            </div>

          </div>

        </div>

    );

  }


  // =====================================================
  // CALCULATE COMPLETION RATE
  // =====================================================

  const completionRate =
      dashboard.totalTasks > 0
          ? Math.round(
              (dashboard.completedTasks /
                  dashboard.totalTasks) *
              100
          )
          : 0;


  // =====================================================
  // STATISTICS DATA
  // =====================================================

  const stats = [

    {
      title: "Total Employees",
      value: dashboard.totalEmployees,
      description: "Active workforce members",
      icon: "👥",
      iconBg: "bg-indigo-50",
      accent: "text-indigo-600",
      link: "/admin/employees",
      linkText: "Manage employees",
    },

    {
      title: "Total Managers",
      value: dashboard.totalManagers,
      description: "Team leaders and managers",
      icon: "◉",
      iconBg: "bg-violet-50",
      accent: "text-violet-600",
      link: "/admin/managers",
      linkText: "Manage managers",
    },

    {
      title: "Total Tasks",
      value: dashboard.totalTasks,
      description: "Across the organization",
      icon: "✓",
      iconBg: "bg-blue-50",
      accent: "text-blue-600",
      link: "/admin/tasks",
      linkText: "View tasks",
    },

    {
      title: "Completed Tasks",
      value: dashboard.completedTasks,
      description: "Successfully delivered",
      icon: "↗",
      iconBg: "bg-emerald-50",
      accent: "text-emerald-600",
      link: "/admin/tasks",
      linkText: "View completed",
    },

    {
      title: "Pending Tasks",
      value: dashboard.pendingTasks,
      description: "Require attention",
      icon: "◷",
      iconBg: "bg-amber-50",
      accent: "text-amber-600",
      link: "/admin/tasks",
      linkText: "Review tasks",
    },

    {
      title: "Avg. Performance",
      value: dashboard.averagePerformanceScore.toFixed(2),
      description: "Organization performance score",
      icon: "↗",
      iconBg: "bg-pink-50",
      accent: "text-pink-600",
      link: "/admin/reviews",
      linkText: "View reviews",
    },

  ];


  return (

      <div className="space-y-8">


        {/* =====================================================
                HERO SECTION
            ===================================================== */}

        <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 md:px-10 md:py-10">

          {/* Background Effects */}

          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>

          <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl"></div>


          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">


            {/* LEFT */}

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5">

                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>

                <span className="text-xs font-medium text-indigo-300">

                                Workspace Overview

                            </span>

              </div>


              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">

                Welcome to WorkSphere

              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">

                Monitor your workforce, track organizational progress,
                and manage everything from one intelligent workspace.

              </p>

            </div>


            {/* RIGHT */}

            <div className="flex flex-wrap gap-3">

              <button
                  onClick={fetchDashboard}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
              >

                            <span>

                                ↻

                            </span>

                Refresh Data

              </button>


              <Link
                  to="/admin/employees"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >

                Manage Team

                <span>

                                →

                            </span>

              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
                SECTION HEADER
            ===================================================== */}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-sm font-semibold text-indigo-600">

              Analytics Overview

            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">

              Organization at a glance

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Real-time overview of your workforce and productivity.

            </p>

          </div>

        </div>


        {/* =====================================================
                STATISTICS CARDS
            ===================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

          {stats.map((stat) => (

              <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60"
              >

                {/* Decorative */}

                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-125"></div>


                <div className="relative">


                  {/* Top */}

                  <div className="flex items-start justify-between">

                    <div>

                      <p className="text-sm font-medium text-slate-500">

                        {stat.title}

                      </p>


                      <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">

                        {stat.value}

                      </h3>

                    </div>


                    <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${stat.iconBg}`}
                    >

                      {stat.icon}

                    </div>

                  </div>


                  {/* Bottom */}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                    <p className="text-xs text-slate-400">

                      {stat.description}

                    </p>


                    <Link
                        to={stat.link}
                        className={`text-xs font-semibold ${stat.accent} transition hover:translate-x-1`}
                    >

                      {stat.linkText} →

                    </Link>

                  </div>

                </div>

              </div>

          ))}

        </section>


        {/* =====================================================
                INSIGHTS SECTION
            ===================================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">


          {/* =================================================
                    TASK COMPLETION
                ================================================= */}

          <div className="xl:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">


              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">

                    ✓

                  </div>


                  <div>

                    <h2 className="font-bold text-slate-900">

                      Task Completion

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                      Organization-wide progress

                    </p>

                  </div>

                </div>

              </div>


              <div className="text-left sm:text-right">

                <p className="text-3xl font-bold text-indigo-600">

                  {completionRate}%

                </p>

                <p className="text-xs text-slate-400">

                  Completion rate

                </p>

              </div>

            </div>


            {/* Progress */}

            <div className="mt-10">

              <div className="flex justify-between text-xs font-medium">

                            <span className="text-slate-500">

                                Overall Progress

                            </span>

                <span className="text-indigo-600">

                                {dashboard.completedTasks} / {dashboard.totalTasks}

                            </span>

              </div>


              <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-100">

                <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-1000"
                    style={{
                      width: `${completionRate}%`,
                    }}
                />

              </div>

            </div>


            {/* Metrics */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              <div className="rounded-2xl bg-emerald-50 p-5">

                <p className="text-xs font-medium text-emerald-600">

                  COMPLETED

                </p>

                <p className="mt-2 text-2xl font-bold text-emerald-700">

                  {dashboard.completedTasks}

                </p>

                <p className="mt-1 text-xs text-emerald-600/70">

                  Tasks successfully delivered

                </p>

              </div>


              <div className="rounded-2xl bg-amber-50 p-5">

                <p className="text-xs font-medium text-amber-600">

                  PENDING

                </p>

                <p className="mt-2 text-2xl font-bold text-amber-700">

                  {dashboard.pendingTasks}

                </p>

                <p className="mt-1 text-xs text-amber-600/70">

                  Tasks requiring attention

                </p>

              </div>

            </div>

          </div>


          {/* =================================================
                    TOP PERFORMER
                ================================================= */}

          <div className="xl:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200 md:p-8">

            {/* Background */}

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>

            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5"></div>


            <div className="relative z-10">


              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs font-semibold uppercase tracking-widest text-indigo-200">

                    Recognition

                  </p>

                  <h2 className="mt-2 text-xl font-bold">

                    Top Performer

                  </h2>

                </div>


                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">

                  ★

                </div>

              </div>


              <div className="mt-10">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">

                  👤

                </div>


                <h3 className="mt-5 text-2xl font-bold">

                  {dashboard.topPerformer}

                </h3>


                <p className="mt-2 text-sm text-indigo-100">

                  Highest performance score across the organization.

                </p>

              </div>


              <div className="mt-10 border-t border-white/10 pt-5">

                <p className="text-xs text-indigo-200">

                  WorkSphere Insight

                </p>

                <p className="mt-1 text-sm font-medium">

                  Consistent performance drives team success.

                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
                QUICK ACTIONS
            ===================================================== */}

        <section>

          <div className="mb-5">

            <p className="text-sm font-semibold text-indigo-600">

              Workspace

            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">

              Quick Actions

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Jump directly to the tools you use most.

            </p>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">


            {/* Employees */}

            <Link
                to="/admin/employees"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">

                  👥

                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">

                                →

                            </span>

              </div>


              <h3 className="mt-6 text-lg font-bold text-slate-900">

                Manage Employees

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                Add, update, manage and organize your workforce.

              </p>


              <div className="mt-6 text-sm font-semibold text-indigo-600">

                Open workspace →

              </div>

            </Link>


            {/* Managers */}

            <Link
                to="/admin/managers"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">

                  ◉

                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500">

                                →

                            </span>

              </div>


              <h3 className="mt-6 text-lg font-bold text-slate-900">

                Manage Managers

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                Organize leadership and manage team responsibilities.

              </p>


              <div className="mt-6 text-sm font-semibold text-violet-600">

                Open workspace →

              </div>

            </Link>


            {/* Tasks */}

            <Link
                to="/admin/tasks"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">

                  ✓

                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">

                                →

                            </span>

              </div>


              <h3 className="mt-6 text-lg font-bold text-slate-900">

                Task Management

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                Monitor assignments, progress and team productivity.

              </p>


              <div className="mt-6 text-sm font-semibold text-blue-600">

                Open workspace →

              </div>

            </Link>

          </div>

        </section>


        {/* =====================================================
                WORKSPHERE AI PREVIEW
            ===================================================== */}

        <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-6 md:p-8">

          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl"></div>


          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">


            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-200">

                ✦

              </div>


              <div>

                <p className="text-sm font-semibold text-indigo-600">

                  FUTURE OF WORKSPHERE

                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">

                  AI-powered workforce intelligence

                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                  Soon, WorkSphere will help analyze employee skills,
                  workload and performance to provide smarter task
                  recommendations and workforce insights.

                </p>

              </div>

            </div>


            <div className="shrink-0">

                        <span className="inline-flex rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm">

                            Coming Soon

                        </span>

            </div>

          </div>

        </section>

      </div>

  );

};

export default AdminDashboard;