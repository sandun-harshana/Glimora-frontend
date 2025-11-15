import { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaChartLine } from "react-icons/fa";
import { MdPendingActions, MdCheckCircle, MdTrendingUp, MdLocalShipping, MdMoneyOff, MdCancel } from "react-icons/md";
import { Loader } from "../../components/loader";

export default function AdminDashboard() {
	const [stats, setStats] = useState({
		totalProducts: 0,
		totalOrders: 0,
		totalUsers: 0,
		totalRevenue: 0,
		pendingOrders: 0,
		completedOrders: 0,
		shippedOrders: 0,
		refundedOrders: 0,
		cancelledOrders: 0,
	});
	const [isLoading, setIsLoading] = useState(true);
	const [allOrders, setAllOrders] = useState([]);
	const [recentOrders, setRecentOrders] = useState([]);
	const [refreshing, setRefreshing] = useState(false);
	const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

	const fetchDashboardData = () => {
		const token = localStorage.getItem("token");
		
		setRefreshing(true);

		// Fetch products
		axios.get(import.meta.env.VITE_API_URL + "/api/products")
			.then((res) => {
				const products = Array.isArray(res.data) ? res.data : [];
				setStats(prev => ({ ...prev, totalProducts: products.length }));
			})
			.catch(() => {
				setStats(prev => ({ ...prev, totalProducts: 0 }));
			});

		// Fetch orders
		axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then((res) => {
				const orders = Array.isArray(res.data) ? res.data : [];
				// Sort orders by date (most recent first)
				const sortedOrders = orders.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
				
				setStats(prev => ({
					...prev,
					totalOrders: orders.length,
					pendingOrders: orders.filter(o => o.status === "pending").length,
					completedOrders: orders.filter(o => o.status === "delivered" || o.status === "completed").length,
					shippedOrders: orders.filter(o => o.status === "shipped").length,
					refundedOrders: orders.filter(o => o.status === "refunded").length,
					cancelledOrders: orders.filter(o => o.status === "cancelled").length,
					totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
				}));
				setAllOrders(sortedOrders);
				setRecentOrders(sortedOrders.slice(0, 5));
				setLastUpdateTime(new Date());
				setIsLoading(false);
				setRefreshing(false);
			})
			.catch(() => {
				setIsLoading(false);
				setRefreshing(false);
			});

		// Fetch users
		axios.get(import.meta.env.VITE_API_URL + "/api/users/all-users", {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then((res) => {
				const users = Array.isArray(res.data) ? res.data : [];
				setStats(prev => ({ ...prev, totalUsers: users.length }));
			})
			.catch((err) => {
				console.error("Error fetching users:", err);
				setStats(prev => ({ ...prev, totalUsers: 0 }));
			});
	};

	useEffect(() => {
		fetchDashboardData();

		// Set up real-time polling for pending payments and notifications
		const intervalId = setInterval(() => {
			fetchDashboardData();
		}, 30000); // Update every 30 seconds

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-full bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1600px] mx-auto">
				{/* Header - Enhanced with Gradient */}
				<div className="mb-8 relative">
					<div className="bg-white rounded-3xl shadow-2xl p-8 border border-accent/20 overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
						<div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
									<FaChartLine className="text-white text-2xl" />
								</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
									Dashboard
								</h1>
								<p className="text-secondary/60 font-medium">Welcome back! Here's your business overview.</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<button
								onClick={fetchDashboardData}
								disabled={refreshing}
								className={`group flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-xl border border-accent/20 font-semibold transition-all ${refreshing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
							>
								<svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								<span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
							</button>
							<div className="text-right flex flex-col gap-1">
								<div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">
									<svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
									<span className="text-sm font-semibold text-secondary">
										{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
									</span>
								</div>
							<div className="flex items-center gap-1 text-xs text-secondary/50">
								<svg className="w-3 h-3 animate-pulse text-green-500" fill="currentColor" viewBox="0 0 20 20">
									<circle cx="10" cy="10" r="10" />
								</svg>
								<span>
									Auto-updating every 30s • Last: {lastUpdateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
							</div>
						</div>
						</div>
					</div>
				</div>

				{/* Stats Grid - Enhanced with Animations */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					{/* Total Revenue */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-accent/20 hover:border-accent/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<FaDollarSign className="text-2xl text-white" />
								</div>
								<div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
									<MdTrendingUp className="text-lg" />
									<span>+12%</span>
								</div>
							</div>
							<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-2">Total Revenue</h3>
							<p className="text-3xl font-bold text-secondary group-hover:text-accent transition-colors">
								LKR {stats.totalRevenue.toLocaleString()}
							</p>
							<div className="mt-3 pt-3 border-t border-secondary/10">
								<p className="text-xs text-secondary/50 font-medium">All time earnings</p>
							</div>
						</div>
					</div>

					{/* Total Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<FaShoppingCart className="text-2xl text-white" />
								</div>
								<div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
									<MdTrendingUp className="text-lg" />
									<span>+8%</span>
								</div>
							</div>
							<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-2">Total Orders</h3>
							<p className="text-3xl font-bold text-secondary group-hover:text-blue-600 transition-colors">
								{stats.totalOrders}
							</p>
							<div className="mt-3 pt-3 border-t border-secondary/10">
								<p className="text-xs text-secondary/50 font-medium">All orders placed</p>
							</div>
						</div>
					</div>

					{/* Total Products */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<FaBox className="text-2xl text-white" />
								</div>
								<div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
									<MdTrendingUp className="text-lg" />
									<span>+5%</span>
								</div>
							</div>
							<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-2">Total Products</h3>
							<p className="text-3xl font-bold text-secondary group-hover:text-purple-600 transition-colors">
								{stats.totalProducts}
							</p>
							<div className="mt-3 pt-3 border-t border-secondary/10">
								<p className="text-xs text-secondary/50 font-medium">In inventory</p>
							</div>
						</div>
					</div>

					{/* Total Users */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-300/20 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative">
							<div className="flex items-center justify-between mb-4">
								<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<FaUsers className="text-2xl text-white" />
								</div>
								<div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
									<MdTrendingUp className="text-lg" />
									<span>+15%</span>
								</div>
							</div>
							<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-2">Total Users</h3>
							<p className="text-3xl font-bold text-secondary group-hover:text-green-600 transition-colors">
								{stats.totalUsers}
							</p>
							<div className="mt-3 pt-3 border-t border-secondary/10">
								<p className="text-xs text-secondary/50 font-medium">Registered users</p>
							</div>
						</div>
					</div>
				</div>

				{/* Secondary Stats - Enhanced Cards with Animations */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{/* Pending Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-300/20 to-transparent rounded-full blur-2xl"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="relative">
									<div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
										<MdPendingActions className="text-3xl text-white" />
									</div>
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full"></div>
								</div>
								<div>
									<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-1">Pending Orders</h3>
									<p className="text-4xl font-bold text-secondary group-hover:text-orange-600 transition-colors">{stats.pendingOrders}</p>
									<p className="text-xs text-secondary/50 mt-1">Needs attention</p>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="bg-orange-100 text-orange-700 text-xs font-bold px-4 py-2 rounded-full border-2 border-orange-300 shadow-sm">
									Action Required
								</span>
								<div className="flex items-center gap-1 text-orange-600 text-sm font-semibold">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Pending</span>
								</div>
							</div>
						</div>
					</div>

					{/* Completed Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-300/20 to-transparent rounded-full blur-2xl"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<MdCheckCircle className="text-3xl text-white" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-1">Completed Orders</h3>
									<p className="text-4xl font-bold text-secondary group-hover:text-green-600 transition-colors">{stats.completedOrders}</p>
									<p className="text-xs text-secondary/50 mt-1">Successfully delivered</p>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-full border-2 border-green-300 shadow-sm">
									Completed
								</span>
								<div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Success</span>
								</div>
							</div>
						</div>
					</div>

					{/* Shipped Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-cyan-200 hover:border-cyan-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-2xl"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="relative">
									<div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
										<MdLocalShipping className="text-3xl text-white" />
									</div>
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full animate-ping"></div>
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full"></div>
								</div>
								<div>
									<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-1">Shipped Orders</h3>
									<p className="text-4xl font-bold text-secondary group-hover:text-cyan-600 transition-colors">{stats.shippedOrders}</p>
									<p className="text-xs text-secondary/50 mt-1">In transit</p>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-4 py-2 rounded-full border-2 border-cyan-300 shadow-sm">
									In Transit
								</span>
								<div className="flex items-center gap-1 text-cyan-600 text-sm font-semibold">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Shipping</span>
								</div>
							</div>
						</div>
					</div>

					{/* Refunded Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-pink-300/20 to-transparent rounded-full blur-2xl"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<MdMoneyOff className="text-3xl text-white" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-1">Refunded Orders</h3>
									<p className="text-4xl font-bold text-secondary group-hover:text-pink-600 transition-colors">{stats.refundedOrders}</p>
									<p className="text-xs text-secondary/50 mt-1">Money returned</p>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="bg-pink-100 text-pink-700 text-xs font-bold px-4 py-2 rounded-full border-2 border-pink-300 shadow-sm">
									Refunded
								</span>
								<div className="flex items-center gap-1 text-pink-600 text-sm font-semibold">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
									</svg>
									<span>Refund</span>
								</div>
							</div>
						</div>
					</div>

					{/* Cancelled Orders */}
					<div className="group bg-white rounded-3xl p-6 border-2 border-red-200 hover:border-red-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-red-300/20 to-transparent rounded-full blur-2xl"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
									<MdCancel className="text-3xl text-white" />
								</div>
								<div>
									<h3 className="text-sm font-bold text-secondary/60 uppercase tracking-wide mb-1">Cancelled Orders</h3>
									<p className="text-4xl font-bold text-secondary group-hover:text-red-600 transition-colors">{stats.cancelledOrders}</p>
									<p className="text-xs text-secondary/50 mt-1">Not processed</p>
								</div>
							</div>
							<div className="flex flex-col items-end gap-2">
								<span className="bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-full border-2 border-red-300 shadow-sm">
									Cancelled
								</span>
								<div className="flex items-center gap-1 text-red-600 text-sm font-semibold">
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									<span>Cancelled</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Notifications & Payment Overview Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					{/* Pending Payments Section */}
					<div className="bg-white rounded-3xl border-2 border-yellow-200 overflow-hidden shadow-xl">
						<div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 px-6 py-5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="relative">
										<div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
											<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
										</div>
										{stats.pendingOrders > 0 && (
											<>
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full"></div>
											</>
										)}
									</div>
								<div>
									<div className="flex items-center gap-2">
										<h2 className="text-xl font-bold text-white">Pending Payments</h2>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
											<svg className="w-2 h-2 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
												<circle cx="4" cy="4" r="3" />
											</svg>
											Live
										</span>
									</div>
									<p className="text-sm text-white/80">Awaiting verification</p>
								</div>
								</div>
								<div className="text-right">
									<p className="text-4xl font-bold text-white">
										{allOrders.filter(o => o.paymentStatus === "pending" || (o.paymentMethod !== "cash-on-delivery" && o.paymentStatus === "unpaid")).length}
									</p>
									<p className="text-xs text-white/70 mt-1">Needs action</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							{allOrders.filter(o => o.paymentStatus === "pending" || (o.paymentMethod !== "cash-on-delivery" && o.paymentStatus === "unpaid")).length > 0 ? (
								<div className="space-y-3">
									{allOrders.filter(o => o.paymentStatus === "pending" || (o.paymentMethod !== "cash-on-delivery" && o.paymentStatus === "unpaid")).slice(0, 3).map((order, index) => (
										<div 
											key={index}
											className="group flex items-center justify-between p-4 rounded-xl hover:bg-yellow-50 transition-all border-2 border-yellow-100 hover:border-yellow-300 hover:shadow-md"
										>
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
													{index + 1}
												</div>
												<div>
													<p className="font-semibold text-secondary group-hover:text-yellow-700 transition-colors">
														{order.orderID}
													</p>
													<p className="text-xs text-secondary/60">{order.customerName} • {order.email}</p>
													<div className="flex items-center gap-2 mt-1">
														<span className={`text-xs font-semibold px-2 py-1 rounded ${
															order.paymentStatus === "pending" 
																? "bg-yellow-100 text-yellow-700" 
																: "bg-orange-100 text-orange-700"
														}`}>
															{order.paymentMethod?.replace('-', ' ').toUpperCase()}
														</span>
														{order.paymentDetails?.transactionId && (
															<span className="text-xs text-secondary/50">
																• ID: {order.paymentDetails.transactionId.substring(0, 10)}...
															</span>
														)}
														{order.paymentDetails?.bankName && (
															<span className="text-xs text-secondary/50">
																• {order.paymentDetails.bankName}
															</span>
														)}
													</div>
													<div className="flex items-center gap-1 mt-1">
														<svg className="w-3 h-3 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														<span className="text-xs text-secondary/50">
															{new Date(order.createdAt || order.date).toLocaleString('en-US', { 
																month: 'short', 
																day: 'numeric', 
																hour: '2-digit', 
																minute: '2-digit' 
															})}
														</span>
													</div>
												</div>
											</div>
											<div className="text-right">
												<p className="font-bold text-yellow-700 text-lg">LKR {order.total?.toLocaleString()}</p>
												<p className="text-xs text-secondary/50 mb-2">
													{order.paymentStatus === "pending" ? "Verification Pending" : "Payment Required"}
												</p>
												<a 
													href="/admin/user-orders"
													className="inline-flex items-center gap-1 text-xs text-yellow-600 hover:text-yellow-700 font-semibold hover:underline"
												>
													Verify
													<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>
												</a>
											</div>
										</div>
									))}
									{allOrders.filter(o => o.paymentStatus === "pending" || (o.paymentMethod !== "cash-on-delivery" && o.paymentStatus === "unpaid")).length > 3 && (
										<a 
											href="/admin/user-orders"
											className="block text-center py-3 bg-yellow-50 hover:bg-yellow-100 rounded-xl text-yellow-700 font-semibold transition-all border-2 border-yellow-200"
										>
											View All {allOrders.filter(o => o.paymentStatus === "pending" || (o.paymentMethod !== "cash-on-delivery" && o.paymentStatus === "unpaid")).length} Pending Payments
										</a>
									)}
								</div>
							) : (
								<div className="text-center py-8">
									<div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
										<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
										</svg>
									</div>
									<p className="text-secondary/60 font-semibold">All payments verified!</p>
									<p className="text-xs text-secondary/50 mt-1">No pending payments at the moment</p>
								</div>
							)}
						</div>
					</div>

					{/* Recent Notifications Section */}
					<div className="bg-white rounded-3xl border-2 border-purple-200 overflow-hidden shadow-xl">
						<div className="bg-gradient-to-r from-purple-500 via-purple-600 to-indigo-600 px-6 py-5">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-4">
									<div className="relative">
										<div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
											<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
											</svg>
										</div>
										{(allOrders.filter(o => o.cancellationStatus === "requested").length + 
										  allOrders.filter(o => o.returnStatus === "requested").length +
										  allOrders.filter(o => o.customerFeedback && o.customerFeedback.length > 0 && 
										  o.customerFeedback.some(f => !f.isAdmin)).length) > 0 && (
											<>
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full animate-ping"></div>
												<div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-400 rounded-full"></div>
											</>
										)}
									</div>
								<div>
									<div className="flex items-center gap-2">
										<h2 className="text-xl font-bold text-white">Notifications</h2>
										<span className="inline-flex items-center px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full">
											<svg className="w-2 h-2 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 8 8">
												<circle cx="4" cy="4" r="3" />
											</svg>
											Live
										</span>
									</div>
									<p className="text-sm text-white/80">Recent activity</p>
								</div>
								</div>
								<div className="text-right">
									<p className="text-4xl font-bold text-white">
										{(allOrders.filter(o => o.cancellationStatus === "requested").length + 
										  allOrders.filter(o => o.returnStatus === "requested").length +
										  allOrders.filter(o => o.customerFeedback && o.customerFeedback.length > 0 && 
										  o.customerFeedback.some(f => !f.isAdmin)).length)}
									</p>
									<p className="text-xs text-white/70 mt-1">Action items</p>
								</div>
							</div>
						</div>
						<div className="p-6">
							<div className="space-y-3 max-h-80 overflow-y-auto">
								{/* Cancellation Requests */}
								{allOrders.filter(o => o.cancellationStatus === "requested").slice(0, 2).map((order, index) => (
									<div 
										key={`cancel-${index}`}
										className="group flex items-start gap-3 p-4 rounded-xl hover:bg-red-50 transition-all border-2 border-red-100 hover:border-red-300 hover:shadow-md"
									>
										<div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
											</svg>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold text-secondary group-hover:text-red-700 transition-colors">
													Cancellation Request
												</p>
												<span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
													URGENT
												</span>
											</div>
											<p className="text-xs text-secondary/60">Order #{order.orderID} • {order.customerName}</p>
											<p className="text-xs text-red-600 mt-1 line-clamp-2">{order.cancellationReason || "No reason provided"}</p>
											<div className="flex items-center gap-1 mt-1">
												<svg className="w-3 h-3 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												<span className="text-xs text-secondary/50">
													{new Date(order.createdAt || order.date).toLocaleString('en-US', { 
														month: 'short', 
														day: 'numeric', 
														hour: '2-digit', 
														minute: '2-digit' 
													})}
												</span>
											</div>
										</div>
										<a 
											href="/admin/user-orders"
											className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold whitespace-nowrap hover:underline"
										>
											Review
											<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</a>
									</div>
								))}

								{/* Return Requests */}
								{allOrders.filter(o => o.returnStatus === "requested").slice(0, 2).map((order, index) => (
									<div 
										key={`return-${index}`}
										className="group flex items-start gap-3 p-4 rounded-xl hover:bg-pink-50 transition-all border-2 border-pink-100 hover:border-pink-300 hover:shadow-md"
									>
										<div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
											</svg>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2 mb-1">
												<p className="font-semibold text-secondary group-hover:text-pink-700 transition-colors">
													Return Request
												</p>
												<span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
													REVIEW
												</span>
											</div>
											<p className="text-xs text-secondary/60">Order #{order.orderID} • {order.customerName}</p>
											<p className="text-xs text-pink-600 mt-1 line-clamp-2">{order.returnReason || "No reason provided"}</p>
											<div className="flex items-center gap-1 mt-1">
												<svg className="w-3 h-3 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
												</svg>
												<span className="text-xs text-secondary/50">
													{new Date(order.createdAt || order.date).toLocaleString('en-US', { 
														month: 'short', 
														day: 'numeric', 
														hour: '2-digit', 
														minute: '2-digit' 
													})}
												</span>
											</div>
										</div>
										<a 
											href="/admin/user-orders"
											className="inline-flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 font-semibold whitespace-nowrap hover:underline"
										>
											Review
											<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</a>
									</div>
								))}

								{/* New Customer Feedback */}
								{allOrders
									.filter(o => o.customerFeedback && o.customerFeedback.length > 0 && 
										o.customerFeedback.some(f => !f.isAdmin))
									.slice(0, 2)
									.map((order, index) => {
										const customerFeedback = order.customerFeedback.filter(f => !f.isAdmin);
										const latestFeedback = customerFeedback[customerFeedback.length - 1];
										return (
											<div 
												key={`feedback-${index}`}
												className="group flex items-start gap-3 p-4 rounded-xl hover:bg-purple-50 transition-all border-2 border-purple-100 hover:border-purple-300 hover:shadow-md"
											>
												<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
													<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
													</svg>
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<p className="font-semibold text-secondary group-hover:text-purple-700 transition-colors">
															Customer Feedback
														</p>
														<span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
															NEW
														</span>
													</div>
													<p className="text-xs text-secondary/60">Order #{order.orderID} • {order.customerName}</p>
													<p className="text-xs text-purple-600 mt-1 line-clamp-2">
														"{latestFeedback.message}"
													</p>
													<div className="flex items-center gap-1 mt-1">
														<svg className="w-3 h-3 text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
														</svg>
														<span className="text-xs text-secondary/50">
															{new Date(latestFeedback.date).toLocaleString('en-US', { 
																month: 'short', 
																day: 'numeric', 
																hour: '2-digit', 
																minute: '2-digit' 
															})}
														</span>
													</div>
												</div>
												<a 
													href="/admin/user-orders"
													className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold whitespace-nowrap hover:underline"
												>
													Reply
													<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
													</svg>
												</a>
											</div>
										);
									})}

								{/* No Notifications */}
								{allOrders.filter(o => o.cancellationStatus === "requested").length === 0 &&
								 allOrders.filter(o => o.returnStatus === "requested").length === 0 &&
								 allOrders.filter(o => o.customerFeedback && o.customerFeedback.length > 0 && 
								 o.customerFeedback.some(f => !f.isAdmin)).length === 0 && (
									<div className="text-center py-8">
										<div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
											<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
										</div>
										<p className="text-secondary/60 font-semibold">All clear!</p>
										<p className="text-xs text-secondary/50 mt-1">No pending notifications</p>
									</div>
								)}

								{/* View All Link */}
								{((allOrders.filter(o => o.cancellationStatus === "requested").length + 
								  allOrders.filter(o => o.returnStatus === "requested").length +
								  allOrders.filter(o => o.customerFeedback && o.customerFeedback.length > 0 && 
								  o.customerFeedback.some(f => !f.isAdmin)).length) > 4) && (
									<a 
										href="/admin/user-orders"
										className="block text-center py-3 bg-purple-50 hover:bg-purple-100 rounded-xl text-purple-700 font-semibold transition-all border-2 border-purple-200 mt-3"
									>
										View All Notifications
									</a>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Recent Orders - Enhanced Table */}
				<div className="bg-white rounded-3xl border-2 border-accent/20 overflow-hidden mb-8 shadow-xl">
					<div className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary px-6 py-5">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<FaShoppingCart className="text-white text-xl" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white flex items-center gap-2">
										Recent Orders
										<span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
											Latest 5
										</span>
									</h2>
									<p className="text-sm text-white/70">Latest customer orders and transactions</p>
								</div>
							</div>
							<a 
								href="/admin/orders"
								className="group px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
							>
								<span>View All Orders</span>
								<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</a>
						</div>
					</div>
					<div className="p-6">
						{recentOrders.length > 0 ? (
							<div className="space-y-4">
								{recentOrders.map((order, index) => (
									<div 
										key={index}
										className="group flex items-center justify-between p-5 rounded-2xl hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent transition-all border-2 border-secondary/10 hover:border-accent/30 hover:shadow-lg hover:-translate-y-1 duration-300"
									>
										<div className="flex items-center gap-5">
											<div className="relative">
												<div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
													#{index + 1}
												</div>
												<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
											</div>
											<div>
												<p className="font-bold text-secondary text-lg mb-1 group-hover:text-accent transition-colors">
													{order.email || "Customer"}
												</p>
												<div className="flex items-center gap-4 text-sm text-secondary/60">
													<span className="flex items-center gap-1">
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
														</svg>
														{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
													</span>
													<span className="flex items-center gap-1">
														<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
														</svg>
														{order.items?.length || 0} items
													</span>
												</div>
											</div>
										</div>
										<div className="flex items-center gap-6">
											<div className="text-right">
												<p className="font-bold text-secondary text-2xl mb-1 group-hover:text-accent transition-colors">
													LKR {order.total?.toLocaleString()}
												</p>
												<span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border-2 shadow-sm ${
													order.status === "delivered" || order.status === "completed"
														? "bg-green-100 text-green-700 border-green-300" 
														: order.status === "pending"
														? "bg-orange-100 text-orange-700 border-orange-300"
														: order.status === "shipped"
														? "bg-cyan-100 text-cyan-700 border-cyan-300"
														: order.status === "refunded"
														? "bg-pink-100 text-pink-700 border-pink-300"
														: order.status === "cancelled"
														? "bg-red-100 text-red-700 border-red-300"
														: "bg-blue-100 text-blue-700 border-blue-300"
												}`}>
													<span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
													{order.status?.toUpperCase()}
												</span>
											</div>
											<svg className="w-6 h-6 text-secondary/20 group-hover:text-accent group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-center py-16">
								<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
									<svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
									</svg>
								</div>
								<p className="text-secondary/80 font-bold text-lg mb-2">No recent orders</p>
								<p className="text-secondary/50 text-sm">Orders will appear here once customers place them</p>
							</div>
						)}
					</div>
				</div>

				{/* Quick Actions - Enhanced Design with Animations */}
				<div className="bg-white rounded-3xl border-2 border-accent/20 p-8 shadow-xl relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
					<div className="relative">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg">
								<svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<div>
								<h2 className="text-2xl font-bold text-secondary">Quick Actions</h2>
								<p className="text-sm text-secondary/60">Frequently used shortcuts</p>
							</div>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<a 
								href="/admin/add-product" 
								className="group bg-gradient-to-br from-white to-primary/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-accent/20 hover:border-accent/40 hover:-translate-y-2 relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
								<div className="relative">
									<div className="flex items-start justify-between mb-4">
										<div className="w-14 h-14 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
											<FaBox className="text-white text-2xl" />
										</div>
										<svg className="w-6 h-6 text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</div>
									<h3 className="font-bold text-secondary text-lg mb-2 group-hover:text-accent transition-colors">
										Add New Product
									</h3>
									<p className="text-sm text-secondary/60 mb-4">Create and publish a new product to your store</p>
									<div className="flex items-center gap-2 text-xs text-accent font-semibold">
										<span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
										<span>Quick Action</span>
									</div>
								</div>
							</a>
							<a 
								href="/admin/orders" 
								className="group bg-gradient-to-br from-white to-primary/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 hover:-translate-y-2 relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
								<div className="relative">
									<div className="flex items-start justify-between mb-4">
										<div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
											<FaShoppingCart className="text-white text-2xl" />
										</div>
										<svg className="w-6 h-6 text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</div>
									<h3 className="font-bold text-secondary text-lg mb-2 group-hover:text-blue-600 transition-colors">
										Manage Orders
									</h3>
									<p className="text-sm text-secondary/60 mb-4">View and process customer orders and transactions</p>
									<div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
										<span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
										<span>Quick Action</span>
									</div>
								</div>
							</a>
							<a 
								href="/admin/users" 
								className="group bg-gradient-to-br from-white to-primary/30 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 hover:-translate-y-2 relative overflow-hidden"
							>
								<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-300/20 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
								<div className="relative">
									<div className="flex items-start justify-between mb-4">
										<div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
											<FaUsers className="text-white text-2xl" />
										</div>
										<svg className="w-6 h-6 text-green-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
										</svg>
									</div>
									<h3 className="font-bold text-secondary text-lg mb-2 group-hover:text-green-600 transition-colors">
										Manage Users
									</h3>
									<p className="text-sm text-secondary/60 mb-4">View and manage registered users and admins</p>
									<div className="flex items-center gap-2 text-xs text-green-600 font-semibold">
										<span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
										<span>Quick Action</span>
									</div>
								</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}