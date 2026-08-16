import { useEffect, useState } from "react";
import axios from "axios";

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("ALL");

    const [formData, setFormData] = useState({
        rating: "",
        comments: "",
        employeeId: "",
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
            alert("Failed to load reviews");
        }
    };

    // =========================
    // FETCH EMPLOYEES
    // =========================

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8080/api/employees",
                authConfig
            );

            setEmployees(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to load employees");
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
            alert("Failed to load managers");
        }
    };

    useEffect(() => {
        fetchReviews();
        fetchEmployees();
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
            employeeId: "",
            managerId: "",
        });

        setShowForm(false);
    };

    // =========================
    // CREATE REVIEW
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const requestData = {
                rating: Number(formData.rating),
                comments: formData.comments,
                employeeId: Number(formData.employeeId),
                managerId: Number(formData.managerId),
            };

            await axios.post(
                "http://localhost:8080/api/reviews",
                requestData,
                authConfig
            );

            alert("Review added successfully");

            resetForm();
            fetchReviews();

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to add review"
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

    const filteredReviews = reviews.filter((review) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            review.employeeName
                ?.toLowerCase()
                .includes(searchValue) ||
            review.managerName
                ?.toLowerCase()
                .includes(searchValue) ||
            review.comments
                ?.toLowerCase()
                .includes(searchValue);

        const matchesRating =
            ratingFilter === "ALL" ||
            review.rating === Number(ratingFilter);

        return matchesSearch && matchesRating;
    });

    // =========================
    // RATING DISPLAY
    // =========================

    const renderStars = (rating) => {
        return (
            <span className="text-yellow-500 tracking-wide">
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
                        Reviews
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage employee performance reviews.
                    </p>

                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                    + Add Review
                </button>

            </div>


            {/* FILTERS */}

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <input
                        type="text"
                        placeholder="Search employee, manager or comments..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={ratingFilter}
                        onChange={(e) =>
                            setRatingFilter(e.target.value)
                        }
                        className="border border-gray-300 p-3 rounded-lg"
                    >

                        <option value="ALL">
                            All Ratings
                        </option>

                        <option value="5">
                            5 Stars
                        </option>

                        <option value="4">
                            4 Stars
                        </option>

                        <option value="3">
                            3 Stars
                        </option>

                        <option value="2">
                            2 Stars
                        </option>

                        <option value="1">
                            1 Star
                        </option>

                    </select>

                </div>

            </div>


            {/* ADD REVIEW FORM */}

            {showForm && (

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">

                    <div className="flex justify-between items-center mb-5">

                        <div>
                            <h2 className="text-xl font-semibold">
                                Add Employee Review
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Record a performance review.
                            </p>
                        </div>

                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-900 text-2xl"
                        >
                            ×
                        </button>

                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* EMPLOYEE */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Employee
                            </label>

                            <select
                                name="employeeId"
                                value={formData.employeeId}
                                onChange={handleChange}
                                required
                                className="w-full border p-3 rounded-lg"
                            >

                                <option value="">
                                    Select Employee
                                </option>

                                {employees.map((employee) => (

                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.firstName}{" "}
                                        {employee.lastName}
                                    </option>

                                ))}

                            </select>

                        </div>


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
                                className="w-full border p-3 rounded-lg"
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
                                className="w-full border p-3 rounded-lg"
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
                                rows="5"
                                required
                                className="w-full border p-3 rounded-lg"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="flex gap-3">

                            <button
                                type="submit"
                                className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                            >
                                Add Review
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* REVIEWS TABLE */}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">

                <table className="w-full min-w-[900px]">

                    <thead className="bg-gray-50">

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

                            <td className="p-4 font-medium">
                                {review.employeeName}
                            </td>

                            <td className="p-4">
                                {review.managerName}
                            </td>

                            <td className="p-4">

                                <div className="flex flex-col gap-1">

                                    {renderStars(review.rating)}

                                    <span className="text-xs text-gray-500">
                      {review.rating}/5
                    </span>

                                </div>

                            </td>

                            <td className="p-4 max-w-[350px]">

                                <p className="text-gray-600">
                                    {review.comments}
                                </p>

                            </td>

                            <td className="p-4 text-gray-600">
                                {review.reviewDate}
                            </td>

                            <td className="p-4">

                                <button
                                    onClick={() =>
                                        handleDelete(review.id)
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


                {filteredReviews.length === 0 && (

                    <div className="text-center py-12">

                        <p className="text-gray-500">
                            No reviews found.
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                            Try changing your search or filters.
                        </p>

                    </div>

                )}

            </div>

        </div>
    );
};

export default ReviewManagement;