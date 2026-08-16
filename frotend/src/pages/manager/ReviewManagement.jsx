import { useEffect, useState } from "react";
import axios from "axios";

const ReviewManagement = () => {

    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {

        try {

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
    // LOADING
    // =========================================

    if (loading) {

        return (
            <div className="flex justify-center items-center h-64">

                <p className="text-gray-500 text-lg">
                    Loading reviews...
                </p>

            </div>
        );

    }


    return (

        <div className="space-y-6">


            {/* =========================================
                HEADER
            ========================================= */}

            <div>

                <p className="text-blue-600 font-medium">
                    Performance
                </p>

                <h1 className="text-3xl font-bold mt-1">
                    Reviews
                </h1>

                <p className="text-gray-500 mt-2">
                    View and manage employee performance reviews.
                </p>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">


                {/* Total Reviews */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Total Reviews
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                {reviews.length}
                            </p>

                        </div>

                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
                            ⭐
                        </div>

                    </div>

                </div>


                {/* Average Rating */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                Average Rating
                            </p>

                            <p className="text-3xl font-bold mt-2">

                                {reviews.length > 0
                                    ? (
                                        reviews.reduce(
                                            (sum, review) =>
                                                sum + review.rating,
                                            0
                                        ) / reviews.length
                                    ).toFixed(1)
                                    : "0.0"
                                }

                                <span className="text-lg text-gray-400 ml-1">
                                    / 5
                                </span>

                            </p>

                        </div>

                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
                            ⭐
                        </div>

                    </div>

                </div>


                {/* Five Star Reviews */}

                <div className="bg-white rounded-xl shadow p-5">

                    <div className="flex justify-between items-center">

                        <div>

                            <p className="text-gray-500">
                                5 Star Reviews
                            </p>

                            <p className="text-3xl font-bold mt-2 text-green-600">

                                {
                                    reviews.filter(
                                        (review) =>
                                            review.rating === 5
                                    ).length
                                }

                            </p>

                        </div>

                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
                            🏆
                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================
                SEARCH
            ========================================= */}

            <div className="bg-white rounded-xl shadow p-4">

                <input
                    type="text"
                    placeholder="Search by employee, manager, rating or comments..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>


            {/* =========================================
                REVIEWS
            ========================================= */}

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Employee
                            </th>

                            <th className="text-left p-4">
                                Manager
                            </th>

                            <th className="text-left p-4">
                                Rating
                            </th>

                            <th className="text-left p-4">
                                Comments
                            </th>

                            <th className="text-left p-4">
                                Date
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredReviews.map((review) => (

                            <tr
                                key={review.id}
                                className="border-t hover:bg-gray-50"
                            >


                                {/* Employee */}

                                <td className="p-4">

                                    <div className="flex items-center gap-3">

                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                            {review.employeeName
                                                ?.charAt(0)
                                                .toUpperCase()}

                                        </div>

                                        <div>

                                            <p className="font-semibold">
                                                {review.employeeName}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                ID: {review.employeeId}
                                            </p>

                                        </div>

                                    </div>

                                </td>


                                {/* Manager */}

                                <td className="p-4">

                                    <p className="font-medium">
                                        {review.managerName}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        ID: {review.managerId}
                                    </p>

                                </td>


                                {/* Rating */}

                                <td className="p-4">

                                    <div className="flex items-center gap-2">

                                        <span className="text-yellow-500 text-lg">
                                            {"★".repeat(review.rating)}
                                        </span>

                                        <span className="text-gray-500">
                                            {review.rating}/5
                                        </span>

                                    </div>

                                </td>


                                {/* Comments */}

                                <td className="p-4 max-w-md">

                                    <p className="text-gray-600 truncate">
                                        {review.comments}
                                    </p>

                                </td>


                                {/* Date */}

                                <td className="p-4 text-gray-600">

                                    {review.reviewDate}

                                </td>


                                {/* Delete */}

                                <td className="p-4">

                                    <button
                                        onClick={() =>
                                            handleDelete(
                                                review.id
                                            )
                                        }
                                        className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700"
                                    >
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

                    <div className="text-center py-12">

                        <div className="text-5xl mb-3">
                            ⭐
                        </div>

                        <h2 className="text-xl font-semibold">
                            No reviews found
                        </h2>

                        <p className="text-gray-500 mt-1">

                            {search
                                ? "No reviews match your search."
                                : "There are no reviews available yet."
                            }

                        </p>

                    </div>

                )}

            </div>

        </div>

    );

};

export default ReviewManagement;