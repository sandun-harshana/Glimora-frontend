import { useState, useEffect } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function NotificationBell() {
	const [notifications, setNotifications] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		fetchNotifications();
		// Refresh notifications every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	}, []);

	const fetchNotifications = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			// Fetch orders and messages
			const [ordersRes, messagesRes] = await Promise.all([
				axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.get(import.meta.env.VITE_API_URL + "/api/messages", {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);

			const newNotifications = [];

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
						link: "/my-orders",
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

				// Status updates
				if (order.status === "delivered" && !order.notificationSeen) {
					newNotifications.push({
						id: `order-delivered-${order._id}`,
						sourceId: order._id,
						type: "delivered",
						title: `Order delivered - #${order.orderID}`,
						message: "Your order has been delivered",
						date: order.date,
						link: "/my-orders",
					});
				}
			});

			// Check for new messages
			messagesRes.data.forEach((msg) => {
				// treat adminRead flag to avoid repeatedly notifying already-read messages
				if ((msg.status === "pending" || (msg.replies && msg.replies.length > 0)) && !msg.adminRead) {
					newNotifications.push({
						id: `message-${msg._id}`,
						sourceId: msg._id,
						type: "message",
						title: `New message: ${msg.subject}`,
						message: msg.message.substring(0, 50) + "...",
						date: msg.date,
						link: "/messages",
					});
				}
			});

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
		const icons = {
			"order-feedback": "💬",
			cancellation: "❌",
			return: "🔄",
			delivered: "📦",
			message: "✉️",
		};
		return icons[type] || "🔔";
	};

	return (
		<div className="relative">
			<button
				onClick={() => setShowDropdown(!showDropdown)}
				className="relative p-3 bg-accent hover:bg-accent/90 rounded-xl transition-all duration-300 group shadow-lg hover:shadow-xl"
			>
				<FaBell className="text-2xl text-white group-hover:scale-110 transition-transform" />
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
						{unreadCount > 9 ? "9+" : unreadCount}
					</span>
				)}
			</button>

			{showDropdown && (
				<div className="absolute right-0 top-14 w-96 max-h-96 overflow-y-auto bg-white rounded-2xl shadow-2xl border-2 border-secondary/10 z-50 animate-fade-in">
					<div className="p-4 border-b-2 border-secondary/10 bg-gradient-to-r from-accent/10 to-accent/5">
						<h3 className="font-bold text-secondary">Notifications</h3>
						<p className="text-xs text-secondary/60">{unreadCount} new updates</p>
					</div>

					{notifications.length === 0 ? (
						<div className="p-8 text-center">
							<FaBell className="text-4xl text-secondary/30 mx-auto mb-3" />
							<p className="text-secondary/60 text-sm">No new notifications</p>
						</div>
					) : (
						<div className="divide-y divide-secondary/10">
							{notifications.map((notification) => (
								<button
									key={notification.id}
									onClick={() => handleNotificationClick(notification)}
									className="w-full p-4 hover:bg-primary/50 transition-all text-left flex items-start gap-3"
								>
									<span className="text-2xl">{getNotificationIcon(notification.type)}</span>
									<div className="flex-1">
										<p className="font-semibold text-secondary text-sm mb-1">
											{notification.title}
										</p>
										<p className="text-xs text-secondary/70 mb-2">
											{notification.message}
										</p>
										<p className="text-xs text-secondary/50">
											{new Date(notification.date).toLocaleDateString()} at{" "}
											{new Date(notification.date).toLocaleTimeString()}
										</p>
									</div>
								</button>
							))}
						</div>
					)}

					<div className="p-4 border-t-2 border-secondary/10">
						<button
							onClick={() => {
								setShowDropdown(false);
								fetchNotifications();
							}}
							className="w-full px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl font-semibold text-sm transition-all"
						>
							Refresh Notifications
						</button>
					</div>
				</div>
			)}

			<style jsx>{`
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
