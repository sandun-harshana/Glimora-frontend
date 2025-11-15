import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaChartBar, FaDollarSign, FaShoppingCart, FaUsers, FaCalendarAlt, FaDownload } from "react-icons/fa";
import { Loader } from "../../components/loader";

export default function AdminReportsPage() {
	const [orders, setOrders] = useState([]);
	const [users, setUsers] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState("all"); // all, today, week, month, year
	const [filteredOrders, setFilteredOrders] = useState([]);

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		filterOrdersByDate();
	}, [dateRange, orders]);

	const fetchData = async () => {
		try {
			const token = localStorage.getItem("token");
			const [ordersRes, usersRes, productsRes] = await Promise.all([
				axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.get(import.meta.env.VITE_API_URL + "/api/users/all-users", {
					headers: { Authorization: `Bearer ${token}` },
				}),
				axios.get(import.meta.env.VITE_API_URL + "/api/products", {
					headers: { Authorization: `Bearer ${token}` },
				}),
			]);
			setOrders(ordersRes.data);
			setUsers(usersRes.data);
			setProducts(productsRes.data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching data:", err);
			toast.error("Failed to load reports data");
			setLoading(false);
		}
	};

	const filterOrdersByDate = () => {
		const now = new Date();
		let filtered = orders;

		switch (dateRange) {
			case "today":
				filtered = orders.filter(o => {
					const orderDate = new Date(o.date);
					return orderDate.toDateString() === now.toDateString();
				});
				break;
			case "week":
				const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				filtered = orders.filter(o => new Date(o.date) >= weekAgo);
				break;
			case "month":
				const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				filtered = orders.filter(o => new Date(o.date) >= monthAgo);
				break;
			case "year":
				const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
				filtered = orders.filter(o => new Date(o.date) >= yearAgo);
				break;
			default:
				filtered = orders;
		}

		setFilteredOrders(filtered);
	};

	const calculateStats = () => {
		const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
		const totalOrders = filteredOrders.length;
		const completedOrders = filteredOrders.filter(o => o.status === "delivered").length;
		const pendingOrders = filteredOrders.filter(o => o.status === "pending").length;
		const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
		const paidOrders = filteredOrders.filter(o => o.paymentStatus === "paid").length;
		const pendingPayments = filteredOrders.filter(o => o.paymentStatus === "pending").length;

		return {
			totalRevenue,
			totalOrders,
			completedOrders,
			pendingOrders,
			averageOrderValue,
			paidOrders,
			pendingPayments,
		};
	};

	const getTopProducts = () => {
		const productSales = {};
		
		filteredOrders.forEach(order => {
			order.items.forEach(item => {
				if (productSales[item.productID]) {
					productSales[item.productID].quantity += item.quantity;
					productSales[item.productID].revenue += item.price * item.quantity;
				} else {
					productSales[item.productID] = {
						name: item.name,
						quantity: item.quantity,
						revenue: item.price * item.quantity,
						image: item.image,
					};
				}
			});
		});

		return Object.entries(productSales)
			.map(([id, data]) => ({ id, ...data }))
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 5);
	};

	const exportToCSV = () => {
		const stats = calculateStats();
		const csvContent = [
			["Metric", "Value"],
			["Total Revenue", `LKR ${stats.totalRevenue.toLocaleString()}`],
			["Total Orders", stats.totalOrders],
			["Completed Orders", stats.completedOrders],
			["Pending Orders", stats.pendingOrders],
			["Average Order Value", `LKR ${stats.averageOrderValue.toFixed(2)}`],
			["Paid Orders", stats.paidOrders],
			["Pending Payments", stats.pendingPayments],
			["Total Users", users.length],
			["Total Products", products.length],
			["Date Range", dateRange.charAt(0).toUpperCase() + dateRange.slice(1)],
			["Generated", new Date().toLocaleString()],
		].map(row => row.join(",")).join("\n");

		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `GBG_Report_${dateRange}_${Date.now()}.csv`;
		link.click();
		toast.success("Report exported successfully!");
	};

	if (loading) {
		return <Loader />;
	}

	const stats = calculateStats();
	const topProducts = getTopProducts();

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1800px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
								<FaChartBar className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-blue-600 bg-clip-text text-transparent">
									Reports & Analytics
								</h1>
								<p className="text-secondary/60 font-medium">
									Business insights and performance metrics
								</p>
							</div>
						</div>
						<button
							onClick={exportToCSV}
							className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
						>
							<FaDownload />
							Export CSV
						</button>
					</div>
				</div>

				{/* Date Range Filter */}
				<div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-accent/20">
					<div className="flex items-center gap-3 mb-4">
						<FaCalendarAlt className="text-accent text-xl" />
						<h2 className="font-bold text-lg text-secondary">Date Range</h2>
					</div>
					<div className="flex flex-wrap gap-3">
						{["all", "today", "week", "month", "year"].map((range) => (
							<button
								key={range}
								onClick={() => setDateRange(range)}
								className={`px-6 py-3 rounded-xl font-semibold transition-all ${
									dateRange === range
										? "bg-accent text-white shadow-lg"
										: "bg-secondary/10 text-secondary hover:bg-secondary/20"
								}`}
							>
								{range.charAt(0).toUpperCase() + range.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Total Revenue */}
					<div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 shadow-xl text-white">
						<div className="flex items-center justify-between mb-4">
							<FaDollarSign className="text-4xl opacity-80" />
							<div className="text-right">
								<p className="text-sm opacity-80">Total Revenue</p>
								<p className="text-3xl font-bold">LKR {stats.totalRevenue.toLocaleString()}</p>
							</div>
						</div>
						<div className="text-xs opacity-80">
							Average: LKR {stats.averageOrderValue.toFixed(2)}
						</div>
					</div>

					{/* Total Orders */}
					<div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-xl text-white">
						<div className="flex items-center justify-between mb-4">
							<FaShoppingCart className="text-4xl opacity-80" />
							<div className="text-right">
								<p className="text-sm opacity-80">Total Orders</p>
								<p className="text-3xl font-bold">{stats.totalOrders}</p>
							</div>
						</div>
						<div className="text-xs opacity-80">
							Completed: {stats.completedOrders} | Pending: {stats.pendingOrders}
						</div>
					</div>

					{/* Payment Stats */}
					<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-xl text-white">
						<div className="flex items-center justify-between mb-4">
							<FaDollarSign className="text-4xl opacity-80" />
							<div className="text-right">
								<p className="text-sm opacity-80">Paid Orders</p>
								<p className="text-3xl font-bold">{stats.paidOrders}</p>
							</div>
						</div>
						<div className="text-xs opacity-80">
							Pending Verification: {stats.pendingPayments}
						</div>
					</div>

					{/* Total Users */}
					<div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 shadow-xl text-white">
						<div className="flex items-center justify-between mb-4">
							<FaUsers className="text-4xl opacity-80" />
							<div className="text-right">
								<p className="text-sm opacity-80">Total Users</p>
								<p className="text-3xl font-bold">{users.length}</p>
							</div>
						</div>
						<div className="text-xs opacity-80">
							Products: {products.length}
						</div>
					</div>
				</div>

				{/* Top Products */}
				<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
					<h2 className="font-bold text-2xl text-secondary mb-6">Top Selling Products</h2>
					{topProducts.length === 0 ? (
						<div className="text-center py-12">
							<p className="text-secondary/60">No sales data available for selected period</p>
						</div>
					) : (
						<div className="space-y-4">
							{topProducts.map((product, index) => (
								<div
									key={product.id}
									className="flex items-center gap-4 p-4 rounded-2xl border-2 border-secondary/10 hover:border-accent/30 hover:shadow-lg transition-all"
								>
									<div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent to-accent/80 text-white font-bold text-xl rounded-xl shadow-md">
										#{index + 1}
									</div>
									<img
										src={product.image}
										alt={product.name}
										className="w-16 h-16 object-cover rounded-xl border-2 border-accent/20"
									/>
									<div className="flex-1">
										<h3 className="font-bold text-secondary">{product.name}</h3>
										<p className="text-sm text-secondary/60">
											Sold: {product.quantity} units
										</p>
									</div>
									<div className="text-right">
										<p className="font-bold text-lg text-green-600">
											LKR {product.revenue.toLocaleString()}
										</p>
										<p className="text-xs text-secondary/60">Revenue</p>
									</div>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Order Status Breakdown */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="font-bold text-2xl text-secondary mb-6">Order Status</h2>
						<div className="space-y-4">
							{[
								{ status: "pending", label: "Pending", color: "orange" },
								{ status: "processing", label: "Processing", color: "blue" },
								{ status: "shipped", label: "Shipped", color: "cyan" },
								{ status: "delivered", label: "Delivered", color: "green" },
								{ status: "cancelled", label: "Cancelled", color: "red" },
							].map(({ status, label, color }) => {
								const count = filteredOrders.filter(o => o.status === status).length;
								const percentage = filteredOrders.length > 0 
									? ((count / filteredOrders.length) * 100).toFixed(1)
									: 0;
								return (
									<div key={status}>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-secondary">{label}</span>
											<span className="text-secondary/60">{count} ({percentage}%)</span>
										</div>
										<div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
											<div
												className={`h-full bg-${color}-500 transition-all duration-500`}
												style={{ width: `${percentage}%` }}
											></div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="font-bold text-2xl text-secondary mb-6">Payment Status</h2>
						<div className="space-y-4">
							{[
								{ status: "paid", label: "Paid", color: "green" },
								{ status: "pending", label: "Pending Verification", color: "yellow" },
								{ status: "unpaid", label: "Unpaid (COD)", color: "gray" },
							].map(({ status, label, color }) => {
								const count = filteredOrders.filter(o => o.paymentStatus === status).length;
								const percentage = filteredOrders.length > 0 
									? ((count / filteredOrders.length) * 100).toFixed(1)
									: 0;
								return (
									<div key={status}>
										<div className="flex items-center justify-between mb-2">
											<span className="font-semibold text-secondary">{label}</span>
											<span className="text-secondary/60">{count} ({percentage}%)</span>
										</div>
										<div className="h-3 bg-secondary/10 rounded-full overflow-hidden">
											<div
												className={`h-full bg-${color}-500 transition-all duration-500`}
												style={{ width: `${percentage}%` }}
											></div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
