import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManagerDashboard = () => {

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboard = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
          "http://localhost:8080/api/dashboard/manager/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      console.log("Manager Dashboard:", response.data);

      setDashboard(response.data);

    } catch (error) {

      console.error("Dashboard error:", error);

      setError(
          error.response?.data?.message ||
          "Failed to load manager dashboard"
      );

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

              Loading your workspace

            </h3>

            <p className="mt-2 text-sm text-slate-500">

              Preparing your team insights...

            </p>

          </div>

        </div>

    );

  }


  // =====================================================
  // ERROR
  // =====================================================

  if (error) {

    return (

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl text-red-600">

                !

              </div>

              <div>

                <h2 className="font-semibold text-red-700">

                  Unable to load dashboard

                </h2>

                <p className="mt-1 text-sm text-red-600">

                  {error}

                </p>

              </div>

            </div>


            <button
                onClick={fetchDashboard}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >

              Try Again

            </button>

          </div>

        </div>

    );

  }


  if (!dashboard) {
    return null;
  }


  // =====================================================
  // PERFORMANCE SCORE
  // =====================================================

  const performanceScore = Number(
      dashboard.averageTeamPerformance
  ).toFixed(1);


  // =====================================================
  // STATS
  // =====================================================

  const stats = [

    {
      title: "Team Size",
      value: dashboard.teamSize,
      description: "Employees in your team",
      icon: "👥",
      iconBg: "bg-indigo-50",
      accent: "text-indigo-600",
      link: "/manager/team",
      linkText: "View team",
    },

    {
      title: "Tasks Assigned",
      value: dashboard.tasksAssigned,
      description: "Tasks across your team",
      icon: "📋",
      iconBg: "bg-violet-50",
      accent: "text-violet-600",
      link: "/manager/tasks",
      linkText: "Manage tasks",
    },

    {
      title: "Completed Tasks",
      value: dashboard.completedTasks,
      description: "Successfully delivered",
      icon: "✓",
      iconBg: "bg-emerald-50",
      accent: "text-emerald-600",
      link: "/manager/tasks",
      linkText: "View progress",
    },

    {
      title: "Team Performance",
      value: performanceScore,
      description: "Average performance score",
      icon: "↗",
      iconBg: "bg-blue-50",
      accent: "text-blue-600",
      link: "/manager/reviews",
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

                  Team Workspace

                </span>

              </div>


              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">

                Welcome back, {dashboard.managerName}

              </h1>


              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 md:text-base">

                Monitor your team, track task progress, and make
                better decisions with a complete view of your
                team's performance.

              </p>

            </div>


            {/* RIGHT */}

            <div className="flex flex-wrap gap-3">

              <button
                  onClick={fetchDashboard}
                  className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
              >

                <span>↻</span>

                Refresh Data

              </button>


              <Link
                  to="/manager/tasks"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >

                Manage Tasks

                <span>→</span>

              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <div>

          <p className="text-sm font-semibold text-indigo-600">

            Team Overview

          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">

            Your team at a glance

          </h2>

          <p className="mt-1 text-sm text-slate-500">

            Real-time insights into your team's productivity and performance.

          </p>

        </div>


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {stats.map((stat) => (

              <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/60"
              >

                {/* Decorative */}

                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-slate-50 transition group-hover:scale-125"></div>


                <div className="relative">

                  {/* TOP */}

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


                  {/* BOTTOM */}

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
            PERFORMANCE + TOP PERFORMER
        ===================================================== */}

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">


          {/* =================================================
              TEAM PERFORMANCE
          ================================================= */}

          <div className="xl:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">


            {/* HEADER */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">

                  ↗

                </div>


                <div>

                  <h2 className="font-bold text-slate-900">

                    Team Performance

                  </h2>

                  <p className="mt-1 text-sm text-slate-500">

                    Average performance across your team

                  </p>

                </div>

              </div>


              <div className="text-left sm:text-right">

                <p className="text-3xl font-bold text-indigo-600">

                  {performanceScore}

                </p>

                <p className="text-xs text-slate-400">

                  Average score

                </p>

              </div>

            </div>


            {/* PERFORMANCE VISUAL */}

            <div className="mt-10 flex flex-col items-center justify-center">

              <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[14px] border-indigo-100">

                <div className="absolute inset-0 rounded-full border-[14px] border-transparent border-t-indigo-600 border-r-violet-500 rotate-45"></div>

                <div className="text-center">

                  <p className="text-4xl font-bold text-slate-900">

                    {performanceScore}

                  </p>

                  <p className="mt-1 text-sm text-slate-400">

                    Performance Score

                  </p>

                </div>

              </div>


              <p className="mt-7 max-w-md text-center text-sm leading-6 text-slate-500">

                Track your team's overall performance and identify
                opportunities for better productivity and growth.

              </p>

            </div>


            {/* FOOTER */}

            <div className="mt-8 rounded-2xl bg-indigo-50 p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">

                  ✦

                </div>

                <div>

                  <p className="text-sm font-semibold text-indigo-900">

                    WorkSphere Insight

                  </p>

                  <p className="mt-1 text-xs text-indigo-600">

                    Consistent performance tracking helps build stronger teams.

                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              TOP PERFORMER
          ================================================= */}

          <div className="xl:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 text-white shadow-xl shadow-indigo-200 md:p-8">


            {/* BACKGROUND */}

            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>

            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5"></div>


            <div className="relative z-10">


              {/* HEADER */}

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


              {/* PERFORMER */}

              <div className="mt-10">

                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 text-4xl backdrop-blur">

                  🏆

                </div>


                <h3 className="mt-6 text-2xl font-bold">

                  {dashboard.topPerformer}

                </h3>


                <p className="mt-2 text-sm text-indigo-100">

                  Highest performing employee on your team.

                </p>

              </div>


              {/* FOOTER */}

              <div className="mt-12 border-t border-white/10 pt-5">

                <p className="text-xs text-indigo-200">

                  TEAM RECOGNITION

                </p>

                <p className="mt-1 text-sm font-medium">

                  Great performance inspires stronger teams.

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


            {/* MY TEAM */}

            <Link
                to="/manager/team"
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

                My Team

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                View your employees and monitor team members.

              </p>


              <div className="mt-6 text-sm font-semibold text-indigo-600">

                Open workspace →

              </div>

            </Link>


            {/* TASKS */}

            <Link
                to="/manager/tasks"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-xl">

                  📋

                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500">

                  →

                </span>

              </div>


              <h3 className="mt-6 text-lg font-bold text-slate-900">

                Manage Tasks

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                Create, assign and monitor your team's tasks.

              </p>


              <div className="mt-6 text-sm font-semibold text-violet-600">

                Open workspace →

              </div>

            </Link>


            {/* REVIEWS */}

            <Link
                to="/manager/reviews"
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">

                  ★

                </div>

                <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500">

                  →

                </span>

              </div>


              <h3 className="mt-6 text-lg font-bold text-slate-900">

                Performance Reviews

              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">

                Review employee performance and provide feedback.

              </p>


              <div className="mt-6 text-sm font-semibold text-emerald-600">

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

                  Smarter team intelligence

                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">

                  WorkSphere AI will soon help managers understand team
                  workloads, employee skills, performance patterns and
                  recommend smarter task assignments.

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

export default ManagerDashboard;