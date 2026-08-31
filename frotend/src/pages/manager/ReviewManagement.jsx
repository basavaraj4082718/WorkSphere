import { useEffect, useState } from "react";
import axios from "axios";

const ReviewManagement = () => {

    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/reviews",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReviews(response.data);

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load reviews"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchReviews();
    }, []);


    // =========================================
    // DELETE REVIEW
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmDelete) return;

        try {

            const token = localStorage.getItem("token");

            await axios.delete(
                `http://localhost:8080/api/reviews/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Review deleted successfully");

            fetchReviews();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete review"
            );

        }
    };


    // =========================================
    // SEARCH
    // =========================================

    const filteredReviews = reviews.filter((review) => {

        const searchValue = search.toLowerCase();

        return (

            review.employeeName
                ?.toLowerCase()
                .includes(searchValue) ||

            review.managerName
                ?.toLowerCase()
                .includes(searchValue) ||

            review.comments
                ?.toLowerCase()
                .includes(searchValue) ||

            String(review.rating)
                .includes(searchValue)

        );

    });


    // =========================================
    // STATISTICS
    // =========================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, review) =>
                        sum + Number(review.rating || 0),
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";


    const fiveStarReviews =
        reviews.filter(
            (review) =>
                Number(review.rating) === 5
        ).length;


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex flex-col justify-center items-center min-h-[400px]">

                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>

                <p className="text-slate-500 mt-4 font-medium">
                    Loading reviews...
                </p>

            </div>

        );

    }


    return (

        <div className="space-y-8">


            {/* =========================================
                HEADER
            ========================================= */}

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

                <div>

                    <div className="flex items-center gap-2">

                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>

                        <p className="text-indigo-600 font-semibold text-sm">
                            Performance Management
                        </p>

                    </div>


                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 tracking-tight">

                        Reviews

                    </h1>


                    <p className="text-slate-500 mt-2">

                        View and manage employee performance reviews across the organization.

                    </p>

                </div>


                <div className="text-sm text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">

                    <span className="font-semibold text-slate-800">
                        {reviews.length}
                    </span>

                    {" "}total reviews

                </div>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* Total Reviews */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Total Reviews
                            </p>

                            <p className="text-3xl font-bold text-slate-900 mt-3">

                                {reviews.length}

                            </p>

                            <p className="text-xs text-slate-400 mt-2">
                                All performance evaluations
                            </p>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">

                            ⭐

                        </div>

                    </div>

                </div>


                {/* Average Rating */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Average Rating
                            </p>

                            <div className="flex items-end gap-1 mt-3">

                                <p className="text-3xl font-bold text-slate-900">

                                    {averageRating}

                                </p>

                                <span className="text-sm text-slate-400 mb-1">
                                    / 5
                                </span>

                            </div>


                            <div className="flex text-yellow-400 text-sm mt-2">

                                ★★★★★

                            </div>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl">

                            ⭐

                        </div>

                    </div>

                </div>


                {/* Five Star Reviews */}

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm font-medium text-slate-500">
                                Excellent Reviews
                            </p>

                            <p className="text-3xl font-bold text-slate-900 mt-3">

                                {fiveStarReviews}

                            </p>

                            <p className="text-xs text-slate-400 mt-2">
                                Employees rated 5 stars
                            </p>

                        </div>


                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">

                            🏆

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

                <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">

                        🔍

                    </span>


                    <input
                        type="text"
                        placeholder="Search by employee, manager, rating or comments..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl py-3 pl-11 pr-4 outline-none text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
                    />

                </div>

            </div>


            {/* =========================================
                REVIEWS TABLE
            ========================================= */}

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                {/* TABLE HEADER */}

                <div className="px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">

                            Performance Reviews

                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                            Detailed employee performance feedback.

                        </p>

                    </div>


                    <div className="text-sm text-slate-500">

                        Showing

                        <span className="font-semibold text-slate-800 mx-1">

                            {filteredReviews.length}

                        </span>

                        results

                    </div>

                </div>


                <div className="overflow-x-auto">

                    <table className="w-full min-w-[950px]">


                        <thead className="bg-slate-50 border-b border-slate-200">

                        <tr>

                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Employee

                            </th>


                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Manager

                            </th>


                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Rating

                            </th>


                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Comments

                            </th>


                            <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Date

                            </th>


                            <th className="text-right px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">

                                Action

                            </th>

                        </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                        {filteredReviews.map((review) => (

                            <tr
                                key={review.id}
                                className="hover:bg-slate-50/80 transition-colors"
                            >


                                {/* EMPLOYEE */}

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">

                                            {review.employeeName
                                                    ?.charAt(0)
                                                    .toUpperCase() ||
                                                "E"}

                                        </div>


                                        <div>

                                            <p className="font-semibold text-sm text-slate-800">

                                                {review.employeeName || "Unknown Employee"}

                                            </p>


                                            <p className="text-xs text-slate-400 mt-0.5">

                                                Employee ID: {review.employeeId}

                                            </p>

                                        </div>

                                    </div>

                                </td>


                                {/* MANAGER */}

                                <td className="px-6 py-4">

                                    <div>

                                        <p className="font-medium text-sm text-slate-700">

                                            {review.managerName || "Admin"}

                                        </p>


                                        <p className="text-xs text-slate-400 mt-0.5">

                                            Manager ID: {review.managerId}

                                        </p>

                                    </div>

                                </td>


                                {/* RATING */}

                                <td className="px-6 py-4">

                                    <div className="flex items-center gap-2">

                                        <div className="flex text-amber-400 text-sm">

                                            {[1, 2, 3, 4, 5].map(
                                                (star) => (

                                                    <span
                                                        key={star}
                                                        className={
                                                            star <= Number(review.rating)
                                                                ? "text-amber-400"
                                                                : "text-slate-200"
                                                        }
                                                    >
                                                            ★
                                                        </span>

                                                )
                                            )}

                                        </div>


                                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">

                                                {review.rating}/5

                                            </span>

                                    </div>

                                </td>


                                {/* COMMENTS */}

                                <td className="px-6 py-4 max-w-sm">

                                    <p
                                        className="text-sm text-slate-600 truncate"
                                        title={review.comments}
                                    >

                                        {review.comments}

                                    </p>

                                </td>


                                {/* DATE */}

                                <td className="px-6 py-4">

                                        <span className="text-sm text-slate-500">

                                            {review.reviewDate}

                                        </span>

                                </td>


                                {/* DELETE */}

                                <td className="px-6 py-4 text-right">

                                    <button
                                        onClick={() =>
                                            handleDelete(review.id)
                                        }
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all"
                                    >

                                            <span>
                                                🗑
                                            </span>

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        ))}

                        </tbody>

                    </table>

                </div>


                {/* =========================================
                    EMPTY STATE
                ========================================= */}

                {filteredReviews.length === 0 && (

                    <div className="text-center py-16">

                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl">

                            ⭐

                        </div>


                        <h2 className="text-xl font-bold text-slate-800 mt-5">

                            No reviews found

                        </h2>


                        <p className="text-slate-500 mt-2">

                            {search
                                ? "No reviews match your search criteria."
                                : "There are no performance reviews available yet."
                            }

                        </p>


                        {search && (

                            <button
                                onClick={() => setSearch("")}
                                className="mt-5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >

                                Clear search

                            </button>

                        )}

                    </div>

                )}

            </div>

        </div>

    );

};

export default ReviewManagement;