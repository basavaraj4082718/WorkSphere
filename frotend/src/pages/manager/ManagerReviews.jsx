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
            //
            // Reviews given by THIS manager
            // to THIS manager's employees.
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
            //
            // Reviews given BY ADMIN
            // TO THIS MANAGER.
            //
            // employeeId == null
            // managerId == logged-in manager
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


            // =========================================
            // GET LOGGED-IN MANAGER
            // =========================================

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


            // =========================================
            // CREATE EMPLOYEE REVIEW
            // =========================================

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

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= numericValue
                                    ? "text-yellow-500 text-lg"
                                    : "text-gray-300 text-lg"
                            }
                        >
                            ★
                        </span>

                    )
                )}

                <span className="ml-1 font-semibold text-gray-800">
                    {numericValue}
                </span>

                <span className="text-gray-400 text-sm">
                    / 5
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
                    Loading reviews...
                </div>

            </div>
        );
    }


    // =========================================
    // UI
    // =========================================

    return (

        <div className="space-y-6">


            {/* =====================================
                HEADER
            ===================================== */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                    <p className="text-blue-600 font-medium">
                        Manager Portal
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900 mt-1">
                        Reviews
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review your team and view your own performance reviews.
                    </p>

                </div>


                <button
                    onClick={() => {
                        setError("");
                        setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    + Add Employee Review
                </button>

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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-gray-500 text-sm">
                        Team Reviews
                    </p>

                    <h2 className="text-3xl font-bold text-blue-600 mt-2">
                        {reviews.length}
                    </h2>

                    <p className="text-sm text-gray-500 mt-4">
                        Reviews given to your employees
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-gray-500 text-sm">
                        Average Team Rating
                    </p>

                    <h2 className="text-3xl font-bold text-green-600 mt-2">
                        {averageRating}
                    </h2>

                    <p className="text-sm text-gray-500 mt-4">
                        Average employee rating
                    </p>

                </div>


                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <p className="text-gray-500 text-sm">
                        My Reviews
                    </p>

                    <h2 className="text-3xl font-bold text-purple-600 mt-2">
                        {myReviews.length}
                    </h2>

                    <p className="text-sm text-gray-500 mt-4">
                        Reviews received from Admin
                    </p>

                </div>

            </div>


            {/* =====================================
                MY REVIEWS
                ADMIN -> MANAGER
            ===================================== */}

            <div className="bg-white rounded-xl shadow-sm border">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-semibold text-gray-900">
                        My Reviews
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Performance reviews given to you by the Admin.
                    </p>

                </div>


                {myReviews.length === 0 ? (

                    <div className="p-10 text-center">

                        <div className="text-4xl mb-3">
                            ⭐
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900">
                            No reviews yet
                        </h3>

                        <p className="text-gray-500 mt-1">
                            You have not received any reviews from the Admin.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y">

                        {myReviews.map(
                            (review) => (

                                <div
                                    key={review.id}
                                    className="p-6 hover:bg-gray-50 transition"
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


                                        {/* ADMIN */}

                                        <div className="flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-lg">
                                                A
                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    Admin Review
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Performance review for you
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

                                    <div className="mt-4 lg:ml-16">

                                        <p className="text-gray-600">
                                            {review.comments}
                                        </p>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>


            {/* =====================================
                ADD EMPLOYEE REVIEW FORM
            ===================================== */}

            {showForm && (

                <div className="bg-white rounded-xl shadow-sm border p-6">

                    <div className="flex justify-between items-center mb-6">

                        <div>

                            <h2 className="text-xl font-semibold text-gray-900">
                                Add Employee Review
                            </h2>

                            <p className="text-gray-500 text-sm mt-1">
                                Select an employee and provide their performance review.
                            </p>

                        </div>


                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            ✕
                        </button>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >


                        {/* EMPLOYEE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Employee
                            </label>

                            <select
                                value={employeeId}
                                onChange={(e) =>
                                    setEmployeeId(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    -- Select an employee --
                                </option>


                                {employees.map(
                                    (employee) => (

                                        <option
                                            key={employee.id}
                                            value={employee.id}
                                        >
                                            {employee.firstName}{" "}
                                            {employee.lastName}
                                            {" - "}
                                            {employee.employeeCode}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* RATING */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                            </label>

                            <select
                                value={rating}
                                onChange={(e) =>
                                    setRating(
                                        e.target.value
                                    )
                                }
                                required
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    -- Select rating --
                                </option>

                                <option value="5">
                                    ⭐⭐⭐⭐⭐ — 5 Excellent
                                </option>

                                <option value="4">
                                    ⭐⭐⭐⭐ — 4 Very Good
                                </option>

                                <option value="3">
                                    ⭐⭐⭐ — 3 Good
                                </option>

                                <option value="2">
                                    ⭐⭐ — 2 Needs Improvement
                                </option>

                                <option value="1">
                                    ⭐ — 1 Poor
                                </option>

                            </select>

                        </div>


                        {/* COMMENTS */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Comments
                            </label>

                            <textarea
                                value={comments}
                                onChange={(e) =>
                                    setComments(
                                        e.target.value
                                    )
                                }
                                rows="5"
                                required
                                placeholder="Write your performance review..."
                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {submitting
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>


                            <button
                                type="button"
                                onClick={resetForm}
                                className="border border-gray-300 px-5 py-3 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* =====================================
                TEAM REVIEWS
            ===================================== */}

            <div className="bg-white rounded-xl shadow-sm border">

                <div className="p-6 border-b">

                    <h2 className="text-xl font-semibold text-gray-900">
                        Team Reviews
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Performance reviews you have given to your employees.
                    </p>

                </div>


                {reviews.length === 0 ? (

                    <div className="p-12 text-center">

                        <div className="text-5xl mb-4">
                            ⭐
                        </div>

                        <h3 className="text-xl font-semibold text-gray-900">
                            No reviews yet
                        </h3>

                        <p className="text-gray-500 mt-2">
                            Add your first employee review to get started.
                        </p>

                    </div>

                ) : (

                    <div className="divide-y">

                        {reviews.map(
                            (review) => (

                                <div
                                    key={review.id}
                                    className="p-6 hover:bg-gray-50 transition"
                                >

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">


                                        {/* EMPLOYEE */}

                                        <div className="flex items-center gap-4">

                                            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-lg">

                                                {review.employeeName
                                                    ?.charAt(0)
                                                    .toUpperCase()}

                                            </div>


                                            <div>

                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    {review.employeeName}
                                                </h3>

                                                <p className="text-sm text-gray-500">
                                                    Employee ID: {review.employeeId}
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


                                        {/* DELETE */}

                                        <button
                                            onClick={() =>
                                                handleDelete(
                                                    review.id
                                                )
                                            }
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            Delete
                                        </button>

                                    </div>


                                    {/* COMMENTS */}

                                    <div className="mt-4 lg:ml-16">

                                        <p className="text-gray-600">
                                            {review.comments}
                                        </p>

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>
    );
};

export default ManagerReviews;