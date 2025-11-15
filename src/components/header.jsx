import { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { MdMenu, MdClose } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./notificationBell";
import UserOptionsPanel from "./userOptionsPanel";

export default function Header() {
	const [isSideBarOpen, setIsSidebarOpen] = useState(false);
	const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
	const [user, setUser] = useState(null);
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUser(res.data);
		} catch (err) {
			console.error("Error fetching user:", err);
		}
	};

	const getUserInitials = () => {
		if (!user) return "?";
		const firstName = user.firstName || user.email?.charAt(0) || "U";
		const lastName = user.lastName || "";
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<header className="w-full bg-pink-200 h-[100px] text-secondary shadow-md border-b-2 border-accent/20 relative z-50">
			<div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-6 lg:px-10 relative">
				{/* Logo - Desktop */}
				<Link to="/" className="hidden lg:flex items-center gap-3 group">
					<div className="relative">
						<img
							src="/logo.png"
							className="h-[80px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
							alt="GBG Logo"
						/>
					</div>
				</Link>

				{/* Mobile Header */}
				<div className="lg:hidden w-full flex items-center justify-between">
					<button
						onClick={() => setIsSidebarOpen(true)}
						className="p-2 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-105 text-secondary"
						aria-label="Open menu"
					>
						<MdMenu className="text-3xl" />
					</button>
					<Link to="/" className="flex items-center">
						<img src="/logo.png" className="h-[70px] w-auto object-contain" alt="GBG Logo" />
					</Link>
					<div className="flex items-center gap-2">
						<NotificationBell />
						<Link
							to="/cart"
							className="p-2 hover:bg-accent/10 rounded-xl transition-all duration-300 relative hover:scale-105 text-secondary"
						>
							<BsCart3 className="text-2xl" />
						</Link>
						{user ? (
							<button
								onClick={() => setIsUserPanelOpen(true)}
								className="flex items-center gap-2 px-2 py-1 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-105"
								aria-label="Open user menu"
							>
							<div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-sm shadow-md">
								{getUserInitials()}
							</div>
								<span className="text-sm font-semibold text-secondary">
									{user.firstName}
								</span>
							</button>
						) : (
							<button
								onClick={() => setIsUserPanelOpen(true)}
								className="p-2 hover:bg-accent/10 rounded-xl transition-all duration-300 hover:scale-105 text-secondary"
								aria-label="Open user menu"
							>
								<FaUserCircle className="text-2xl" />
							</button>
						)}
					</div>
				</div>

				{/* Mobile Sidebar */}
				{isSideBarOpen && (
					<div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] lg:hidden animate-fade-in">
					<div className="w-[320px] bg-pink-200 h-full flex flex-col shadow-2xl animate-slide-in">
						{/* Sidebar Header */}
						<div className="h-[100px] w-full bg-accent flex items-center justify-between px-6 shadow-md border-b-2 border-accent/30">
							<button
								onClick={() => setIsSidebarOpen(false)}
								className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 text-white"
								aria-label="Close menu"
							>
								<MdClose className="text-3xl" />
							</button>
							<img
								src="/logo.png"
								className="h-[70px] w-auto object-contain"
								alt="GBG Logo"
							/>
							<div className="w-10"></div>
						</div>							{/* Sidebar Menu */}
							<nav className="flex flex-col py-4">
								<Link
									to="/"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/') 
											? 'border-pink-500 bg-gradient-to-r from-pink-100 to-transparent text-pink-600' 
											: 'border-transparent hover:border-pink-300 hover:bg-pink-50 text-secondary'
									}`}
								>
									🏠 Home
								</Link>
								<Link
									to="/products"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/products') 
											? 'border-purple-500 bg-gradient-to-r from-purple-100 to-transparent text-purple-600' 
											: 'border-transparent hover:border-purple-300 hover:bg-purple-50 text-secondary'
									}`}
								>
									🛍️ Products
								</Link>
								<Link
									to="/wishlist"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/wishlist') 
											? 'border-pink-500 bg-gradient-to-r from-pink-100 to-transparent text-pink-600' 
											: 'border-transparent hover:border-pink-300 hover:bg-pink-50 text-secondary'
									}`}
								>
									💖 Wishlist
								</Link>
								<Link
									to="/my-orders"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/my-orders') 
											? 'border-orange-500 bg-gradient-to-r from-orange-100 to-transparent text-orange-600' 
											: 'border-transparent hover:border-orange-300 hover:bg-orange-50 text-secondary'
									}`}
								>
									📦 My Orders
								</Link>
								<Link
									to="/messages"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/messages') 
											? 'border-blue-500 bg-gradient-to-r from-blue-100 to-transparent text-blue-600' 
											: 'border-transparent hover:border-blue-300 hover:bg-blue-50 text-secondary'
									}`}
								>
									💬 Messages
								</Link>
								<Link
									to="/profile"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/profile') 
											? 'border-purple-500 bg-gradient-to-r from-purple-100 to-transparent text-purple-600' 
											: 'border-transparent hover:border-purple-300 hover:bg-purple-50 text-secondary'
									}`}
								>
									👤 Profile
								</Link>
								<Link
									to="/rewards"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/rewards') 
											? 'border-yellow-500 bg-gradient-to-r from-yellow-100 to-transparent text-yellow-600' 
											: 'border-transparent hover:border-yellow-300 hover:bg-yellow-50 text-secondary'
									}`}
								>
									🎁 Rewards
								</Link>
								<Link
									to="/help"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/help') 
											? 'border-green-500 bg-gradient-to-r from-green-100 to-transparent text-green-600' 
											: 'border-transparent hover:border-green-300 hover:bg-green-50 text-secondary'
									}`}
								>
									❓ Help Center
								</Link>
								<Link
									to="/about"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/about') 
											? 'border-indigo-500 bg-gradient-to-r from-indigo-100 to-transparent text-indigo-600' 
											: 'border-transparent hover:border-indigo-300 hover:bg-indigo-50 text-secondary'
									}`}
								>
									ℹ️ About
								</Link>
								<Link
									to="/contact"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/contact') 
											? 'border-pink-500 bg-gradient-to-r from-pink-100 to-transparent text-pink-600' 
											: 'border-transparent hover:border-pink-300 hover:bg-pink-50 text-secondary'
									}`}
								>
									📧 Contact
								</Link>
								<Link
									to="/cart"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 ${
										isActive('/cart') 
											? 'border-orange-500 bg-gradient-to-r from-orange-100 to-transparent text-orange-600' 
											: 'border-transparent hover:border-orange-300 hover:bg-orange-50 text-secondary'
									}`}
								>
									🛒 Cart
								</Link>
							</nav>

						</div>
					</div>
				)}

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center gap-2">
					<Link
						to="/"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Home
					</Link>
					<Link
						to="/products"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/products') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Products
					</Link>
					<Link
						to="/wishlist"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/wishlist') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Wishlist
					</Link>
					<Link
						to="/help"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/help') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Help
					</Link>
					<Link
						to="/about"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/about') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						About
					</Link>
					<Link
						to="/contact"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/contact') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Contact
					</Link>
				</nav>

				{/* Desktop Right Section */}
				<div className="hidden lg:flex items-center gap-4">
					<NotificationBell />
					<Link
						to="/cart"
						className="relative p-3 hover:bg-accent/10 rounded-xl transition-all duration-300 group hover:scale-105 text-secondary"
					>
						<BsCart3 className="text-2xl group-hover:scale-110 transition-transform" />
					</Link>
					
					{/* User Profile Display */}
					{user ? (
						<button
							onClick={() => setIsUserPanelOpen(true)}
							className="flex items-center gap-3 px-4 py-2 hover:bg-accent/10 rounded-xl transition-all duration-300 group hover:scale-105"
							aria-label="Open user menu"
						>
							<div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary font-bold shadow-md group-hover:scale-110 transition-transform">
								{getUserInitials()}
							</div>
							<div className="text-left">
								<p className="text-sm font-bold text-secondary leading-tight">
									{user.firstName} {user.lastName}
								</p>
								<p className="text-xs text-secondary/60">View Profile</p>
							</div>
						</button>
					) : (
						<button
							onClick={() => setIsUserPanelOpen(true)}
							className="p-3 hover:bg-accent/10 rounded-xl transition-all duration-300 group hover:scale-105 text-secondary"
							aria-label="Open user menu"
						>
							<FaUserCircle className="text-2xl group-hover:scale-110 transition-transform" />
						</button>
					)}
				</div>
			</div>

			{/* User Options Panel */}
			<UserOptionsPanel isOpen={isUserPanelOpen} onClose={() => setIsUserPanelOpen(false)} />

			<style jsx>{`
				@keyframes fade-in {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slide-in {
					from { transform: translateX(-100%); }
					to { transform: translateX(0); }
				}
				.animate-fade-in {
					animation: fade-in 0.3s ease-out;
				}
				.animate-slide-in {
					animation: slide-in 0.3s ease-out;
				}
			`}</style>
		</header>
	);
}
