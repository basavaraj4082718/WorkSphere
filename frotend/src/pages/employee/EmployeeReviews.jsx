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


            console.log(
                "My reviews:",
                myReviews
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
                                : "text-gray-300 text-xl"
                        }
                    >
                        ★
                    </span>

                ))}

                <span className="ml-2 font-semibold text-gray-700">
                    {value}/5
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

                <div className="text-gray-500 text-lg">
                    Loading your reviews...
                </div>

            </div>

        );
    }


    // =========================================
    // PAGE
    // =========================================

    return (

        <div className="space-y-6">


            {/* =====================================
                HEADER
            ===================================== */}

            <div>

                <p className="text-blue-600 font-medium">
                    Performance
                </p>

                <h1 className="text-3xl font-bold text-gray-900 mt-1">
                    My Reviews
                </h1>

                <p className="text-gray-500 mt-2">
                    Performance reviews given by your manager.
                </p>

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">

                    {error}

                </div>

            )}


            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                {/* TOTAL REVIEWS */}

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Total Reviews
                            </p>

                            <h2 className="text-3xl font-bold text-blue-600 mt-2">
                                {reviews.length}
                            </h2>

                        </div>

                        <div className="bg-blue-100 text-blue-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            ⭐
                        </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Reviews received from your manager
                    </p>

                </div>


                {/* AVERAGE */}

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="flex justify-between items-start">

                        <div>

                            <p className="text-gray-500 text-sm">
                                Average Rating
                            </p>

                            <h2 className="text-3xl font-bold text-green-600 mt-2">
                                {averageRating}
                            </h2>

                        </div>

                        <div className="bg-green-100 text-green-600 w-11 h-11 rounded-lg flex items-center justify-center text-xl">
                            📈
                        </div>

                    </div>

                    <p className="text-sm text-gray-500 mt-4">
                        Your average performance rating
                    </p>

                </div>

            </div>


            {/* =====================================
                REVIEWS
            ===================================== */}

            <div className="bg-white rounded-xl shadow-sm border">


                <div className="p-6 border-b">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Performance Reviews
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Reviews and feedback provided by your manager.
                    </p>

                </div>


                {/* =====================================
                    EMPTY
                ===================================== */}

                {reviews.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="text-5xl mb-4">
                            ⭐
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900">
                            No reviews yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Your manager has not submitted any performance reviews yet.
                        </p>

                    </div>

                ) : (


                    /* =====================================
                        REVIEW LIST
                    ===================================== */

                    <div className="divide-y">

                        {reviews.map((review) => (

                            <div
                                key={review.id}
                                className="p-6 hover:bg-gray-50 transition"
                            >


                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


                                    {/* MANAGER */}

                                    <div className="flex items-center gap-4">

                                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">

                                            {review.managerName
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div>

                                            <h3 className="font-semibold text-gray-900 text-lg">
                                                {review.managerName}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Manager
                                            </p>

                                        </div>

                                    </div>


                                    {/* RATING */}

                                    <div>

                                        {renderStars(
                                            review.rating
                                        )}

                                    </div>


                                    {/* DATE */}

                                    <div className="text-sm text-gray-500">

                                        {review.reviewDate}

                                    </div>

                                </div>


                                {/* COMMENTS */}

                                <div className="mt-5 lg:ml-16">

                                    <p className="text-gray-600 leading-relaxed">

                                        {review.comments}

                                    </p>

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