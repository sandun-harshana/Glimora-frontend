import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar, FaCheckCircle, FaTimesCircle, FaTrash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";

export default function AdminReviewsPage() {
	const [reviews, setReviews] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterStatus, setFilterStatus] = useState("all");
	const [selectedReview, setSelectedReview] = useState(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		fetchReviews();
	}, []);

	const fetchReviews = async () => {
		try {
			// In a real scenario, you would have a reviews endpoint
			// For now, we'll simulate with order feedback
			const token = localStorage.getItem("token");
			const ordersRes = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
				headers: { Authorization: `Bearer ${token}` },
			});

			const allReviews = [];
			ordersRes.data.forEach((order) => {
				if (order.customerFeedback && order.customerFeedback.length > 0) {
					order.customerFeedback
						.filter((feedback) => !feedback.isAdmin)
						.forEach((feedback) => {
							allReviews.push({
								id: `${order._id}-${feedback.date}`,
								orderId: order.orderID,
								customerEmail: order.email,
								orderDate: order.date,
								message: feedback.message,
								date: feedback.date,
								rating: feedback.rating || 5,
								status: feedback.status || "pending",
								productName: order.items?.[0]?.name || "Order Feedback",
							});
						});
				}
			});

			setReviews(allReviews.sort((a, b) => new Date(b.date) - new Date(a.date)));
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching reviews:", err);
			toast.error("Failed to load reviews");
			setIsLoading(false);
		}
	};

	const handleApprove = (reviewId) => {
		const updatedReviews = reviews.map((review) =>
			review.id === reviewId ? { ...review, status: "approved" } : review
		);
		setReviews(updatedReviews);
		toast.success("Review approved!");
	};

	const handleReject = (reviewId) => {
		const updatedReviews = reviews.map((review) =>
			review.id === reviewId ? { ...review, status: "rejected" } : review
		);
		setReviews(updatedReviews);
		toast.success("Review rejected!");
	};

	const handleDelete = (reviewId) => {
		if (window.confirm("Are you sure you want to delete this review?")) {
			const updatedReviews = reviews.filter((review) => review.id !== reviewId);
			setReviews(updatedReviews);
			toast.success("Review deleted!");
		}
	};

	const filteredReviews = reviews.filter((review) => {
		if (filterStatus === "all") return true;
		return review.status === filterStatus;
	});

	const renderStars = (rating) => {
		return Array.from({ length: 5 }, (_, i) => (
			<FaStar key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"} />
		));
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-700 border-green-300";
			case "rejected":
				return "bg-red-100 text-red-700 border-red-300";
			default:
				return "bg-yellow-100 text-yellow-700 border-yellow-300";
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1600px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
								<FaStar className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-yellow-600 bg-clip-text text-transparent">
									Customer Reviews
								</h1>
								<p className="text-secondary/60 font-medium">
									{reviews.length} total reviews
								</p>
							</div>
						</div>

						{/* Stats */}
						<div className="flex gap-4">
							<div className="text-center px-6 py-3 bg-green-100 rounded-xl border-2 border-green-300">
								<p className="text-2xl font-bold text-green-700">
									{reviews.filter((r) => r.status === "approved").length}
								</p>
								<p className="text-xs text-green-600 font-semibold">Approved</p>
							</div>
							<div className="text-center px-6 py-3 bg-yellow-100 rounded-xl border-2 border-yellow-300">
								<p className="text-2xl font-bold text-yellow-700">
									{reviews.filter((r) => r.status === "pending").length}
								</p>
								<p className="text-xs text-yellow-600 font-semibold">Pending</p>
							</div>
							<div className="text-center px-6 py-3 bg-red-100 rounded-xl border-2 border-red-300">
								<p className="text-2xl font-bold text-red-700">
									{reviews.filter((r) => r.status === "rejected").length}
								</p>
								<p className="text-xs text-red-600 font-semibold">Rejected</p>
							</div>
						</div>
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-accent/20">
					<div className="flex gap-4">
						{["all", "pending", "approved", "rejected"].map((status) => (
							<button
								key={status}
								onClick={() => setFilterStatus(status)}
								className={`px-6 py-3 rounded-xl font-semibold transition-all ${
									filterStatus === status
										? "bg-accent text-white shadow-lg"
										: "bg-secondary/10 text-secondary hover:bg-secondary/20"
								}`}
							>
								{status.charAt(0).toUpperCase() + status.slice(1)}
								<span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
									{status === "all"
										? reviews.length
										: reviews.filter((r) => r.status === status).length}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Reviews List */}
				<div className="space-y-4">
					{filteredReviews.length === 0 ? (
						<div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-accent/20">
							<FaStar className="text-6xl text-secondary/30 mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-secondary mb-2">No Reviews Found</h3>
							<p className="text-secondary/60">
								{filterStatus === "all"
									? "No customer reviews yet"
									: `No ${filterStatus} reviews`}
							</p>
						</div>
					) : (
						filteredReviews.map((review) => (
							<div
								key={review.id}
								className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 border-2 border-accent/20 hover:border-accent/40"
							>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										{/* Customer Info */}
										<div className="flex items-center gap-4 mb-4">
											<div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center text-white font-bold text-xl">
												{review.customerEmail.charAt(0).toUpperCase()}
											</div>
											<div>
												<h3 className="font-bold text-secondary text-lg">
													{review.customerEmail}
												</h3>
												<div className="flex items-center gap-3 text-sm text-secondary/60">
													<span>Order #{review.orderId}</span>
													<span>•</span>
													<span>
														{new Date(review.date).toLocaleDateString()}
													</span>
												</div>
											</div>
										</div>

										{/* Product Name */}
										<div className="mb-3">
											<span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
												{review.productName}
											</span>
										</div>

										{/* Rating */}
										<div className="flex items-center gap-2 mb-3">
											{renderStars(review.rating)}
											<span className="ml-2 font-bold text-secondary">
												{review.rating}/5
											</span>
										</div>

										{/* Review Message */}
										<p className="text-secondary/80 leading-relaxed mb-4">
											{review.message}
										</p>

										{/* Status Badge */}
										<span
											className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 ${getStatusColor(
												review.status
											)}`}
										>
											{review.status === "approved" && <FaCheckCircle />}
											{review.status === "rejected" && <FaTimesCircle />}
											{review.status.charAt(0).toUpperCase() +
												review.status.slice(1)}
										</span>
									</div>

									{/* Action Buttons */}
									<div className="flex flex-col gap-2 ml-4">
										<button
											onClick={() => {
												setSelectedReview(review);
												setShowModal(true);
											}}
											className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all"
											title="View Details"
										>
											<FaEye />
										</button>
										{review.status === "pending" && (
											<>
												<button
													onClick={() => handleApprove(review.id)}
													className="p-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-all"
													title="Approve"
												>
													<FaCheckCircle />
												</button>
												<button
													onClick={() => handleReject(review.id)}
													className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all"
													title="Reject"
												>
													<FaTimesCircle />
												</button>
											</>
										)}
										<button
											onClick={() => handleDelete(review.id)}
											className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all"
											title="Delete"
										>
											<FaTrash />
										</button>
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{/* Review Modal */}
				{showModal && selectedReview && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-2 border-accent/20">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-3xl font-bold text-secondary">Review Details</h2>
								<button
									onClick={() => setShowModal(false)}
									className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-700 rounded-full flex items-center justify-center transition-all"
								>
									✕
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Customer</p>
									<p className="text-lg font-semibold text-secondary">
										{selectedReview.customerEmail}
									</p>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Order ID</p>
									<p className="text-lg font-semibold text-secondary">
										#{selectedReview.orderId}
									</p>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Product</p>
									<p className="text-lg font-semibold text-secondary">
										{selectedReview.productName}
									</p>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Rating</p>
									<div className="flex items-center gap-2">
										{renderStars(selectedReview.rating)}
										<span className="ml-2 font-bold text-secondary">
											{selectedReview.rating}/5
										</span>
									</div>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Review</p>
									<p className="text-secondary leading-relaxed bg-secondary/5 p-4 rounded-xl">
										{selectedReview.message}
									</p>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Date</p>
									<p className="text-lg font-semibold text-secondary">
										{new Date(selectedReview.date).toLocaleString()}
									</p>
								</div>

								<div>
									<p className="text-sm font-bold text-secondary/60 mb-1">Status</p>
									<span
										className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold border-2 ${getStatusColor(
											selectedReview.status
										)}`}
									>
										{selectedReview.status === "approved" && <FaCheckCircle />}
										{selectedReview.status === "rejected" && <FaTimesCircle />}
										{selectedReview.status.charAt(0).toUpperCase() +
											selectedReview.status.slice(1)}
									</span>
								</div>
							</div>

							<div className="flex gap-4 mt-8">
								{selectedReview.status === "pending" && (
									<>
										<button
											onClick={() => {
												handleApprove(selectedReview.id);
												setShowModal(false);
											}}
											className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
										>
											Approve Review
										</button>
										<button
											onClick={() => {
												handleReject(selectedReview.id);
												setShowModal(false);
											}}
											className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
										>
											Reject Review
										</button>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
