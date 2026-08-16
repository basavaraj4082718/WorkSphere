import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeReviews() {

    const [reviews, setReviews] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");


    // =========================================
    // LOAD EMPLOYEE
    // =========================================

    const getEmployee = async () => {

        const response = await axios.get(
            "http://localhost:8080/api/dashboard/employee/me",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    };


    // =========================================
    // LOAD REVIEWS
    // =========================================

    const fetchReviews = async () => {

        try {

            setLoading(true);
            setError("");

            const employee = await getEmployee();

            const response = await axios.get(
                `http://localhost:8080/api/reviews/employee/${employee.employeeId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReviews(response.data);

        } catch (error) {

            console.error("EMPLOYEE REVIEWS ERROR:", error);

            setError(
                error.response?.data ||
                "Unable to load reviews"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchReviews();

    }, []);


    // =========================================
    // RATING STARS
    // =========================================

    const renderStars = (rating) => {

        return (
            <div className="flex items-center gap-1">

                {[1, 2, 3, 4, 5].map((star) => (

                    <span
                        key={star}
                        className={
                            star <= rating
                                ? "text-yellow-400 text-xl"
                                : "text-gray-300 text-xl"
                        }
                    >
                        ★
                    </span>

                ))}

            </div>
        );
    };


    // =========================================
    // AVERAGE RATING
    // =========================================

    const averageRating =
        reviews.length === 0
            ? 0
            : reviews.reduce(
            (sum, review) =>
                sum + Number(review.rating || 0),
            0
        ) / reviews.length;


    return (

        <div className="p-6">

            {/* =========================================
                HEADER
            ========================================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    My Reviews
                </h1>

                <p className="text-gray-500 mt-1">
                    View feedback and reviews from your managers.
                </p>

            </div>


            {/* =========================================
                SUMMARY
            ========================================= */}

            {!loading && reviews.length > 0 && (

                <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                        <div>

                            <p className="text-sm text-gray-500">
                                Average Rating
                            </p>

                            <div className="flex items-center gap-4 mt-2">

                                <span className="text-4xl font-bold text-gray-800">
                                    {averageRating.toFixed(1)}
                                </span>

                                <div>

                                    {renderStars(
                                        Math.round(averageRating)
                                    )}

                                    <p className="text-sm text-gray-500 mt-1">
                                        Based on {reviews.length} review
                                        {reviews.length !== 1 ? "s" : ""}
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="bg-blue-50 rounded-xl px-6 py-4">

                            <p className="text-sm text-blue-600">
                                Total Reviews
                            </p>

                            <p className="text-3xl font-bold text-blue-700">
                                {reviews.length}
                            </p>

                        </div>

                    </div>

                </div>

            )}


            {/* =========================================
                ERROR
            ========================================= */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">

                    {error}

                </div>

            )}


            {/* =========================================
                LOADING
            ========================================= */}

            {loading ? (

                <div className="bg-white rounded-xl shadow-sm border p-10 text-center">

                    <p className="text-gray-500">
                        Loading reviews...
                    </p>

                </div>

            ) : reviews.length === 0 ? (

                /* =========================================
                    EMPTY STATE
                ========================================= */

                <div className="bg-white rounded-xl shadow-sm border p-12 text-center">

                    <div className="text-5xl mb-4">
                        ⭐
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800">
                        No Reviews Yet
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Your manager reviews will appear here once they are submitted.
                    </p>

                </div>

            ) : (

                /* =========================================
                    REVIEW LIST
                ========================================= */

                <div className="space-y-5">

                    {reviews.map((review) => (

                        <div
                            key={review.id}
                            className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition"
                        >

                            {/* REVIEW HEADER */}

                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                                <div>

                                    <div className="flex items-center gap-3">

                                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">

                                            {review.managerName
                                                ? review.managerName
                                                    .charAt(0)
                                                    .toUpperCase()
                                                : "M"}

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-gray-800">

                                                {review.managerName ||
                                                    "Manager"}

                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Manager Review
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div className="text-left md:text-right">

                                    {renderStars(review.rating)}

                                    <p className="text-sm text-gray-500 mt-1">
                                        {review.reviewDate}
                                    </p>

                                </div>

                            </div>


                            {/* COMMENTS */}

                            <div className="mt-5 bg-gray-50 rounded-lg p-5">

                                <p className="text-sm font-medium text-gray-600 mb-2">
                                    Feedback
                                </p>

                                <p className="text-gray-700 leading-relaxed">
                                    "{review.comments}"
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default EmployeeReviews;