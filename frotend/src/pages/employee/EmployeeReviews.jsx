import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeReviews = () => {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================
    // FETCH MY REVIEWS
    // =========================================

    const fetchMyReviews = async () => {

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


            // -----------------------------------------
            // GET LOGGED-IN EMPLOYEE
            // -----------------------------------------

            const employeeResponse =
                await axios.get(
                    "http://localhost:8080/api/dashboard/employee/me",
                    config
                );


            const employeeId =
                employeeResponse.data.employeeId;


            console.log(
                "Logged-in employee ID:",
                employeeId
            );


            // -----------------------------------------
            // GET ALL REVIEWS
            // -----------------------------------------

            const reviewResponse =
                await axios.get(
                    "http://localhost:8080/api/reviews",
                    config
                );


            console.log(
                "All reviews:",
                reviewResponse.data
            );


            // -----------------------------------------
            // FILTER ONLY MY REVIEWS
            // -----------------------------------------

            const myReviews =
                reviewResponse.data.filter(
                    (review) =>
                        Number(review.employeeId) ===
                        Number(employeeId)
                );


            setReviews(myReviews);


        } catch (error) {

            console.error(
                "EMPLOYEE REVIEWS ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
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

        fetchMyReviews();

    }, []);


    // =========================================
    // AVERAGE RATING
    // =========================================

    const averageRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (sum, review) =>
                        sum +
                        Number(review.rating || 0),
                    0
                ) / reviews.length
            ).toFixed(1)
            : "0.0";


    // =========================================
    // STARS
    // =========================================

    const renderStars = (rating) => {

        const value =
            Number(rating || 0);


        return (

            <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (

                    <span
                        key={star}
                        className={
                            star <= value
                                ? "text-yellow-500 text-xl"
                                : "text-gray-200 text-xl"
                        }
                    >
                        ★
                    </span>

                ))}

            </div>
        );
    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="flex justify-center items-center h-64">

                <div className="text-gray-500 text-lg">
                    Loading your reviews...
                </div>

            </div>

        );
    }


    return (

        <div className="space-y-8">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <p className="text-blue-600 font-medium">
                        Performance
                    </p>

                    <h1 className="text-4xl font-bold text-gray-900 mt-1">
                        My Reviews
                    </h1>

                    <p className="text-gray-500 mt-2 text-lg">
                        View feedback and performance ratings from your manager.
                    </p>

                </div>


                <button
                    onClick={fetchMyReviews}
                    className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl">

                    <div className="flex items-center gap-3">

                        <span className="text-xl">
                            ⚠️
                        </span>

                        <div>

                            <p className="font-semibold">
                                Unable to load reviews
                            </p>

                            <p className="text-sm mt-1">
                                {error}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                {/* TOTAL REVIEWS */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm text-gray-500">
                                Total Reviews
                            </p>

                            <h2 className="text-4xl font-bold text-gray-900 mt-3">
                                {reviews.length}
                            </h2>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                            📝
                        </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">

                        <p className="text-sm text-gray-500">
                            Performance reviews received from your manager
                        </p>

                    </div>

                </div>


                {/* AVERAGE RATING */}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-sm text-gray-500">
                                Average Rating
                            </p>

                            <div className="flex items-end gap-2 mt-3">

                                <h2 className="text-4xl font-bold text-gray-900">
                                    {averageRating}
                                </h2>

                                <span className="text-gray-400 mb-1">
                                    / 5
                                </span>

                            </div>

                        </div>

                        <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center text-2xl">
                            ⭐
                        </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100">

                        <div className="flex items-center gap-1">

                            {[1, 2, 3, 4, 5].map((star) => (

                                <span
                                    key={star}
                                    className={
                                        star <= Math.round(Number(averageRating))
                                            ? "text-yellow-500"
                                            : "text-gray-200"
                                    }
                                >
                                    ★
                                </span>

                            ))}

                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Your overall manager rating
                        </p>

                    </div>

                </div>

            </div>


            {/* =====================================
                REVIEWS SECTION
            ===================================== */}

            <div>


                {/* SECTION HEADER */}

                <div className="mb-5">

                    <p className="text-blue-600 font-medium">
                        Feedback History
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        Performance Reviews
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Feedback and ratings provided by your manager.
                    </p>

                </div>


                {/* =====================================
                    EMPTY STATE
                ===================================== */}

                {reviews.length === 0 ? (

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">

                        <div className="w-20 h-20 mx-auto rounded-2xl bg-yellow-50 flex items-center justify-center text-4xl mb-5">
                            ⭐
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900">
                            No reviews yet
                        </h3>

                        <p className="text-gray-500 mt-2 max-w-md mx-auto">
                            Your manager hasn't submitted any performance reviews yet.
                            Once a review is submitted, it will appear here.
                        </p>

                    </div>

                ) : (


                    /* =====================================
                        REVIEW CARDS
                    ===================================== */

                    <div className="space-y-5">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                            >


                                {/* =================================
                                    REVIEW HEADER
                                ================================= */}

                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">


                                    {/* MANAGER */}

                                    <div className="flex items-center gap-4">

                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">

                                            {review.managerName
                                                ?.charAt(0)
                                                .toUpperCase() || "M"}

                                        </div>


                                        <div>

                                            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                                                Reviewed By
                                            </p>

                                            <h3 className="font-bold text-gray-900 text-lg mt-1">
                                                {review.managerName}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Manager
                                            </p>

                                        </div>

                                    </div>


                                    {/* RATING + DATE */}

                                    <div className="flex flex-col sm:items-start md:items-end gap-2">


                                        {/* RATING */}

                                        <div className="flex items-center gap-3">

                                            {renderStars(
                                                review.rating
                                            )}

                                            <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 px-3 py-1 rounded-lg text-sm font-bold">

                                                {review.rating}/5

                                            </span>

                                        </div>


                                        {/* DATE */}

                                        <div className="text-sm text-gray-400 flex items-center gap-1">

                                            <span>
                                                📅
                                            </span>

                                            <span>
                                                {review.reviewDate}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================
                                    DIVIDER
                                ================================= */}

                                <div className="border-t border-gray-100 my-5" />


                                {/* =================================
                                    COMMENTS
                                ================================= */}

                                <div>

                                    <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-3">
                                        Manager Feedback
                                    </p>

                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">

                                        <p className="text-gray-600 leading-relaxed">

                                            {review.comments ||
                                                "No additional feedback provided."
                                            }

                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
};

export default EmployeeReviews;