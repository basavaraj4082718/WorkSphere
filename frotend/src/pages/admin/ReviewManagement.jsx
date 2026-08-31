import { useEffect, useState } from "react";
import axios from "axios";

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [managers, setManagers] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("ALL");

    const [showManagerDropdown, setShowManagerDropdown] = useState(false);
    const [selectedManager, setSelectedManager] = useState(null);

    const [formData, setFormData] = useState({
        rating: "",
        comments: "",
        managerId: "",
    });

    const token = localStorage.getItem("token");

    const authConfig = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // =========================
    // FETCH REVIEWS
    // =========================

    const fetchReviews = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/reviews",
                authConfig
            );

            setReviews(response.data);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load reviews"
            );
        }
    };

    // =========================
    // FETCH MANAGERS
    // =========================

    const fetchManagers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/managers",
                authConfig
            );

            setManagers(response.data);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to load managers"
            );
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        fetchReviews();
        fetchManagers();
    }, []);

    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // =========================
    // RESET FORM
    // =========================

    const resetForm = () => {
        setFormData({
            rating: "",
            comments: "",
            managerId: "",
        });

        setShowForm(false);
    };

    // =========================
    // CREATE MANAGER REVIEW
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                rating: Number(formData.rating),
                comments: formData.comments,
                managerId: Number(formData.managerId),
                employeeId: null,
            };

            await axios.post(
                "http://localhost:8080/api/reviews",
                requestData,
                authConfig
            );

            alert("Manager review added successfully");

            resetForm();
            fetchReviews();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add manager review"
            );
        }
    };

    // =========================
    // DELETE REVIEW
    // =========================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this review?"
        );

        if (!confirmed) return;

        try {
            await axios.delete(
                `http://localhost:8080/api/reviews/${id}`,
                authConfig
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

    // =========================
    // FILTER REVIEWS
    // =========================

    const managerReviews = reviews.filter(
        (review) => review.employeeId == null
    );

    const filteredReviews = managerReviews.filter((review) => {

        const searchValue = search.toLowerCase();

        const matchesSearch = selectedManager
            ? Number(review.managerId) === Number(selectedManager)
            : (
                review.managerName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                review.comments
                    ?.toLowerCase()
                    .includes(searchValue)
            );

        const matchesRating =
            ratingFilter === "ALL" ||
            review.rating === Number(ratingFilter);

        return matchesSearch && matchesRating;
    });

    // =========================
    // FILTER MANAGERS FOR SEARCH
    // =========================

    const filteredManagers = managers.filter((manager) => {

        const fullName =
            `${manager.firstName} ${manager.lastName}`.toLowerCase();

        return (
            fullName.includes(search.toLowerCase()) ||
            manager.managerCode
                ?.toLowerCase()
                .includes(search.toLowerCase()) ||
            manager.department
                ?.toLowerCase()
                .includes(search.toLowerCase())
        );
    });

    // =========================
    // RATING DISPLAY
    // =========================

    const renderStars = (rating) => {
        return (
            <span className="text-yellow-500 tracking-wide text-lg">
                {"★".repeat(rating)}

                <span className="text-gray-300">
                    {"★".repeat(5 - rating)}
                </span>
            </span>
        );
    };

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>

                    <p className="text-blue-600 font-medium">
                        Performance
                    </p>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Manager Reviews
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Review and evaluate manager performance.
                    </p>

                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Manager Review
                </button>

            </div>


            {/* FILTERS */}

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                    {/* SEARCHABLE MANAGER SEARCH */}

                    <div className="relative">

                        <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search and select a manager..."
                                value={search}
                                onFocus={() =>
                                    setShowManagerDropdown(true)
                                }
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setSelectedManager(null);
                                    setShowManagerDropdown(true);
                                }}
                                className="w-full border border-gray-300 p-3 pl-11 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {selectedManager && (

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedManager(null);
                                        setSearch("");
                                        setShowManagerDropdown(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl"
                                >
                                    ×
                                </button>

                            )}

                        </div>


                        {/* MANAGER DROPDOWN */}

                        {showManagerDropdown && (

                            <div className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">

                                {filteredManagers.length > 0 ? (

                                    filteredManagers.map((manager) => (

                                        <button
                                            type="button"
                                            key={manager.id}
                                            onClick={() => {

                                                setSelectedManager(manager.id);

                                                setSearch(
                                                    `${manager.firstName} ${manager.lastName}`
                                                );

                                                setShowManagerDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">

                                                    {manager.firstName
                                                        ?.charAt(0)
                                                        .toUpperCase()}

                                                </div>

                                                <div>

                                                    <p className="font-medium text-gray-800">

                                                        {manager.firstName}{" "}
                                                        {manager.lastName}

                                                    </p>

                                                    <p className="text-xs text-gray-500">

                                                        {manager.managerCode}
                                                        {" • "}
                                                        {manager.department}

                                                    </p>

                                                </div>

                                            </div>

                                        </button>

                                    ))

                                ) : (

                                    <div className="px-4 py-5 text-center text-sm text-gray-500">
                                        No managers found
                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* RATING FILTER */}

                    <select
                        value={ratingFilter}
                        onChange={(e) =>
                            setRatingFilter(e.target.value)
                        }
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">
                            All Ratings
                        </option>

                        <option value="5">
                            ⭐⭐⭐⭐⭐  5 Stars
                        </option>

                        <option value="4">
                            ⭐⭐⭐⭐  4 Stars
                        </option>

                        <option value="3">
                            ⭐⭐⭐  3 Stars
                        </option>

                        <option value="2">
                            ⭐⭐  2 Stars
                        </option>

                        <option value="1">
                            ⭐  1 Star
                        </option>
                    </select>

                </div>

            </div>


            {/* REVIEW COUNT */}

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold text-gray-900">
                        Manager Performance Reviews
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        View and manage performance feedback.
                    </p>

                </div>

                <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">

                    {filteredReviews.length} Review
                    {filteredReviews.length !== 1 ? "s" : ""}

                </span>

            </div>


            {/* REVIEWS GRID */}

            {filteredReviews.length > 0 ? (

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                    {filteredReviews.map((review) => (

                        <div
                            key={review.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition"
                        >

                            {/* CARD HEADER */}

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {review.managerName}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        Manager Performance Review
                                    </p>

                                </div>

                                <button
                                    onClick={() =>
                                        handleDelete(review.id)
                                    }
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                >
                                    Delete
                                </button>

                            </div>


                            {/* RATING */}

                            <div className="mt-4 flex items-center gap-3">

                                {renderStars(review.rating)}

                                <span className="text-sm font-medium text-gray-600">
                                    {review.rating}/5
                                </span>

                            </div>


                            {/* COMMENTS */}

                            <div className="mt-4">

                                <p className="text-sm font-medium text-gray-700 mb-1">
                                    Comments
                                </p>

                                <p className="text-gray-600 leading-relaxed break-words">
                                    {review.comments}
                                </p>

                            </div>


                            {/* DATE */}

                            <div className="mt-5 pt-4 border-t border-gray-100">

                                <p className="text-sm text-gray-500">

                                    Review Date:{" "}

                                    <span className="font-medium text-gray-700">
                                        {review.reviewDate}
                                    </span>

                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 text-center py-16">

                    <p className="text-gray-500 text-lg">
                        No manager reviews found.
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                        Select a manager or change the rating filter.
                    </p>

                </div>

            )}


            {/* ADD REVIEW MODAL */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">


                    {/* BACKDROP */}

                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={resetForm}
                    ></div>


                    {/* MODAL */}

                    <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 z-10">


                        {/* MODAL HEADER */}

                        <div className="flex justify-between items-start mb-6">

                            <div>

                                <p className="text-blue-600 font-medium text-sm">
                                    Performance
                                </p>

                                <h2 className="text-2xl font-bold text-gray-900">
                                    Add Manager Review
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    Give a performance review to a manager.
                                </p>

                            </div>

                            <button
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-800 text-3xl leading-none"
                            >
                                ×
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >


                            {/* MANAGER */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Manager
                                </label>

                                <select
                                    name="managerId"
                                    value={formData.managerId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Select Manager
                                    </option>

                                    {managers.map((manager) => (

                                        <option
                                            key={manager.id}
                                            value={manager.id}
                                        >
                                            {manager.firstName}{" "}
                                            {manager.lastName}
                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* RATING */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Rating
                                </label>

                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Select Rating
                                    </option>

                                    <option value="5">
                                        5 — Excellent
                                    </option>

                                    <option value="4">
                                        4 — Very Good
                                    </option>

                                    <option value="3">
                                        3 — Good
                                    </option>

                                    <option value="2">
                                        2 — Needs Improvement
                                    </option>

                                    <option value="1">
                                        1 — Poor
                                    </option>

                                </select>

                            </div>


                            {/* COMMENTS */}

                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments
                                </label>

                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    placeholder="Write your review..."
                                    rows="4"
                                    required
                                    className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* BUTTONS */}

                            <div className="flex justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                                >
                                    Add Review
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ReviewManagement;