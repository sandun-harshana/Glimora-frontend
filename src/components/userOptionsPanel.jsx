import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FaUser,
	FaHeart,
	FaShoppingBag,
	FaGift,
	FaQuestionCircle,
	FaCog,
	FaSignOutAlt,
	FaTimes,
	FaShoppingCart,
	FaBell,
	FaEnvelope,
	FaArrowLeft,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import axios from "axios";
import toast from "react-hot-toast";

export default function UserOptionsPanel({ isOpen, onClose }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [orderCount, setOrderCount] = useState(0);
	const navigate = useNavigate();

	useEffect(() => {
		if (isOpen) {
			fetchUserData();
			fetchOrderCount();
		}
	}, [isOpen]);

	const fetchUserData = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			setIsLoading(false);
			return;
		}

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUser(res.data);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching user data:", err);
			setIsLoading(false);
		}
	};

	const fetchOrderCount = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			return;
		}

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (Array.isArray(res.data)) {
				setOrderCount(res.data.length);
			}
		} catch (err) {
			console.error("Error fetching order count:", err);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		toast.success("Logged out successfully!");
		setUser(null);
		onClose();
		navigate("/login");
	};

	const handleNavigation = (path) => {
		onClose();
		navigate(path);
	};

	// Get user initials for avatar
	const getUserInitials = () => {
		if (!user) return "?";
		const firstName = user.firstName || user.email?.charAt(0) || "U";
		const lastName = user.lastName || "";
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	// Menu items configuration
	const menuItems = [
		{
			icon: <FaUser />,
			label: "My Profile",
			path: "/profile",
			color: "text-blue-600",
			bgColor: "bg-blue-100",
			show: !!user,
		},
		{
			icon: <FaShoppingBag />,
			label: "My Orders",
			path: "/my-orders",
			color: "text-green-600",
			bgColor: "bg-green-100",
			show: !!user,
		},
		{
			icon: <FaShoppingCart />,
			label: "Shopping Cart",
			path: "/cart",
			color: "text-orange-600",
			bgColor: "bg-orange-100",
			show: true,
		},
		{
			icon: <FaHeart />,
			label: "Wishlist",
			path: "/wishlist",
			color: "text-pink-600",
			bgColor: "bg-pink-100",
			show: true,
		},
		{
			icon: <FaGift />,
			label: "Rewards",
			path: "/rewards",
			color: "text-purple-600",
			bgColor: "bg-purple-100",
			show: !!user,
		},
		{
			icon: <FaQuestionCircle />,
			label: "Help Center",
			path: "/help",
			color: "text-indigo-600",
			bgColor: "bg-indigo-100",
			show: true,
		},
		{
			icon: <FaCog />,
			label: "Settings",
			path: "/settings",
			color: "text-gray-600",
			bgColor: "bg-gray-100",
			show: !!user,
		},
	];

	// Admin menu item
	const adminMenuItem = {
		icon: <MdDashboard />,
		label: "Admin Dashboard",
		path: "/admin",
		color: "text-red-600",
		bgColor: "bg-red-100",
		show: user?.role === "admin",
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={onClose}
			></div>

			{/* Side Panel */}
			<div
				className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				{/* Header */}
				<div className="bg-gradient-to-r from-accent to-accent/80 p-6 text-white sticky top-0 z-10">
					   <div className="flex items-center justify-between mb-4">
						   <div className="flex items-center gap-2">
							   <button
								   onClick={() => navigate(-1)}
								   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all mr-2"
								   aria-label="Go Back"
							   >
								   <FaArrowLeft className="text-xl" />
							   </button>
							   <h2 className="text-2xl font-bold">My Account</h2>
						   </div>
						   <button
							   onClick={onClose}
							   className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
							   aria-label="Close Panel"
						   >
							   <FaTimes className="text-xl" />
						   </button>
					   </div>

					{/* User Info */}
					{isLoading ? (
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-white/20 rounded-full animate-pulse"></div>
							<div className="flex-1">
								<div className="h-4 bg-white/20 rounded w-3/4 mb-2 animate-pulse"></div>
								<div className="h-3 bg-white/20 rounded w-1/2 animate-pulse"></div>
							</div>
						</div>
					) : user ? (
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-white to-white/80 rounded-full flex items-center justify-center text-accent text-2xl font-bold shadow-lg">
								{getUserInitials()}
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-bold">
									{user.firstName} {user.lastName}
								</h3>
								<p className="text-white/80 text-sm">{user.email}</p>
								{user.role === "admin" && (
									<span className="inline-block mt-1 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
										ADMIN
									</span>
								)}
							</div>
						</div>
					) : (
						<div className="text-center py-4">
							<p className="mb-4">Sign in to access all features</p>
							<div className="flex gap-3">
								<button
									onClick={() => handleNavigation("/login")}
									className="flex-1 px-6 py-3 bg-white text-accent rounded-xl font-bold hover:bg-white/90 transition-all"
								>
									Login
								</button>
								<button
									onClick={() => handleNavigation("/register")}
									className="flex-1 px-6 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-all border-2 border-white"
								>
									Sign Up
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Menu Items */}
				<div className="p-6">
					{/* Quick Stats - Only for logged in users */}
					{user && (
						<div className="grid grid-cols-3 gap-3 mb-6">
							<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border-2 border-blue-200">
								<FaShoppingBag className="text-2xl text-blue-600 mx-auto mb-2" />
								<p className="text-2xl font-bold text-blue-700">{orderCount}</p>
								<p className="text-xs text-blue-600 font-semibold">Orders</p>
							</div>
							<div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center border-2 border-pink-200">
								<FaHeart className="text-2xl text-pink-600 mx-auto mb-2" />
								<p className="text-2xl font-bold text-pink-700">
									{JSON.parse(localStorage.getItem("wishlist") || "[]").length}
								</p>
								<p className="text-xs text-pink-600 font-semibold">Wishlist</p>
							</div>
							<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border-2 border-purple-200">
								<FaGift className="text-2xl text-purple-600 mx-auto mb-2" />
								<p className="text-2xl font-bold text-purple-700">{user.points || 0}</p>
								<p className="text-xs text-purple-600 font-semibold">Points</p>
							</div>
						</div>
					)}

					{/* Admin Dashboard - Show first if admin */}
					{adminMenuItem.show && (
						<div className="mb-4">
							<button
								onClick={() => handleNavigation(adminMenuItem.path)}
								className={`w-full flex items-center gap-4 p-4 rounded-xl ${adminMenuItem.bgColor} hover:shadow-lg transition-all group border-2 border-red-300`}
							>
								<div
									className={`w-12 h-12 ${adminMenuItem.bgColor} rounded-xl flex items-center justify-center ${adminMenuItem.color} text-xl group-hover:scale-110 transition-transform border-2 border-red-400`}
								>
									{adminMenuItem.icon}
								</div>
								<span
									className={`font-bold ${adminMenuItem.color} group-hover:translate-x-1 transition-transform`}
								>
									{adminMenuItem.label}
								</span>
							</button>
						</div>
					)}

					{/* Navigation Menu */}
					<div className="space-y-2">
						<h3 className="text-sm font-bold text-secondary/60 mb-3 px-2">
							NAVIGATION
						</h3>
						{menuItems
							.filter((item) => item.show)
							.map((item, index) => (
								<button
									key={index}
									onClick={() => handleNavigation(item.path)}
									className={`w-full flex items-center gap-4 p-4 rounded-xl ${item.bgColor} hover:shadow-lg transition-all group`}
								>
									<div
										className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center ${item.color} text-xl group-hover:scale-110 transition-transform`}
									>
										{item.icon}
									</div>
									<span
										className={`font-bold ${item.color} group-hover:translate-x-1 transition-transform`}
									>
										{item.label}
									</span>
								</button>
							))}
					</div>

					{/* Logout Button */}
					{user && (
						<div className="mt-6 pt-6 border-t border-secondary/10">
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-4 p-4 rounded-xl bg-red-50 hover:bg-red-100 transition-all group border-2 border-red-200"
							>
								<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-xl group-hover:scale-110 transition-transform">
									<FaSignOutAlt />
								</div>
								<span className="font-bold text-red-600 group-hover:translate-x-1 transition-transform">
									Logout
								</span>
							</button>
						</div>
					)}

					{/* Quick Links */}
					<div className="mt-6 pt-6 border-t border-secondary/10">
						<h3 className="text-sm font-bold text-secondary/60 mb-3 px-2">
							QUICK LINKS
						</h3>
						<div className="space-y-2">
							<Link
								to="/about"
								onClick={onClose}
								className="block px-4 py-2 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
							>
								About Us
							</Link>
							<Link
								to="/contact"
								onClick={onClose}
								className="block px-4 py-2 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
							>
								Contact Us
							</Link>
							<Link
								to="/help"
								onClick={onClose}
								className="block px-4 py-2 text-secondary hover:bg-secondary/5 rounded-lg transition-all"
							>
								Help & Support
							</Link>
						</div>
					</div>

					{/* App Info */}
					<div className="mt-6 pt-6 border-t border-secondary/10 text-center">
						<p className="text-sm text-secondary/60">
							CBC E-Commerce Platform
						</p>
						<p className="text-xs text-secondary/40 mt-1">Version 1.0.0</p>
					</div>
				</div>
			</div>
		</>
	);
}
