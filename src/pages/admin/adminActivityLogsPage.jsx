import { useState, useEffect } from "react";
import axios from "axios";
import { FaHistory, FaUser, FaShoppingBag, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";

export default function AdminActivityLogsPage() {
	const [logs, setLogs] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [filterType, setFilterType] = useState("all");
	const [filterDate, setFilterDate] = useState("");

	useEffect(() => {
		fetchActivityLogs();
	}, []);

	const fetchActivityLogs = async () => {
		try {
			// In a real app, you'd fetch from a dedicated activity logs endpoint
			// For now, we'll create sample logs from existing data
			const token = localStorage.getItem("token");

			// Fetch orders to create activity logs
			const ordersRes = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
				headers: { Authorization: `Bearer ${token}` },
			});

			// Generate sample activity logs
			const activityLogs = [];

			// Order-related logs
			ordersRes.data.slice(0, 20).forEach((order) => {
				activityLogs.push({
					id: `log-order-${order._id}`,
					type: "order",
					action: "Order Created",
					description: `New order #${order.orderID} created by ${order.email}`,
					user: order.email,
					timestamp: order.date,
					details: {
						orderId: order.orderID,
						amount: order.totalAmount,
						items: order.items?.length || 0,
					},
				});

				if (order.status === "Delivered") {
					activityLogs.push({
						id: `log-delivered-${order._id}`,
						type: "order",
						action: "Order Delivered",
						description: `Order #${order.orderID} marked as delivered`,
						user: "Admin",
						timestamp: new Date(order.date).getTime() + 5 * 24 * 60 * 60 * 1000,
						details: {
							orderId: order.orderID,
						},
					});
				}
			});

			// Add sample admin activity logs
			const sampleAdminLogs = [
				{
					id: "log-admin-1",
					type: "admin",
					action: "User Management",
					description: "Admin updated user permissions",
					user: "admin@cbc.com",
					timestamp: Date.now() - 1000 * 60 * 60 * 2,
					details: { action: "permissions_updated" },
				},
				{
					id: "log-admin-2",
					type: "product",
					action: "Product Added",
					description: "New product added to inventory",
					user: "admin@cbc.com",
					timestamp: Date.now() - 1000 * 60 * 60 * 5,
					details: { productName: "Sample Product" },
				},
				{
					id: "log-admin-3",
					type: "product",
					action: "Product Updated",
					description: "Product price updated",
					user: "admin@cbc.com",
					timestamp: Date.now() - 1000 * 60 * 60 * 24,
					details: { productName: "Sample Product" },
				},
				{
					id: "log-admin-4",
					type: "product",
					action: "Product Deleted",
					description: "Product removed from catalog",
					user: "admin@cbc.com",
					timestamp: Date.now() - 1000 * 60 * 60 * 48,
					details: { productName: "Old Product" },
				},
				{
					id: "log-admin-5",
					type: "admin",
					action: "Settings Updated",
					description: "Store settings modified",
					user: "admin@cbc.com",
					timestamp: Date.now() - 1000 * 60 * 60 * 72,
					details: { section: "payment_settings" },
				},
			];

			const allLogs = [...activityLogs, ...sampleAdminLogs].sort(
				(a, b) => new Date(b.timestamp) - new Date(a.timestamp)
			);

			setLogs(allLogs);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching activity logs:", err);
			toast.error("Failed to load activity logs");
			setIsLoading(false);
		}
	};

	const getLogIcon = (type) => {
		switch (type) {
			case "order":
				return <FaShoppingBag className="text-blue-600" />;
			case "product":
				return <FaEdit className="text-green-600" />;
			case "admin":
				return <MdAdminPanelSettings className="text-purple-600" />;
			case "user":
				return <FaUser className="text-orange-600" />;
			default:
				return <FaHistory className="text-secondary/60" />;
		}
	};

	const getLogColor = (type) => {
		switch (type) {
			case "order":
				return "bg-blue-100 border-blue-300";
			case "product":
				return "bg-green-100 border-green-300";
			case "admin":
				return "bg-purple-100 border-purple-300";
			case "user":
				return "bg-orange-100 border-orange-300";
			default:
				return "bg-secondary/10 border-secondary/20";
		}
	};

	const filteredLogs = logs.filter((log) => {
		if (filterType !== "all" && log.type !== filterType) return false;
		if (filterDate) {
			const logDate = new Date(log.timestamp).toISOString().split("T")[0];
			if (logDate !== filterDate) return false;
		}
		return true;
	});

	const stats = {
		total: logs.length,
		orders: logs.filter((l) => l.type === "order").length,
		products: logs.filter((l) => l.type === "product").length,
		admin: logs.filter((l) => l.type === "admin").length,
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
							<div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
								<FaHistory className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-indigo-600 bg-clip-text text-transparent">
									Activity Logs
								</h1>
								<p className="text-secondary/60 font-medium">
									Track all system activities and changes
								</p>
							</div>
						</div>

						<button
							onClick={fetchActivityLogs}
							className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg"
						>
							<FaHistory />
							Refresh Logs
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-indigo-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
								<FaHistory className="text-indigo-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-indigo-700">{stats.total}</span>
						</div>
						<h3 className="text-indigo-600 font-bold text-sm">Total Activities</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-blue-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<FaShoppingBag className="text-blue-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-blue-700">{stats.orders}</span>
						</div>
						<h3 className="text-blue-600 font-bold text-sm">Order Activities</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<FaEdit className="text-green-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-green-700">{stats.products}</span>
						</div>
						<h3 className="text-green-600 font-bold text-sm">Product Changes</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-purple-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								<MdAdminPanelSettings className="text-purple-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-purple-700">{stats.admin}</span>
						</div>
						<h3 className="text-purple-600 font-bold text-sm">Admin Actions</h3>
					</div>
				</div>

				{/* Filters */}
				<div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-accent/20">
					<div className="flex flex-wrap gap-4 items-center">
						<div className="flex gap-2">
							{["all", "order", "product", "admin", "user"].map((type) => (
								<button
									key={type}
									onClick={() => setFilterType(type)}
									className={`px-6 py-3 rounded-xl font-semibold transition-all ${
										filterType === type
											? "bg-accent text-white shadow-lg"
											: "bg-secondary/10 text-secondary hover:bg-secondary/20"
									}`}
								>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</button>
							))}
						</div>

						<div className="ml-auto">
							<input
								type="date"
								value={filterDate}
								onChange={(e) => setFilterDate(e.target.value)}
								className="px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
							/>
						</div>
					</div>
				</div>

				{/* Activity Timeline */}
				<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
					{filteredLogs.length === 0 ? (
						<div className="text-center py-16">
							<FaHistory className="text-6xl text-secondary/30 mx-auto mb-4" />
							<h3 className="text-2xl font-bold text-secondary mb-2">No Activities Found</h3>
							<p className="text-secondary/60">
								No activity logs match your current filters
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredLogs.map((log, index) => (
								<div
									key={log.id}
									className={`relative pl-12 pb-6 ${
										index !== filteredLogs.length - 1
											? "border-l-4 border-accent/20 ml-6"
											: "ml-6"
									}`}
								>
									{/* Timeline Dot */}
									<div
										className={`absolute -left-8 top-0 w-12 h-12 rounded-full border-4 ${getLogColor(
											log.type
										)} flex items-center justify-center text-xl shadow-lg`}
									>
										{getLogIcon(log.type)}
									</div>

									{/* Log Content */}
									<div className="bg-secondary/5 rounded-2xl p-6 hover:bg-secondary/10 transition-all">
										<div className="flex items-start justify-between mb-3">
											<div>
												<h3 className="text-xl font-bold text-secondary mb-1">
													{log.action}
												</h3>
												<p className="text-secondary/70">{log.description}</p>
											</div>
											<span
												className={`px-4 py-2 rounded-full font-semibold text-sm border-2 ${getLogColor(
													log.type
												)}`}
											>
												{log.type.toUpperCase()}
											</span>
										</div>

										<div className="flex items-center gap-6 text-sm text-secondary/60">
											<div className="flex items-center gap-2">
												<FaUser />
												<span className="font-semibold">{log.user}</span>
											</div>
											<div className="flex items-center gap-2">
												<FaHistory />
												<span>
													{new Date(log.timestamp).toLocaleString("en-US", {
														month: "short",
														day: "numeric",
														year: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>

										{/* Additional Details */}
										{log.details && Object.keys(log.details).length > 0 && (
											<div className="mt-4 pt-4 border-t border-secondary/10">
												<div className="flex flex-wrap gap-3">
													{Object.entries(log.details).map(([key, value]) => (
														<div
															key={key}
															className="px-3 py-1 bg-white rounded-lg text-sm"
														>
															<span className="text-secondary/60 font-semibold">
																{key}:
															</span>{" "}
															<span className="text-secondary font-bold">
																{typeof value === "object"
																	? JSON.stringify(value)
																	: value}
															</span>
														</div>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
