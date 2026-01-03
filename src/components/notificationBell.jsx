import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaBell, FaShippingFast, FaCheckCircle, FaComments, FaEnvelope, FaUndo, FaTimes, FaClock, FaExclamationTriangle, FaUserShield } from "react-icons/fa";
import { MdLocalShipping, MdCancel, MdPayment } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
	const [notifications, setNotifications] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const dropdownRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchNotifications();
		// Refresh notifications every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, []);

	// Click outside to close dropdown
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown]);

	const fetchNotifications = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			// Check user role
			const userRes = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			const isAdmin = userRes.data.role === "admin";

			// Fetch orders and messages
			const [ordersRes, messagesRes] = await Promise.all([
				axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.get(
					import.meta.env.VITE_API_URL + 
					(isAdmin ? "/api/messages" : "/api/messages/my-messages"),
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				),
			]);

			const newNotifications = [];

			if (isAdmin) {
				// Admin notifications
				// Check for order updates with feedback
				ordersRes.data.forEach((order) => {
					if (order.customerFeedback && order.customerFeedback.length > 0) {
						const lastFeedback = order.customerFeedback[order.customerFeedback.length - 1];
						newNotifications.push({
							id: `order-feedback-${order._id}`,
							sourceId: order._id,
							type: "order-feedback",
							title: `New feedback on order #${order.orderID}`,
							message: lastFeedback.message.substring(0, 50) + "...",
							date: lastFeedback.date,
							link: "/admin/user-orders",
							isAdmin: lastFeedback.isAdmin,
						});
					}

					// Check for cancellation/return requests
					if (order.cancellationStatus === "requested") {
						newNotifications.push({
							id: `order-cancel-${order._id}`,
							sourceId: order._id,
							type: "cancellation",
							title: `Cancellation requested - #${order.orderID}`,
							message: "A customer has requested to cancel this order",
							date: order.date,
							link: "/admin/user-orders",
						});
					}

					if (order.returnStatus === "requested") {
						newNotifications.push({
							id: `order-return-${order._id}`,
							sourceId: order._id,
							type: "return",
							title: `Return requested - #${order.orderID}`,
							message: "A customer has requested to return this order",
							date: order.date,
							link: "/admin/user-orders",
						});
					}

					// Payment pending approval
					if (order.paymentStatus === "pending") {
						newNotifications.push({
							id: `payment-pending-${order._id}`,
							sourceId: order._id,
							type: "payment-pending",
							title: `Payment approval needed - #${order.orderID}`,
							message: "Customer payment is awaiting approval",
							date: order.date,
							link: "/admin/user-orders",
						});
					}
				});

				// Check for new messages from users
				messagesRes.data.forEach((msg) => {
					if ((msg.status === "pending" || (msg.replies && msg.replies.length > 0)) && !msg.adminRead) {
						newNotifications.push({
							id: `message-${msg._id}`,
							sourceId: msg._id,
							type: "message",
							title: `New message: ${msg.subject}`,
							message: msg.message.substring(0, 50) + "...",
							date: msg.createdAt,
							link: "/admin/messages",
						});
					}
				});
			} else {
				// User notifications
				ordersRes.data.forEach((order) => {
					// Order status updates
					if (order.status === "shipped" && !order.notificationSeen) {
						newNotifications.push({
							id: `order-shipped-${order._id}`,
							sourceId: order._id,
							type: "shipped",
							title: `Order shipped - #${order.orderID}`,
							message: "Your order is on the way!",
							date: order.updatedAt || order.date,
							link: "/my-orders",
						});
					}

					if (order.status === "delivered" && !order.notificationSeen) {
						newNotifications.push({
							id: `order-delivered-${order._id}`,
							sourceId: order._id,
							type: "delivered",
							title: `Order delivered - #${order.orderID}`,
							message: "Your order has been delivered successfully",
							date: order.updatedAt || order.date,
							link: "/my-orders",
						});
					}

					// Payment status updates
					if (order.paymentStatus === "paid" && order.paymentDetails?.paymentDate) {
						const paymentDate = new Date(order.paymentDetails.paymentDate);
						const daysSincePayment = (Date.now() - paymentDate) / (1000 * 60 * 60 * 24);
						if (daysSincePayment < 7) { // Show for 7 days
							newNotifications.push({
								id: `payment-approved-${order._id}`,
								sourceId: order._id,
								type: "payment-approved",
								title: `Payment approved - #${order.orderID}`,
								message: "Your payment has been verified and approved",
								date: order.paymentDetails.paymentDate,
								link: "/my-orders",
							});
						}
					}

					if (order.paymentStatus === "unpaid" && order.paymentDetails?.rejectionReason) {
						newNotifications.push({
							id: `payment-rejected-${order._id}`,
							sourceId: order._id,
							type: "payment-rejected",
							title: `Payment issue - #${order.orderID}`,
							message: order.paymentDetails.rejectionReason,
							date: order.updatedAt || order.date,
							link: "/my-orders",
						});
					}

					// Cancellation/return status updates
					if (order.cancellationStatus === "approved") {
						newNotifications.push({
							id: `cancel-approved-${order._id}`,
							sourceId: order._id,
							type: "cancellation-approved",
							title: `Cancellation approved - #${order.orderID}`,
							message: "Your cancellation request has been approved",
							date: order.updatedAt || order.date,
							link: "/my-orders",
						});
					}

					if (order.returnStatus === "approved") {
						newNotifications.push({
							id: `return-approved-${order._id}`,
							sourceId: order._id,
							type: "return-approved",
							title: `Return approved - #${order.orderID}`,
							message: "Your return request has been approved",
							date: order.updatedAt || order.date,
							link: "/my-orders",
						});
					}

					// Admin replies to order feedback
					if (order.customerFeedback && order.customerFeedback.length > 0) {
						const adminReplies = order.customerFeedback.filter(f => f.isAdmin);
						if (adminReplies.length > 0) {
							const lastReply = adminReplies[adminReplies.length - 1];
							newNotifications.push({
								id: `admin-reply-${order._id}`,
								sourceId: order._id,
								type: "admin-reply",
								title: `Admin replied to your order - #${order.orderID}`,
								message: lastReply.message.substring(0, 50) + "...",
								date: lastReply.date,
								link: "/my-orders",
							});
						}
					}
				});

				// Check for new messages and replies
				messagesRes.data.forEach((msg) => {
					// Messages from admin or new replies
					if (msg.replies && msg.replies.length > 0) {
						const adminReplies = msg.replies.filter(r => r.senderRole === "admin");
						if (adminReplies.length > 0) {
							const lastReply = adminReplies[adminReplies.length - 1];
							const daysSinceReply = (Date.now() - new Date(lastReply.createdAt)) / (1000 * 60 * 60 * 24);
							if (daysSinceReply < 7) { // Show for 7 days
								newNotifications.push({
									id: `message-reply-${msg._id}`,
									sourceId: msg._id,
									type: "message-reply",
									title: `Admin replied: ${msg.subject}`,
									message: lastReply.message.substring(0, 50) + "...",
									date: lastReply.createdAt,
									link: "/messages",
								});
							}
						}
					}

					// Status changes
					if (msg.status === "replied" && msg.updatedAt) {
						const daysSinceUpdate = (Date.now() - new Date(msg.updatedAt)) / (1000 * 60 * 60 * 24);
						if (daysSinceUpdate < 7) {
							newNotifications.push({
								id: `message-status-${msg._id}`,
								sourceId: msg._id,
								type: "message-status",
								title: `Message updated: ${msg.subject}`,
								message: "Your message has been reviewed",
								date: msg.updatedAt,
								link: "/messages",
							});
						}
					}
				});
			}

			// Sort by date (newest first)
			newNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));

			// Take only the latest 10 notifications
			const recentNotifications = newNotifications.slice(0, 10);

			setNotifications(recentNotifications);
			setUnreadCount(recentNotifications.length);
		} catch (err) {
			console.error("Error fetching notifications:", err);
		}
	};

	const handleNotificationClick = (notification) => {
		// mark source as read/seen for admin notifications when applicable, then navigate
		(async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) {
					navigate(notification.link);
					setShowDropdown(false);
					return;
				}

				if (notification.type === "message" && notification.sourceId) {
					await axios.post(import.meta.env.VITE_API_URL + `/api/messages/${notification.sourceId}/mark-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
				} else if (notification.sourceId) {
					// order related notifications
					await axios.post(import.meta.env.VITE_API_URL + `/api/orders/notification/${notification.sourceId}/mark-seen`, {}, { headers: { Authorization: `Bearer ${token}` } });
				}
			} catch (err) {
				console.error("Error marking notification as read/seen:", err);
			}
			navigate(notification.link);
			setShowDropdown(false);
		})();
	};

	const getNotificationIcon = (type) => {
		const iconMap = {
			"order-feedback": { icon: FaComments, color: "text-blue-500", bg: "bg-blue-100" },
			"cancellation": { icon: MdCancel, color: "text-red-500", bg: "bg-red-100" },
			"return": { icon: FaUndo, color: "text-orange-500", bg: "bg-orange-100" },
			"delivered": { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-100" },
			"shipped": { icon: FaShippingFast, color: "text-purple-500", bg: "bg-purple-100" },
			"message": { icon: FaEnvelope, color: "text-indigo-500", bg: "bg-indigo-100" },
			"message-reply": { icon: FaComments, color: "text-blue-500", bg: "bg-blue-100" },
			"message-status": { icon: FaEnvelope, color: "text-gray-500", bg: "bg-gray-100" },
			"payment-pending": { icon: FaClock, color: "text-yellow-500", bg: "bg-yellow-100" },
			"payment-approved": { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-100" },
			"payment-rejected": { icon: FaTimes, color: "text-red-500", bg: "bg-red-100" },
			"cancellation-approved": { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-100" },
			"return-approved": { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-100" },
			"admin-reply": { icon: FaUserShield, color: "text-purple-500", bg: "bg-purple-100" },
		};
		return iconMap[type] || { icon: FaBell, color: "text-gray-500", bg: "bg-gray-100" };
	};

	const getTimeAgo = (date) => {
		const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
		if (seconds < 60) return 'Just now';
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		const days = Math.floor(hours / 24);
		if (days < 7) return `${days}d ago`;
		return new Date(date).toLocaleDateString();
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="relative p-3 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 group shadow-md hover:shadow-xl border-2 border-transparent hover:border-accent/30"
			>
				<FaBell className={`text-xl ${unreadCount > 0 ? 'text-accent animate-bounce' : 'text-secondary/60'} group-hover:scale-110 transition-transform`} />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{showDropdown && (
				<div className="absolute right-0 top-16 w-[90vw] sm:w-[420px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[9999] animate-fade-in overflow-hidden">
					<div className="sticky top-0 px-6 py-4 bg-gradient-to-r from-accent to-purple-500 text-white z-10 shadow-md">
						<div className="flex items-center justify-between">
							<div>
								<h3 className="font-bold text-lg flex items-center gap-2">
									<FaBell className="text-sm" />
									Notifications
								</h3>
								<p className="text-xs text-white/80 mt-0.5">{unreadCount} new {unreadCount === 1 ? 'update' : 'updates'}</p>
							</div>
							<button
								onClick={() => setShowDropdown(false)}
								className="p-2 hover:bg-white/20 rounded-lg transition-all"
							>
								<FaTimes />
							</button>
						</div>
					</div>
					<div className="max-h-[calc(85vh-140px)] overflow-y-auto">

						{notifications.length === 0 ? (
							<div className="p-12 text-center">
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
									<FaBell className="text-3xl text-gray-400" />
								</div>
								<p className="text-gray-600 font-semibold mb-1">All caught up!</p>
								<p className="text-gray-400 text-sm">No new notifications</p>
							</div>
						) : (
							<div className="p-2 space-y-2">
								{notifications.map((notification) => {
									const iconData = getNotificationIcon(notification.type);
									const IconComponent = iconData.icon;
									return (
										<button
											key={notification.id}
											onClick={() => handleNotificationClick(notification)}
											className="w-full p-4 hover:bg-gray-50 transition-all text-left flex items-start gap-4 rounded-xl border border-transparent hover:border-accent/20 hover:shadow-md group"
										>
											<div className={`w-12 h-12 ${iconData.bg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm`}>
												<IconComponent className={`${iconData.color} text-xl`} />
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
													{notification.title}
												</p>
												<p className="text-xs text-gray-600 mb-2 line-clamp-2">
													{notification.message}
												</p>
												<p className="text-xs text-gray-400 flex items-center gap-1">
													<FaClock className="text-[10px]" />
													{getTimeAgo(notification.date)}
												</p>
											</div>
										</button>
									);
								})}
							</div>
					)}

						</div>
						<div className="sticky bottom-0 p-4 bg-gray-50 border-t border-gray-200">
							<button
								onClick={() => {
									setShowDropdown(false);
									fetchNotifications();
								}}
								className="w-full px-4 py-2.5 bg-white hover:bg-accent hover:text-white text-accent border-2 border-accent rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
							>
								<FaBell className="text-xs" />
								Refresh Notifications
							</button>
						</div>
				</div>
			)}

			<style>{`
				@keyframes fade-in {
					from {
						opacity: 0;
						transform: translateY(-10px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}
				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}
			`}</style>
		</div>
	);
}
