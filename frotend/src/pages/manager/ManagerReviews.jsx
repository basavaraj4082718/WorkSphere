import { useEffect, useState } from "react";
import axios from "axios";

const ManagerReviews = () => {

    const [reviews, setReviews] = useState([]);

    // Reviews given TO the logged-in manager by Admin
    const [myReviews, setMyReviews] = useState([]);

    const [employees, setEmployees] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [employeeId, setEmployeeId] = useState("");
    const [rating, setRating] = useState("");
    const [comments, setComments] = useState("");

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    // =========================================
    // FETCH DATA
    // =========================================

    const fetchData = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");


            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };


            // =========================================
            // GET LOGGED-IN MANAGER
            // =========================================

            const managerResponse = await axios.get(
                "http://localhost:8080/api/dashboard/manager/me",
                config
            );


            const managerId =
                managerResponse.data.managerId;


            // =========================================
            // GET ALL EMPLOYEES
            // =========================================

            const employeeResponse = await axios.get(
                "http://localhost:8080/api/employees",
                config
            );


            // =========================================
            // ONLY THIS MANAGER'S EMPLOYEES
            // =========================================

            const myEmployees =
                employeeResponse.data.filter(
                    (employee) =>
                        Number(employee.managerId) ===
                        Number(managerId)
                );


            setEmployees(myEmployees);


            // =========================================
            // GET ALL REVIEWS
            // =========================================

            const reviewResponse = await axios.get(
                "http://localhost:8080/api/reviews",
                config
            );


            const allReviews =
                reviewResponse.data;


            // =========================================
            // EMPLOYEE REVIEWS
            // =========================================

            const myEmployeeIds =
                myEmployees.map(
                    (employee) =>
                        Number(employee.id)
                );


            const employeeReviews =
                allReviews.filter(
                    (review) =>
                        review.employeeId != null &&
                        myEmployeeIds.includes(
                            Number(review.employeeId)
                        ) &&
                        Number(review.managerId) ===
                        Number(managerId)
                );


            setReviews(employeeReviews);


            // =========================================
            // MY REVIEWS
            // =========================================

            const managerReviews =
                allReviews.filter(
                    (review) =>
                        review.employeeId == null &&
                        Number(review.managerId) ===
                        Number(managerId)
                );


            setMyReviews(managerReviews);


        } catch (error) {

            console.error(
                "MANAGER REVIEWS ERROR:",
                error
            );

            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load reviews"
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, []);


    // =========================================
    // RESET FORM
    // =========================================

    const resetForm = () => {

        setEmployeeId("");
        setRating("");
        setComments("");
        setError("");
        setShowForm(false);
    };


    // =========================================
    // ADD EMPLOYEE REVIEW
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!employeeId) {

            setError(
                "Please select an employee."
            );

            return;
        }


        if (!rating) {

            setError(
                "Please select a rating."
            );

            return;
        }


        if (!comments.trim()) {

            setError(
                "Please enter review comments."
            );

            return;
        }


        try {

            setSubmitting(true);

            const token =
                localStorage.getItem("token");


            const managerResponse =
                await axios.get(
                    "http://localhost:8080/api/dashboard/manager/me",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const managerId =
                managerResponse.data.managerId;


            const requestData = {

                rating: Number(rating),

                comments: comments.trim(),

                employeeId:
                    Number(employeeId),

                managerId:
                    Number(managerId),
            };


            await axios.post(
                "http://localhost:8080/api/reviews",
                requestData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            alert(
                "Review added successfully!"
            );


            resetForm();

            await fetchData();


        } catch (error) {

            console.error(
                "ADD REVIEW ERROR:",
                error
            );


            setError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to add review"
            );

        } finally {

            setSubmitting(false);
        }
    };


    // =========================================
    // DELETE REVIEW
    // =========================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this review?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            await axios.delete(
                `http://localhost:8080/api/reviews/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            alert(
                "Review deleted successfully"
            );


            await fetchData();


        } catch (error) {

            console.error(
                "DELETE REVIEW ERROR:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to delete review"
            );
        }
    };


    // =========================================
    // AVERAGE RATING
    // =========================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (total, review) =>
                        total +
                        Number(
                            review.rating || 0
                        ),
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";


    // =========================================
    // STARS
    // =========================================

    const renderStars = (value) => {

        const numericValue =
            Number(value || 0);


        return (

            <div className="flex items-center gap-1">

                <div className="flex">

                    {[1, 2, 3, 4, 5].map(
                        (star) => (

                            <span
                                key={star}
                                className={
                                    star <= numericValue
                                        ? "text-amber-400 text-lg"
                                        : "text-slate-200 text-lg"
                                }
                            >
                                ★
                            </span>

                        )
                    )}

                </div>

                <span className="ml-2 text-sm font-semibold text-slate-700">
                    {numericValue}.0
                </span>

            </div>
        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <div className="flex flex-col items-center gap-3">

                    <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>

                    <p className="text-slate-500 font-medium">
                        Loading reviews...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="space-y-8">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

                <div>

                    <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            ⭐
                        </div>

                        <p className="text-indigo-600 font-semibold text-sm">
                            PERFORMANCE MANAGEMENT
                        </p>

                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 tracking-tight">
                        Performance Reviews
                    </h1>

                    <p className="text-slate-500 mt-2 max-w-xl">
                        Evaluate your team performance and track feedback
                        received from administrators.
                    </p>

                </div>


                <button
                    onClick={() => {
                        setError("");
                        setShowForm(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
                >
                    <span className="text-lg">
                        +
                    </span>

                    Add Employee Review

                </button>

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                    <span className="text-lg">
                        ⚠️
                    </span>

                    <span className="font-medium">
                        {error}
                    </span>

                </div>

            )}


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* TEAM REVIEWS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Team Reviews
                            </p>

                            <h2 className="text-3xl font-bold text-slate-900 mt-3">
                                {reviews.length}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">
                            👥
                        </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">

                        <p className="text-sm text-slate-500">
                            Reviews submitted to employees
                        </p>

                    </div>

                </div>


                {/* AVERAGE RATING */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Average Rating
                            </p>

                            <div className="flex items-end gap-2 mt-3">

                                <h2 className="text-3xl font-bold text-slate-900">
                                    {averageRating}
                                </h2>

                                <span className="text-sm text-slate-400 mb-1">
                                    / 5
                                </span>

                            </div>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                            ⭐
                        </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">

                        <p className="text-sm text-slate-500">
                            Average employee performance
                        </p>

                    </div>

                </div>


                {/* MY REVIEWS */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                My Reviews
                            </p>

                            <h2 className="text-3xl font-bold text-slate-900 mt-3">
                                {myReviews.length}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center text-xl">
                            🏆
                        </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">

                        <p className="text-sm text-slate-500">
                            Feedback received from Admin
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================
                MY REVIEWS
            ===================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            My Performance Reviews
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Feedback and evaluations received from administrators.
                        </p>

                    </div>

                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-violet-50 items-center justify-center">
                        🏆
                    </div>

                </div>


                {myReviews.length === 0 ? (

                    <div className="py-14 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                            ⭐
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mt-4">
                            No reviews yet
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                            You haven't received any performance reviews yet.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100">

                        {myReviews.map((review) => (

                            <div
                                key={review.id}
                                className="p-6 hover:bg-slate-50/70 transition-colors"
                            >

                                <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                                    <div className="flex items-center gap-4 flex-1">

                                        <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-lg">
                                            A
                                        </div>

                                        <div>

                                            <h3 className="font-bold text-slate-900">
                                                Admin Review
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-0.5">
                                                Performance evaluation
                                            </p>

                                        </div>

                                    </div>


                                    <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">

                                        {renderStars(review.rating)}

                                    </div>


                                    <div className="text-sm text-slate-500 whitespace-nowrap">
                                        {review.reviewDate}
                                    </div>

                                </div>


                                <div className="mt-5 ml-0 lg:ml-16 bg-slate-50 border border-slate-100 rounded-xl p-4">

                                    <p className="text-slate-600 leading-relaxed">
                                        {review.comments}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>


            {/* =====================================
                TEAM REVIEWS
            ===================================== */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Team Performance Reviews
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Reviews and feedback submitted to your team members.
                        </p>

                    </div>

                    <div className="hidden sm:flex w-10 h-10 rounded-xl bg-indigo-50 items-center justify-center">
                        👥
                    </div>

                </div>


                {reviews.length === 0 ? (

                    <div className="py-16 text-center">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">
                            ⭐
                        </div>

                        <h3 className="text-lg font-bold text-slate-800 mt-4">
                            No team reviews yet
                        </h3>

                        <p className="text-slate-500 text-sm mt-1">
                            Start evaluating your team's performance by adding a review.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y divide-slate-100">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="p-6 hover:bg-slate-50/70 transition-colors"
                            >

                                <div className="flex flex-col xl:flex-row xl:items-center gap-5">


                                    {/* EMPLOYEE */}

                                    <div className="flex items-center gap-4 flex-1">

                                        <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">

                                            {review.employeeName
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>


                                        <div>

                                            <h3 className="font-bold text-slate-900">
                                                {review.employeeName}
                                            </h3>

                                            <p className="text-sm text-slate-500 mt-0.5">
                                                Employee ID: {review.employeeId}
                                            </p>

                                        </div>

                                    </div>


                                    {/* RATING */}

                                    <div className="bg-amber-50 border border-amber-100 px-4 py-2 rounded-xl">

                                        {renderStars(review.rating)}

                                    </div>


                                    {/* DATE */}

                                    <div className="text-sm text-slate-500 whitespace-nowrap">
                                        {review.reviewDate}
                                    </div>


                                    {/* DELETE */}

                                    <button
                                        onClick={() =>
                                            handleDelete(review.id)
                                        }
                                        className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 transition"
                                    >
                                        Delete
                                    </button>

                                </div>


                                {/* COMMENTS */}

                                <div className="mt-5 ml-0 lg:ml-16 bg-slate-50 border border-slate-100 rounded-xl p-4">

                                    <p className="text-slate-600 leading-relaxed">
                                        {review.comments}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>


            {/* =====================================
                ADD EMPLOYEE REVIEW MODAL
            ===================================== */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">


                    <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">


                        {/* MODAL HEADER */}

                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-6 text-white">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-xl backdrop-blur">
                                        ⭐
                                    </div>


                                    <div>

                                        <h2 className="text-xl font-bold">
                                            Add Employee Review
                                        </h2>

                                        <p className="mt-1 text-sm text-indigo-100">
                                            Evaluate an employee's performance and provide feedback.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    onClick={resetForm}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl transition hover:bg-white/20"
                                >
                                    ✕
                                </button>

                            </div>

                        </div>


                        {/* MODAL CONTENT */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-6 md:p-8"
                        >


                            {/* EMPLOYEE */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Select Employee
                                </label>


                                <select
                                    value={employeeId}
                                    onChange={(e) =>
                                        setEmployeeId(e.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                >

                                    <option value="">
                                        Select an employee
                                    </option>


                                    {employees.map((employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.firstName}{" "}
                                            {employee.lastName}
                                            {" — "}
                                            {employee.employeeCode}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* RATING */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Performance Rating
                                </label>


                                <select
                                    value={rating}
                                    onChange={(e) =>
                                        setRating(e.target.value)
                                    }
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                >

                                    <option value="">
                                        Select rating
                                    </option>

                                    <option value="5">
                                        ⭐⭐⭐⭐⭐ — Excellent
                                    </option>

                                    <option value="4">
                                        ⭐⭐⭐⭐ — Very Good
                                    </option>

                                    <option value="3">
                                        ⭐⭐⭐ — Good
                                    </option>

                                    <option value="2">
                                        ⭐⭐ — Needs Improvement
                                    </option>

                                    <option value="1">
                                        ⭐ — Poor
                                    </option>

                                </select>

                            </div>


                            {/* COMMENTS */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Review Comments
                                </label>


                                <textarea
                                    value={comments}
                                    onChange={(e) =>
                                        setComments(e.target.value)
                                    }
                                    rows="6"
                                    required
                                    placeholder="Write detailed feedback about the employee's performance..."
                                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">


                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Review"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ManagerReviews;