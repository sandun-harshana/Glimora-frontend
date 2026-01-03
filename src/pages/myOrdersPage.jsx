import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
	FaShoppingBag,
	FaMoneyBillWave,
	FaShippingFast,
	FaBox,
	FaStar,
	FaUndo,
	FaTimes,
	FaEye,
	FaCheckCircle,
	FaCommentDots,
	FaPaperPlane,
	FaTruck,
	FaMapMarkerAlt,
	FaArrowLeft,
} from "react-icons/fa";
import { MdLocalShipping, MdPending } from "react-icons/md";

export default function MyOrdersPage() {
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [selectedTab, setSelectedTab] = useState("all");
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [showReturnModal, setShowReturnModal] = useState(false);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const [returnReason, setReturnReason] = useState("");
	const [feedbackMessage, setFeedbackMessage] = useState("");

	const tabs = [
		{ id: "all", name: "All Orders", icon: FaShoppingBag, color: "purple" },
		{ id: "to-pay", name: "To Pay", icon: FaMoneyBillWave, color: "orange" },
		{ id: "to-ship", name: "To Ship", icon: MdLocalShipping, color: "blue" },
		{ id: "to-receive", name: "To Receive", icon: FaShippingFast, color: "cyan" },
		{ id: "to-review", name: "To Review", icon: FaStar, color: "yellow" },
		{ id: "returns", name: "Returns", icon: FaUndo, color: "pink" },
		{ id: "cancelled", name: "Cancelled", icon: FaTimes, color: "red" },
	];

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setOrders(res.data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching orders:", err);
			toast.error("Failed to load orders");
			setLoading(false);
		}
	};

	const getFilteredOrders = () => {
		switch (selectedTab) {
			case "to-pay":
				return orders.filter((o) => o.paymentStatus === "unpaid");
			case "to-ship":
				return orders.filter((o) => o.shippingStatus === "to-ship" && o.paymentStatus === "paid");
			case "to-receive":
				return orders.filter((o) => o.shippingStatus === "shipped" || o.shippingStatus === "to-receive");
			case "to-review":
				return orders.filter((o) => o.status === "delivered" && o.reviewStatus === "not-reviewed");
			case "returns":
				return orders.filter((o) => o.returnStatus !== "none");
			case "cancelled":
				return orders.filter((o) => o.cancellationStatus !== "none" || o.status === "cancelled");
			default:
				return orders;
		}
	};

	const handleCancelOrder = async () => {
		if (!cancelReason.trim()) {
			toast.error("Please provide a reason for cancellation");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/orders/${selectedOrder.orderID}/cancel`,
				{ reason: cancelReason },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Cancellation request submitted");
			setShowCancelModal(false);
			setCancelReason("");
			fetchOrders();
		} catch (err) {
			console.error("Error cancelling order:", err);
			toast.error(err.response?.data?.message || "Failed to cancel order");
		}
	};

	const handleReturnOrder = async () => {
		if (!returnReason.trim()) {
			toast.error("Please provide a reason for return");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/orders/${selectedOrder.orderID}/return`,
				{ reason: returnReason },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Return request submitted");
			setShowReturnModal(false);
			setReturnReason("");
			fetchOrders();
		} catch (err) {
			console.error("Error requesting return:", err);
			toast.error(err.response?.data?.message || "Failed to request return");
		}
	};

	const handleConfirmReceived = async (orderID) => {
		if (!confirm("Have you received this order?")) {
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/orders/${orderID}/received`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Order confirmed as received");
			fetchOrders();
		} catch (err) {
			console.error("Error confirming receipt:", err);
			toast.error("Failed to confirm receipt");
		}
	};

	const handleSendFeedback = async () => {
		if (!feedbackMessage.trim()) {
			toast.error("Please enter your feedback");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + `/api/orders/${selectedOrder.orderID}/feedback`,
				{ message: feedbackMessage },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Feedback sent successfully");
			setFeedbackMessage("");
			setShowFeedbackModal(false);
			fetchOrders();
		} catch (err) {
			console.error("Error sending feedback:", err);
			toast.error("Failed to send feedback");
		}
	};

	const getStatusBadge = (order) => {
		if (order.cancellationStatus !== "none") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border-2 border-red-300">
					{order.cancellationStatus === "requested" ? "Cancellation Requested" : "Cancelled"}
				</span>
			);
		}
		if (order.returnStatus !== "none") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border-2 border-pink-300">
					{order.returnStatus === "requested" ? "Return Requested" : "Returned"}
				</span>
			);
		}
		if (order.status === "delivered") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border-2 border-green-300">
					Delivered
				</span>
			);
		}
		if (order.shippingStatus === "shipped") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700 border-2 border-cyan-300">
					Shipped
				</span>
			);
		}
		if (order.paymentStatus === "unpaid") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border-2 border-orange-300">
					Awaiting Payment
				</span>
			);
		}
		return (
			<span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border-2 border-blue-300">
				Processing
			</span>
		);
	};

	const filteredOrders = getFilteredOrders();

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-7xl mx-auto">
				{/* Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="mb-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-secondary rounded-xl shadow-md hover:shadow-lg transition-all"
				>
					<FaArrowLeft />
					<span className="font-semibold">Back</span>
				</button>

				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
							<FaShoppingBag className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
								My Orders
							</h1>
							<p className="text-secondary/60 font-medium">
								Track and manage your orders
							</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = selectedTab === tab.id;
						const count =
							tab.id === "all"
								? orders.length
								: tab.id === "to-pay"
								? orders.filter((o) => o.paymentStatus === "unpaid").length
								: tab.id === "to-ship"
								? orders.filter((o) => o.shippingStatus === "to-ship" && o.paymentStatus === "paid").length
								: tab.id === "to-receive"
								? orders.filter((o) => o.shippingStatus === "shipped" || o.shippingStatus === "to-receive").length
								: tab.id === "to-review"
								? orders.filter((o) => o.status === "delivered" && o.reviewStatus === "not-reviewed").length
								: tab.id === "returns"
								? orders.filter((o) => o.returnStatus !== "none").length
								: orders.filter((o) => o.cancellationStatus !== "none" || o.status === "cancelled").length;

						return (
							<button
								key={tab.id}
								onClick={() => setSelectedTab(tab.id)}
								className={`group p-4 rounded-2xl border-2 transition-all ${
									isActive
										? `bg-${tab.color}-100 border-${tab.color}-400 shadow-lg scale-105`
										: "bg-white border-secondary/10 hover:border-secondary/30 hover:shadow-md"
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<Icon
										className={`text-2xl ${
											isActive ? `text-${tab.color}-600` : "text-secondary/60"
										}`}
									/>
									<span
										className={`font-semibold text-xs text-center ${
											isActive ? `text-${tab.color}-700` : "text-secondary/70"
										}`}
									>
										{tab.name}
									</span>
									<span
										className={`text-xs px-2 py-1 rounded-full font-bold ${
											isActive
												? `bg-${tab.color}-200 text-${tab.color}-800`
												: "bg-secondary/10 text-secondary/60"
										}`}
									>
										{count}
									</span>
								</div>
							</button>
						);
					})}
				</div>

				{/* Orders List */}
				<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
					{filteredOrders.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
								<FaShoppingBag className="text-5xl text-accent" />
							</div>
							<p className="text-secondary/80 font-bold text-lg mb-2">No orders found</p>
							<p className="text-secondary/50 text-sm">
								Start shopping to see your orders here
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredOrders.map((order) => (
								<div
									key={order._id}
									className="group p-6 rounded-2xl border-2 border-secondary/10 hover:border-accent/30 hover:shadow-lg transition-all bg-gradient-to-r from-white to-primary/5"
								>
									<div className="flex items-start justify-between mb-4">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
												<FaBox className="text-accent text-xl" />
											</div>
											<div>
												<p className="font-bold text-secondary text-lg">
													Order #{order.orderID}
												</p>
												<p className="text-xs text-secondary/60">
													{new Date(order.date).toLocaleDateString("en-US", {
														month: "long",
														day: "numeric",
														year: "numeric",
													})}
												</p>
											</div>
										</div>
										<div className="flex flex-col items-end gap-2">
											{getStatusBadge(order)}
											{/* Payment Status Badge */}
											<span className={`px-3 py-1 rounded-full text-xs font-bold ${
												order.paymentStatus === "paid" 
													? "bg-green-100 text-green-700"
													: order.paymentStatus === "pending"
													? "bg-yellow-100 text-yellow-700"
													: "bg-red-100 text-red-700"
											}`}>
												{order.paymentStatus === "paid" ? "💳 Paid" : 
												 order.paymentStatus === "pending" ? "⏳ Payment Pending" : 
												 "💵 Unpaid"}
											</span>
										</div>
									</div>

									{/* Order Items */}
									<div className="flex items-center gap-4 mb-4">
										{order.items.slice(0, 3).map((item, idx) => (
											<div
												key={idx}
												className="w-16 h-16 rounded-lg overflow-hidden border-2 border-secondary/10"
											>
												<img
													src={item.image}
													alt={item.name}
													className="w-full h-full object-cover"
												/>
											</div>
										))}
										{order.items.length > 3 && (
											<div className="w-16 h-16 rounded-lg bg-secondary/10 flex items-center justify-center border-2 border-secondary/20">
												<span className="text-xs font-bold text-secondary/60">
													+{order.items.length - 3}
												</span>
											</div>
										)}
										<div className="flex-1">
											<p className="text-sm text-secondary/80 font-medium">
												{order.items.length} item(s)
											</p>
											<p className="text-lg font-bold text-accent">
												LKR {order.total.toLocaleString()}
											</p>
										</div>
									</div>

									{/* Tracking Badge */}
									{order.trackingInfo?.trackingNumber && (
										<div className="mb-4 p-3 bg-blue-50 rounded-xl border-2 border-blue-200">
											<div className="flex items-center gap-2 text-blue-700">
												<FaTruck />
												<div className="flex-1">
													<span className="text-sm font-semibold">
														Tracking: {order.trackingInfo.trackingNumber}
													</span>
													{order.trackingInfo.courierService && (
														<p className="text-xs text-blue-600">
															via {order.trackingInfo.courierService}
														</p>
													)}
												</div>
												{order.trackingInfo.trackingUpdates && order.trackingInfo.trackingUpdates.length > 0 && (
													<span className="text-xs px-2 py-1 bg-blue-200 rounded-full font-bold">
														{order.trackingInfo.trackingUpdates.length} updates
													</span>
												)}
											</div>
										</div>
									)}

									{/* Action Buttons */}
									<div className="flex items-center gap-3 flex-wrap">
										<button
											onClick={() => {
												setSelectedOrder(order);
												setShowDetailModal(true);
											}}
											className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl font-semibold transition-all flex items-center gap-2"
										>
											<FaEye />
											View Details
										</button>

										<button
											onClick={() => {
												setSelectedOrder(order);
												setShowFeedbackModal(true);
											}}
											className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition-all flex items-center gap-2"
										>
											<FaCommentDots />
											{order.customerFeedback && order.customerFeedback.length > 0 ? 'View' : 'Send'} Feedback
										</button>

										{order.paymentStatus === "unpaid" && order.cancellationStatus === "none" && (
											<button
												onClick={() => toast.info("Payment feature coming soon")}
												className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-xl font-semibold transition-all flex items-center gap-2"
											>
												<FaMoneyBillWave />
												Pay Now
											</button>
										)}

										{(order.shippingStatus === "shipped" || order.shippingStatus === "to-receive") &&
											order.shippingStatus !== "received" && (
												<button
													onClick={() => handleConfirmReceived(order.orderID)}
													className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold transition-all flex items-center gap-2"
												>
													<FaCheckCircle />
													Confirm Received
												</button>
											)}

										{order.status === "delivered" && order.reviewStatus === "not-reviewed" && (
											<button
												onClick={() => toast.info("Review feature coming soon")}
												className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-xl font-semibold transition-all flex items-center gap-2"
											>
												<FaStar />
												Write Review
											</button>
										)}

										{order.status === "delivered" && order.returnStatus === "none" && (
											<button
												onClick={() => {
													setSelectedOrder(order);
													setShowReturnModal(true);
												}}
												className="px-4 py-2 bg-pink-100 hover:bg-pink-200 text-pink-700 rounded-xl font-semibold transition-all flex items-center gap-2"
											>
												<FaUndo />
												Return
											</button>
										)}

										{order.status !== "delivered" &&
											order.cancellationStatus === "none" &&
											order.returnStatus === "none" && (
												<button
													onClick={() => {
														setSelectedOrder(order);
														setShowCancelModal(true);
													}}
													className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-all flex items-center gap-2"
												>
													<FaTimes />
													Cancel
												</button>
											)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Order Detail Modal */}
			{showDetailModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-3xl font-bold text-secondary">
									Order #{selectedOrder.orderID}
								</h2>
								<button
									onClick={() => setShowDetailModal(false)}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							{/* Status */}
							<div className="mb-6">{getStatusBadge(selectedOrder)}</div>

							{/* Customer Info */}
							<div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-6 border-2 border-primary/20">
								<h3 className="font-bold text-secondary mb-4">Delivery Information</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
									<div>
										<p className="text-secondary/60">Customer Name</p>
										<p className="font-semibold text-secondary">
											{selectedOrder.customerName}
										</p>
									</div>
									<div>
										<p className="text-secondary/60">Email</p>
										<p className="font-semibold text-secondary">{selectedOrder.email}</p>
									</div>
									<div>
										<p className="text-secondary/60">Phone</p>
										<p className="font-semibold text-secondary">{selectedOrder.phone}</p>
									</div>
									<div>
										<p className="text-secondary/60">Order Date</p>
										<p className="font-semibold text-secondary">
											{new Date(selectedOrder.date).toLocaleDateString()}
										</p>
									</div>
									<div className="md:col-span-2">
										<p className="text-secondary/60">Delivery Address</p>
										<p className="font-semibold text-secondary">
											{selectedOrder.address}
										</p>
									</div>
								</div>
							</div>

							{/* Order Items */}
							<div className="mb-6">
								<h3 className="font-bold text-secondary mb-4">Order Items</h3>
								<div className="space-y-3">
									{selectedOrder.items.map((item, idx) => (
										<div
											key={idx}
											className="flex items-center gap-4 p-4 rounded-xl border-2 border-secondary/10"
										>
											<img
												src={item.image}
												alt={item.name}
												className="w-20 h-20 object-cover rounded-lg"
											/>
											<div className="flex-1">
												<p className="font-bold text-secondary">{item.name}</p>
												<p className="text-sm text-secondary/60">
													Qty: {item.quantity}
												</p>
											</div>
											<p className="font-bold text-accent">
												LKR {(item.price * item.quantity).toLocaleString()}
											</p>
										</div>
									))}
								</div>
							</div>

							{/* Total */}
							<div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border-2 border-accent/20">
								<div className="flex items-center justify-between">
									<span className="text-lg font-bold text-secondary">Total Amount</span>
									<span className="text-2xl font-bold text-accent">
										LKR {selectedOrder.total.toLocaleString()}
									</span>
								</div>
							</div>

							{/* Payment Information */}
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 mt-4">
								<h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
									<span>💳</span> Payment Information
								</h3>
								
								{/* Payment Status */}
								<div className="mb-4">
									<span className="text-sm font-medium text-gray-600">Payment Status:</span>
									<span className={`ml-3 px-4 py-1.5 rounded-full text-sm font-bold ${
										selectedOrder.paymentStatus === "paid" 
											? "bg-green-100 text-green-700 border-2 border-green-300"
											: selectedOrder.paymentStatus === "pending"
											? "bg-yellow-100 text-yellow-700 border-2 border-yellow-300"
											: "bg-red-100 text-red-700 border-2 border-red-300"
									}`}>
										{selectedOrder.paymentStatus === "paid" ? "✓ Paid" : 
										 selectedOrder.paymentStatus === "pending" ? "⏳ Pending Verification" : 
										 "✗ Unpaid"}
									</span>
								</div>

								{/* Payment Method */}
								<div className="mb-4">
									<span className="text-sm font-medium text-gray-600">Payment Method:</span>
									<span className="ml-3 px-3 py-1 bg-white rounded-lg text-sm font-semibold text-secondary border border-gray-300">
										{selectedOrder.paymentMethod === "cash-on-delivery" && "💵 Cash on Delivery"}
										{selectedOrder.paymentMethod === "bank-transfer" && "🏦 Bank Transfer"}
										{selectedOrder.paymentMethod === "card" && "💳 Card Payment"}
										{selectedOrder.paymentMethod === "mobile-payment" && "📱 Mobile Payment"}
									</span>
								</div>

								{/* Payment Details (if not COD) */}
								{selectedOrder.paymentMethod !== "cash-on-delivery" && selectedOrder.paymentDetails && (
									<div className="bg-white rounded-xl p-4 border border-gray-200 mt-4">
										<h4 className="font-bold text-secondary mb-3">Your Payment Details</h4>
										
										{selectedOrder.paymentDetails.transactionId && (
											<div className="mb-2">
												<span className="text-sm font-medium text-gray-600">Transaction ID:</span>
												<span className="ml-2 text-sm font-semibold text-secondary">
													{selectedOrder.paymentDetails.transactionId}
												</span>
											</div>
										)}

										{selectedOrder.paymentDetails.bankName && (
											<div className="mb-2">
												<span className="text-sm font-medium text-gray-600">Bank Name:</span>
												<span className="ml-2 text-sm font-semibold text-secondary">
													{selectedOrder.paymentDetails.bankName}
												</span>
											</div>
										)}

										{selectedOrder.paymentDetails.accountNumber && (
											<div className="mb-2">
												<span className="text-sm font-medium text-gray-600">Account Number (Last 4):</span>
												<span className="ml-2 text-sm font-semibold text-secondary">
													****{selectedOrder.paymentDetails.accountNumber}
												</span>
											</div>
										)}

										{selectedOrder.paymentDetails.paymentDate && (
											<div className="mb-2">
												<span className="text-sm font-medium text-gray-600">Payment Date:</span>
												<span className="ml-2 text-sm font-semibold text-secondary">
													{new Date(selectedOrder.paymentDetails.paymentDate).toLocaleDateString()}
												</span>
											</div>
										)}

										{/* Payment Proof */}
										{selectedOrder.paymentDetails.paymentProof && (
											<div className="mt-4">
												<p className="text-sm font-medium text-gray-600 mb-2">Payment Proof:</p>
												<img 
													src={selectedOrder.paymentDetails.paymentProof} 
													alt="Payment Proof"
													className="w-full max-w-md rounded-lg border-2 border-gray-300 cursor-pointer hover:border-accent transition-all"
													onClick={() => window.open(selectedOrder.paymentDetails.paymentProof, '_blank')}
													title="Click to view full size"
												/>
												<p className="text-xs text-gray-500 mt-1">Click image to view full size</p>
											</div>
										)}
									</div>
								)}

								{/* Pending Payment Note */}
								{selectedOrder.paymentStatus === "pending" && (
									<div className="mt-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
										<p className="text-sm text-yellow-800">
											<strong>Note:</strong> Your payment is currently being verified by our team. 
											Once verified, your order will be processed for shipment.
										</p>
									</div>
								)}

								{/* COD Note */}
								{selectedOrder.paymentMethod === "cash-on-delivery" && selectedOrder.paymentStatus === "unpaid" && (
									<div className="mt-4 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
										<p className="text-sm text-blue-800">
											<strong>Note:</strong> You will pay for this order when it is delivered to you.
										</p>
									</div>
								)}
							</div>

							{/* Tracking Information */}
							{selectedOrder.trackingInfo?.trackingNumber && (
								<div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 mt-4">
									<h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
										<FaTruck className="text-blue-600" /> Track Your Order
									</h3>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
										<div>
											<span className="text-sm font-medium text-gray-600">Tracking Number:</span>
											<p className="font-semibold text-secondary">{selectedOrder.trackingInfo.trackingNumber}</p>
										</div>
										<div>
											<span className="text-sm font-medium text-gray-600">Courier Service:</span>
											<p className="font-semibold text-secondary">{selectedOrder.trackingInfo.courierService}</p>
										</div>
										{selectedOrder.trackingInfo.estimatedDelivery && (
											<div>
												<span className="text-sm font-medium text-gray-600">Estimated Delivery:</span>
												<p className="font-semibold text-green-600">
													{new Date(selectedOrder.trackingInfo.estimatedDelivery).toLocaleDateString('en-US', {
														weekday: 'short',
														month: 'short',
														day: 'numeric',
														year: 'numeric'
													})}
												</p>
											</div>
										)}
										{selectedOrder.trackingInfo.trackingUrl && (
											<div className="md:col-span-2">
												<a 
													href={selectedOrder.trackingInfo.trackingUrl} 
													target="_blank" 
													rel="noopener noreferrer"
													className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
												>
													<FaTruck /> Track Online
												</a>
											</div>
										)}
									</div>

									{/* Tracking Timeline */}
									{selectedOrder.trackingInfo.trackingUpdates && selectedOrder.trackingInfo.trackingUpdates.length > 0 && (
										<div className="border-t-2 border-blue-200 pt-4">
											<h4 className="font-bold text-secondary mb-4">Tracking History</h4>
											<div className="relative">
												{/* Timeline Line */}
												<div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200"></div>
												
												<div className="space-y-4">
													{selectedOrder.trackingInfo.trackingUpdates.slice().reverse().map((update, idx) => (
														<div key={idx} className="relative flex items-start gap-4 pl-10">
															{/* Timeline Dot */}
															<div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
																<FaMapMarkerAlt className="text-white text-sm" />
															</div>
															
															{/* Update Content */}
															<div className="flex-1 bg-white rounded-xl p-4 border-2 border-blue-100 shadow-sm">
																<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
																	<span className="font-bold text-blue-700">{update.status}</span>
																	<span className="text-xs text-secondary/60">
																		{new Date(update.timestamp).toLocaleString('en-US', {
																			month: 'short',
																			day: 'numeric',
																			hour: '2-digit',
																			minute: '2-digit'
																		})}
																	</span>
																</div>
																{update.location && (
																	<p className="text-sm text-blue-600 mb-1">📍 {update.location}</p>
																)}
																<p className="text-sm text-secondary">{update.description}</p>
															</div>
														</div>
													))}
												</div>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Cancel Modal */}
			{showCancelModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
						<h2 className="text-2xl font-bold text-secondary mb-4">Cancel Order</h2>
						<p className="text-secondary/60 mb-6">
							Please provide a reason for cancelling order #{selectedOrder.orderID}
						</p>
						<textarea
							value={cancelReason}
							onChange={(e) => setCancelReason(e.target.value)}
							placeholder="Enter cancellation reason..."
							rows={4}
							className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none mb-6"
						></textarea>
						<div className="flex gap-4">
							<button
								onClick={handleCancelOrder}
								className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all"
							>
								Submit Cancellation
							</button>
							<button
								onClick={() => {
									setShowCancelModal(false);
									setCancelReason("");
								}}
								className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-semibold transition-all"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Return Modal */}
			{showReturnModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8">
						<h2 className="text-2xl font-bold text-secondary mb-4">Return Order</h2>
						<p className="text-secondary/60 mb-6">
							Please provide a reason for returning order #{selectedOrder.orderID}
						</p>
						<textarea
							value={returnReason}
							onChange={(e) => setReturnReason(e.target.value)}
							placeholder="Enter return reason..."
							rows={4}
							className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none mb-6"
						></textarea>
						<div className="flex gap-4">
							<button
								onClick={handleReturnOrder}
								className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold transition-all"
							>
								Submit Return Request
							</button>
							<button
								onClick={() => {
									setShowReturnModal(false);
									setReturnReason("");
								}}
								className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-semibold transition-all"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Feedback Modal */}
			{showFeedbackModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-2xl font-bold text-secondary">
								Order Feedback - #{selectedOrder.orderID}
							</h2>
							<button
								onClick={() => {
									setShowFeedbackModal(false);
									setFeedbackMessage("");
								}}
								className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
							>
								<FaTimes />
							</button>
						</div>

						{/* Existing Feedback Thread */}
						{selectedOrder.customerFeedback && selectedOrder.customerFeedback.length > 0 && (
							<div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
								<h3 className="font-bold text-secondary mb-4">Conversation History</h3>
								{selectedOrder.customerFeedback.map((feedback, idx) => (
									<div
										key={idx}
										className={`p-4 rounded-xl ${
											feedback.isAdmin
												? "bg-blue-50 border-2 border-blue-200 ml-8"
												: "bg-purple-50 border-2 border-purple-200 mr-8"
										}`}
									>
										<div className="flex items-start gap-3">
											<div
												className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
													feedback.isAdmin ? "bg-blue-500" : "bg-purple-500"
												}`}
											>
												{feedback.isAdmin ? "A" : "You"}
											</div>
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-1">
													<span className="font-bold text-sm">
														{feedback.isAdmin ? "Admin" : "You"}
													</span>
													<span className="text-xs text-secondary/60">
														{new Date(feedback.date).toLocaleString()}
													</span>
												</div>
												<p className="text-secondary">{feedback.message}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						)}

						{/* Send New Feedback */}
						<div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border-2 border-accent/20">
							<h3 className="font-bold text-secondary mb-4">
								{selectedOrder.customerFeedback && selectedOrder.customerFeedback.length > 0
									? "Send Another Message"
									: "Send Feedback"}
							</h3>
							<textarea
								value={feedbackMessage}
								onChange={(e) => setFeedbackMessage(e.target.value)}
								placeholder="Share your feedback, questions, or concerns about this order..."
								rows={4}
								className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none mb-4"
							></textarea>
							<button
								onClick={handleSendFeedback}
								className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
							>
								<FaPaperPlane />
								Send Feedback
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
