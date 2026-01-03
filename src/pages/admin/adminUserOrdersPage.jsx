import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
	FaShoppingBag,
	FaSearch,
	FaBox,
	FaCheckCircle,
	FaTimes,
	FaUndo,
	FaCommentDots,
	FaPaperPlane,
	FaEye,
	FaFilter,
	FaTruck,
	FaMapMarkerAlt,
	FaPlus,
} from "react-icons/fa";
import { MdPending } from "react-icons/md";

export default function AdminUserOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [filteredOrders, setFilteredOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showDetailModal, setShowDetailModal] = useState(false);
	const [showFeedbackModal, setShowFeedbackModal] = useState(false);
	const [showTrackingModal, setShowTrackingModal] = useState(false);
	const [showTrackingUpdateModal, setShowTrackingUpdateModal] = useState(false);
	const [adminResponse, setAdminResponse] = useState("");
	const [trackingInfo, setTrackingInfo] = useState({
		trackingNumber: "",
		courierService: "",
		estimatedDelivery: "",
		trackingUrl: ""
	});
	const [trackingUpdate, setTrackingUpdate] = useState({
		status: "",
		location: "",
		description: ""
	});

	useEffect(() => {
		fetchOrders();
	}, []);

	const filterOrders = useCallback(() => {
		let filtered = [...orders];

		// Search filter
		if (searchTerm) {
			filtered = filtered.filter(
				(order) =>
					order.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// Status filter
		if (statusFilter !== "all") {
			if (statusFilter === "has-feedback") {
				filtered = filtered.filter((o) => o.customerFeedback && o.customerFeedback.length > 0);
			} else if (statusFilter === "cancellation") {
				filtered = filtered.filter((o) => o.cancellationStatus !== "none");
			} else if (statusFilter === "return") {
				filtered = filtered.filter((o) => o.returnStatus !== "none");
			} else {
				filtered = filtered.filter((o) => o.status === statusFilter);
			}
		}

		setFilteredOrders(filtered);
	}, [orders, searchTerm, statusFilter]);

	useEffect(() => {
		filterOrders();
	}, [filterOrders]);

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

	const handleStatusUpdate = async (orderID, newStatus) => {
		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/orders/status/${orderID}`,
				{ status: newStatus },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Order status updated");
			
			// Dispatch event when order is marked as delivered to update user's reward points
			if (newStatus === "delivered") {
				window.dispatchEvent(new Event('order-delivered'));
			}
			
			fetchOrders();
		} catch (err) {
			console.error("Error updating status:", err);
			toast.error("Failed to update status");
		}
	};

	const handleAdminResponse = async () => {
		if (!adminResponse.trim()) {
			toast.error("Please enter a response");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + `/api/orders/${selectedOrder.orderID}/admin-response`,
				{ message: adminResponse },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Response sent successfully");
			setAdminResponse("");
			setShowFeedbackModal(false);
			fetchOrders();
		} catch (err) {
			console.error("Error sending response:", err);
			toast.error("Failed to send response");
		}
	};

	const handleUpdateTracking = async () => {
		if (!trackingInfo.trackingNumber.trim()) {
			toast.error("Please enter a tracking number");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/orders/tracking/${selectedOrder.orderID}`,
				trackingInfo,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Tracking information updated successfully");
			setShowTrackingModal(false);
			setTrackingInfo({
				trackingNumber: "",
				courierService: "",
				estimatedDelivery: "",
				trackingUrl: ""
			});
			fetchOrders();
		} catch (err) {
			console.error("Error updating tracking:", err);
			toast.error("Failed to update tracking information");
		}
	};

	const handleAddTrackingUpdate = async () => {
		if (!trackingUpdate.status.trim() || !trackingUpdate.description.trim()) {
			toast.error("Please fill in status and description");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + `/api/orders/tracking/${selectedOrder.orderID}/update`,
				trackingUpdate,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			toast.success("Tracking update added successfully");
			setShowTrackingUpdateModal(false);
			setTrackingUpdate({
				status: "",
				location: "",
				description: ""
			});
			fetchOrders();
		} catch (err) {
			console.error("Error adding tracking update:", err);
			toast.error("Failed to add tracking update");
		}
	};

	const getStatusBadge = (order) => {
		if (order.cancellationStatus !== "none") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
					Cancellation: {order.cancellationStatus}
				</span>
			);
		}
		if (order.returnStatus !== "none") {
			return (
				<span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700">
					Return: {order.returnStatus}
				</span>
			);
		}
		const statusColors = {
			pending: "bg-orange-100 text-orange-700",
			delivered: "bg-green-100 text-green-700",
			cancelled: "bg-red-100 text-red-700",
			completed: "bg-blue-100 text-blue-700",
		};
		return (
			<span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
				{order.status}
			</span>
		);
	};

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
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg">
							<FaShoppingBag className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
								User Orders Management
							</h1>
							<p className="text-secondary/60 font-medium">
								View and manage all customer orders
							</p>
						</div>
					</div>

					{/* Search and Filter */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="relative">
							<FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary/40" />
							<input
								type="text"
								placeholder="Search by Order ID, Customer Name, or Email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
							/>
						</div>
						<div className="relative">
							<FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary/40" />
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all appearance-none bg-white"
							>
								<option value="all">All Orders</option>
								<option value="pending">Pending</option>
								<option value="delivered">Delivered</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
								<option value="has-feedback">Has Feedback</option>
								<option value="cancellation">Cancellation Requests</option>
								<option value="return">Return Requests</option>
							</select>
						</div>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200">
							<p className="text-xs text-blue-600 font-semibold mb-1">Total Orders</p>
							<p className="text-2xl font-bold text-blue-700">{orders.length}</p>
						</div>
						<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200">
							<p className="text-xs text-green-600 font-semibold mb-1">Delivered</p>
							<p className="text-2xl font-bold text-green-700">
								{orders.filter((o) => o.status === "delivered").length}
							</p>
						</div>
						<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border-2 border-orange-200">
							<p className="text-xs text-orange-600 font-semibold mb-1">Pending</p>
							<p className="text-2xl font-bold text-orange-700">
								{orders.filter((o) => o.status === "pending").length}
							</p>
						</div>
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
							<p className="text-xs text-purple-600 font-semibold mb-1">With Feedback</p>
							<p className="text-2xl font-bold text-purple-700">
								{orders.filter((o) => o.customerFeedback && o.customerFeedback.length > 0).length}
							</p>
						</div>
					</div>
				</div>

				{/* Orders Table */}
				<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
					{filteredOrders.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
								<FaShoppingBag className="text-5xl text-accent" />
							</div>
							<p className="text-secondary/80 font-bold text-lg mb-2">No orders found</p>
							<p className="text-secondary/50 text-sm">
								Try adjusting your search or filter criteria
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
													{order.orderID}
												</p>
												<p className="text-sm text-secondary/80 font-medium">
													{order.customerName}
												</p>
												<p className="text-xs text-secondary/60">{order.email}</p>
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
											<p className="text-xs text-secondary/60">
												{new Date(order.date).toLocaleDateString()}
											</p>
										</div>
									</div>

									{/* Order Items Preview */}
									<div className="flex items-center gap-3 mb-4">
										{order.items.slice(0, 3).map((item, idx) => (
											<div
												key={idx}
												className="w-12 h-12 rounded-lg overflow-hidden border-2 border-secondary/10"
											>
												<img
													src={item.image}
													alt={item.name}
													className="w-full h-full object-cover"
												/>
											</div>
										))}
										{order.items.length > 3 && (
											<div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-xs font-bold text-secondary/60">
												+{order.items.length - 3}
											</div>
										)}
										<div className="flex-1">
											<p className="text-sm text-secondary/80">
												{order.items.length} item(s)
											</p>
											<p className="text-lg font-bold text-accent">
												LKR {order.total.toLocaleString()}
											</p>
										</div>
									</div>

									{/* Feedback Badge */}
									{order.customerFeedback && order.customerFeedback.length > 0 && (
										<div className="mb-4 p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
											<div className="flex items-center gap-2 text-purple-700">
												<FaCommentDots />
												<span className="text-sm font-semibold">
													{order.customerFeedback.length} feedback message(s)
												</span>
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

										{order.customerFeedback && order.customerFeedback.length > 0 && (
											<button
												onClick={() => {
													setSelectedOrder(order);
													setShowFeedbackModal(true);
												}}
												className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition-all flex items-center gap-2"
											>
												<FaCommentDots />
												View Feedback
											</button>
										)}

										<button
											onClick={() => {
												setSelectedOrder(order);
												setTrackingInfo({
													trackingNumber: order.trackingInfo?.trackingNumber || "",
													courierService: order.trackingInfo?.courierService || "",
													estimatedDelivery: order.trackingInfo?.estimatedDelivery ? 
														new Date(order.trackingInfo.estimatedDelivery).toISOString().split('T')[0] : "",
													trackingUrl: order.trackingInfo?.trackingUrl || ""
												});
												setShowTrackingModal(true);
											}}
											className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all flex items-center gap-2"
										>
											<FaTruck />
											{order.trackingInfo?.trackingNumber ? "Update" : "Add"} Tracking
										</button>

										{order.status === "pending" && (
											<>
												<button
													onClick={() => handleStatusUpdate(order.orderID, "delivered")}
													className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl font-semibold transition-all flex items-center gap-2"
												>
													<FaCheckCircle />
													Mark Delivered
												</button>
												<button
													onClick={() => handleStatusUpdate(order.orderID, "cancelled")}
													className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-semibold transition-all flex items-center gap-2"
												>
													<FaTimes />
													Cancel
												</button>
											</>
										)}

										{order.status === "delivered" && (
											<button
												onClick={() => handleStatusUpdate(order.orderID, "completed")}
												className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all flex items-center gap-2"
											>
												<FaCheckCircle />
												Mark Completed
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
								<h3 className="font-bold text-secondary mb-4">Customer Information</h3>
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
							<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
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
										<h4 className="font-bold text-secondary mb-3">Payment Details</h4>
										
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

										{selectedOrder.paymentDetails.paidAmount && (
											<div className="mb-2">
												<span className="text-sm font-medium text-gray-600">Paid Amount:</span>
												<span className="ml-2 text-sm font-semibold text-green-600">
													LKR {selectedOrder.paymentDetails.paidAmount.toLocaleString()}
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

								{/* Admin Actions for Pending Payments */}
								{selectedOrder.paymentStatus === "pending" && (
									<div className="mt-4 flex gap-3">
										<button
											onClick={async () => {
												if (window.confirm(`Mark payment as PAID for order #${selectedOrder.orderID}?`)) {
													try {
														const token = localStorage.getItem("token");
														await axios.put(
															`http://localhost:3001/api/orders/payment-status/${selectedOrder._id}`,
															{ paymentStatus: "paid" },
															{ headers: { Authorization: `Bearer ${token}` } }
														);
														toast.success("Payment marked as paid!");
														// Refresh orders
														await fetchOrders();
														// Update selected order from refreshed data
														const updatedOrder = orders.find(o => o._id === selectedOrder._id);
														if (updatedOrder) setSelectedOrder(updatedOrder);
													} catch (error) {
														toast.error(error.response?.data?.message || "Failed to update payment status");
													}
												}
											}}
											className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
										>
											✓ Mark as Paid
										</button>
										<button
											onClick={async () => {
												if (window.confirm(`Mark payment as UNPAID for order #${selectedOrder.orderID}?`)) {
													try {
														const token = localStorage.getItem("token");
														await axios.put(
															`http://localhost:3001/api/orders/payment-status/${selectedOrder._id}`,
															{ paymentStatus: "unpaid" },
															{ headers: { Authorization: `Bearer ${token}` } }
														);
														toast.success("Payment marked as unpaid");
														// Refresh orders
														await fetchOrders();
														// Update selected order from refreshed data
														const updatedOrder = orders.find(o => o._id === selectedOrder._id);
														if (updatedOrder) setSelectedOrder(updatedOrder);
													} catch (error) {
														toast.error(error.response?.data?.message || "Failed to update payment status");
													}
												}
											}}
											className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
										>
											✗ Mark as Unpaid
										</button>
									</div>
								)}
							</div>

			{/* Tracking Information Display */}
							{selectedOrder.trackingInfo?.trackingNumber && (
								<div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200 mt-4">
									<h3 className="text-lg font-bold text-secondary mb-4 flex items-center gap-2">
										<FaTruck className="text-blue-600" /> Tracking Information
									</h3>
									
									<div className="grid grid-cols-2 gap-4 mb-4">
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
												<p className="font-semibold text-secondary">
													{new Date(selectedOrder.trackingInfo.estimatedDelivery).toLocaleDateString()}
												</p>
											</div>
										)}
										{selectedOrder.trackingInfo.trackingUrl && (
											<div>
												<span className="text-sm font-medium text-gray-600">Track Online:</span>
												<a 
													href={selectedOrder.trackingInfo.trackingUrl} 
													target="_blank" 
													rel="noopener noreferrer"
													className="font-semibold text-blue-600 hover:text-blue-700 underline"
												>
													Open Tracking Page
												</a>
											</div>
										)}
									</div>

									{selectedOrder.trackingInfo.trackingUpdates && selectedOrder.trackingInfo.trackingUpdates.length > 0 && (
										<div className="border-t-2 border-blue-200 pt-4">
											<h4 className="font-bold text-secondary mb-3">Tracking History</h4>
											<div className="space-y-3 max-h-48 overflow-y-auto">
												{selectedOrder.trackingInfo.trackingUpdates.slice().reverse().map((update, idx) => (
													<div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-100">
														<FaMapMarkerAlt className="text-blue-600 mt-1" />
														<div className="flex-1">
															<div className="flex items-center gap-2 mb-1">
																<span className="font-bold text-sm text-blue-700">{update.status}</span>
																{update.location && (
																	<span className="text-xs text-blue-600">• {update.location}</span>
																)}
															</div>
															<p className="text-xs text-secondary">{update.description}</p>
															<p className="text-xs text-secondary/60 mt-1">
																{new Date(update.timestamp).toLocaleString()}
															</p>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}

							{/* Cancellation/Return Info */}
							{selectedOrder.cancellationStatus !== "none" && (
								<div className="mt-6 p-4 bg-red-50 rounded-xl border-2 border-red-200">
									<h3 className="font-bold text-red-700 mb-2">Cancellation Request</h3>
									<p className="text-sm text-red-600">
										Status: {selectedOrder.cancellationStatus}
									</p>
									<p className="text-sm text-red-600 mt-2">
										Reason: {selectedOrder.cancellationReason || "Not provided"}
									</p>
								</div>
							)}

							{selectedOrder.returnStatus !== "none" && (
								<div className="mt-6 p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
									<h3 className="font-bold text-pink-700 mb-2">Return Request</h3>
									<p className="text-sm text-pink-600">
										Status: {selectedOrder.returnStatus}
									</p>
									<p className="text-sm text-pink-600 mt-2">
										Reason: {selectedOrder.returnReason || "Not provided"}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Feedback Modal */}
			{showFeedbackModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-secondary">
									Order Feedback - #{selectedOrder.orderID}
								</h2>
								<button
									onClick={() => {
										setShowFeedbackModal(false);
										setAdminResponse("");
									}}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							{/* Feedback Thread */}
							<div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
								{selectedOrder.customerFeedback && selectedOrder.customerFeedback.length > 0 ? (
									selectedOrder.customerFeedback.map((feedback, idx) => (
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
													{feedback.isAdmin ? "A" : "C"}
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="font-bold text-sm">
															{feedback.isAdmin ? "Admin" : "Customer"}
														</span>
														<span className="text-xs text-secondary/60">
															{new Date(feedback.date).toLocaleString()}
														</span>
													</div>
													<p className="text-secondary">{feedback.message}</p>
												</div>
											</div>
										</div>
									))
								) : (
									<p className="text-center text-secondary/60">No feedback yet</p>
								)}
							</div>

							{/* Admin Response Form */}
							<div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-6 border-2 border-accent/20">
								<h3 className="font-bold text-secondary mb-4">Send Response</h3>
								<textarea
									value={adminResponse}
									onChange={(e) => setAdminResponse(e.target.value)}
									placeholder="Type your response to the customer..."
									rows={4}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none mb-4"
								></textarea>
								<button
									onClick={handleAdminResponse}
									className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
								>
									<FaPaperPlane />
									Send Response
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Tracking Information Modal */}
			{showTrackingModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-secondary flex items-center gap-2">
									<FaTruck className="text-accent" />
									Tracking Information - #{selectedOrder.orderID}
								</h2>
								<button
									onClick={() => setShowTrackingModal(false)}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							{/* Tracking Form */}
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Tracking Number *
									</label>
									<input
										type="text"
										value={trackingInfo.trackingNumber}
										onChange={(e) => setTrackingInfo({...trackingInfo, trackingNumber: e.target.value})}
										placeholder="Enter tracking number..."
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Courier Service *
									</label>
									<select
										value={trackingInfo.courierService}
										onChange={(e) => setTrackingInfo({...trackingInfo, courierService: e.target.value})}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									>
										<option value="">Select courier service...</option>
										<option value="DHL">DHL Express</option>
										<option value="FedEx">FedEx</option>
										<option value="UPS">UPS</option>
										<option value="USPS">USPS</option>
										<option value="Sri Lanka Post">Sri Lanka Post</option>
										<option value="Pronto">Pronto Lanka</option>
										<option value="Kapruka">Kapruka Delivery</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Estimated Delivery Date
									</label>
									<input
										type="date"
										value={trackingInfo.estimatedDelivery}
										onChange={(e) => setTrackingInfo({...trackingInfo, estimatedDelivery: e.target.value})}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Tracking URL (Optional)
									</label>
									<input
										type="url"
										value={trackingInfo.trackingUrl}
										onChange={(e) => setTrackingInfo({...trackingInfo, trackingUrl: e.target.value})}
										placeholder="https://track.courier.com/..."
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>

								<div className="flex gap-4 pt-4">
									<button
										onClick={handleUpdateTracking}
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all"
									>
										Save Tracking Info
									</button>
									<button
										onClick={() => setShowTrackingModal(false)}
										className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-semibold transition-all"
									>
										Cancel
									</button>
								</div>
							</div>

							{/* Current Tracking Updates */}
							{selectedOrder.trackingInfo?.trackingUpdates && selectedOrder.trackingInfo.trackingUpdates.length > 0 && (
								<div className="mt-8 border-t-2 border-secondary/10 pt-6">
									<div className="flex items-center justify-between mb-4">
										<h3 className="font-bold text-secondary">Tracking Updates</h3>
										<button
											onClick={() => {
												setShowTrackingUpdateModal(true);
												setShowTrackingModal(false);
											}}
											className="px-3 py-1 bg-accent/10 hover:bg-accent/20 text-accent rounded-lg font-semibold text-sm flex items-center gap-1"
										>
											<FaPlus /> Add Update
										</button>
									</div>
									<div className="space-y-3 max-h-64 overflow-y-auto">
										{selectedOrder.trackingInfo.trackingUpdates.slice().reverse().map((update, idx) => (
											<div key={idx} className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
												<div className="flex items-start gap-3">
													<FaMapMarkerAlt className="text-blue-600 mt-1" />
													<div className="flex-1">
														<div className="flex items-center gap-2 mb-1">
															<span className="font-bold text-blue-700">{update.status}</span>
															{update.location && (
																<span className="text-xs text-blue-600">• {update.location}</span>
															)}
														</div>
														<p className="text-sm text-secondary mb-1">{update.description}</p>
														<p className="text-xs text-secondary/60">
															{new Date(update.timestamp).toLocaleString()}
														</p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Add Update Button */}
							{selectedOrder.trackingInfo?.trackingNumber && (
								<button
									onClick={() => {
										setShowTrackingUpdateModal(true);
										setShowTrackingModal(false);
									}}
									className="w-full mt-4 px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
								>
									<FaPlus />
									Add Tracking Update
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Add Tracking Update Modal */}
			{showTrackingUpdateModal && selectedOrder && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-2xl font-bold text-secondary">Add Tracking Update</h2>
								<button
									onClick={() => {
										setShowTrackingUpdateModal(false);
										setShowTrackingModal(true);
									}}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Status *
									</label>
									<select
										value={trackingUpdate.status}
										onChange={(e) => setTrackingUpdate({...trackingUpdate, status: e.target.value})}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									>
										<option value="">Select status...</option>
										<option value="Order Confirmed">Order Confirmed</option>
										<option value="Picked Up">Picked Up</option>
										<option value="In Transit">In Transit</option>
										<option value="Out for Delivery">Out for Delivery</option>
										<option value="Delivered">Delivered</option>
										<option value="Failed Delivery">Failed Delivery</option>
										<option value="Returned">Returned</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Location
									</label>
									<input
										type="text"
										value={trackingUpdate.location}
										onChange={(e) => setTrackingUpdate({...trackingUpdate, location: e.target.value})}
										placeholder="e.g., Colombo Distribution Center"
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-sm font-semibold text-secondary mb-2">
										Description *
									</label>
									<textarea
										value={trackingUpdate.description}
										onChange={(e) => setTrackingUpdate({...trackingUpdate, description: e.target.value})}
										placeholder="e.g., Package has been dispatched from facility"
										rows={3}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
									></textarea>
								</div>

								<div className="flex gap-4 pt-4">
									<button
										onClick={handleAddTrackingUpdate}
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all"
									>
										Add Update
									</button>
									<button
										onClick={() => {
											setShowTrackingUpdateModal(false);
											setShowTrackingModal(true);
										}}
										className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-semibold transition-all"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
