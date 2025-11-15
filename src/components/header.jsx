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
		<header className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 h-[100px] text-white shadow-2xl relative z-50 overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
			
			<div className="max-w-[1600px] mx-auto h-full flex items-center justify-between px-6 lg:px-10 relative z-10">
				{/* Logo - Desktop */}
				<Link to="/" className="hidden lg:flex items-center gap-3 group">
					<div className="relative">
						<div className="absolute -inset-2 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
						<img
							src="/logo.png"
							className="relative h-[80px] w-auto object-contain transition-transform group-hover:scale-110 duration-300 drop-shadow-2xl"
							alt="GBG Logo"
						/>
					</div>
				</Link>

				{/* Mobile Header */}
				<div className="lg:hidden w-full flex items-center justify-between">
					<button
						onClick={() => setIsSidebarOpen(true)}
						className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
						aria-label="Open menu"
					>
						<MdMenu className="text-3xl drop-shadow-lg" />
					</button>
					<Link to="/" className="flex items-center">
						<div className="relative">
							<div className="absolute -inset-2 bg-white/20 rounded-full blur-xl"></div>
							<img src="/logo.png" className="relative h-[70px] w-auto object-contain drop-shadow-2xl" alt="GBG Logo" />
						</div>
					</Link>
					<div className="flex items-center gap-2">
						<NotificationBell />
						<Link
							to="/cart"
							className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 relative hover:scale-110"
						>
							<BsCart3 className="text-2xl drop-shadow-lg" />
						</Link>
						{user ? (
							<button
								onClick={() => setIsUserPanelOpen(true)}
								className="flex items-center gap-2 px-2 py-1 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105"
								aria-label="Open user menu"
							>
								<div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold text-sm shadow-xl">
									{getUserInitials()}
								</div>
								<span className="text-sm font-semibold text-white drop-shadow-lg">
									{user.firstName}
								</span>
							</button>
						) : (
							<button
								onClick={() => setIsUserPanelOpen(true)}
								className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
								aria-label="Open user menu"
							>
								<FaUserCircle className="text-2xl drop-shadow-lg" />
							</button>
						)}
					</div>
				</div>

				{/* Mobile Sidebar */}
				{isSideBarOpen && (
					<div className="fixed inset-0 bg-secondary/80 backdrop-blur-sm z-[100] lg:hidden animate-fade-in">
						<div className="w-[320px] bg-gradient-to-b from-purple-50 via-pink-50 to-white h-full flex flex-col shadow-2xl animate-slide-in">
							{/* Sidebar Header */}
							<div className="h-[100px] w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-between px-6 shadow-xl relative overflow-hidden">
								<div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
								<div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
								<button
									onClick={() => setIsSidebarOpen(false)}
									className="relative z-10 p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110"
									aria-label="Close menu"
								>
									<MdClose className="text-white text-3xl drop-shadow-lg" />
								</button>
								<div className="relative">
									<div className="absolute -inset-2 bg-white/20 rounded-full blur-xl"></div>
									<img
										src="/logo.png"
										className="relative h-[70px] w-auto object-contain drop-shadow-2xl"
										alt="GBG Logo"
									/>
								</div>
								<div className="w-10"></div>
							</div>

							{/* Sidebar Menu */}
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
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
						}`}
					>
						Home
					</Link>
					<Link
						to="/products"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/products') 
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
						}`}
					>
						Products
					</Link>
					<Link
						to="/wishlist"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/wishlist') 
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
						}`}
					>
						Wishlist
					</Link>
					<Link
						to="/help"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/help') 
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
						}`}
					>
						Help
					</Link>
					<Link
						to="/about"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/about') 
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
						}`}
					>
						About
					</Link>
					<Link
						to="/contact"
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 ${
							isActive('/contact') 
								? 'bg-white/30 text-white shadow-xl scale-105 backdrop-blur-sm' 
								: 'hover:bg-white/20 text-white/90 hover:scale-105'
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
						className="relative p-3 hover:bg-white/20 rounded-xl transition-all duration-300 group hover:scale-110"
					>
						<BsCart3 className="text-2xl group-hover:scale-110 transition-transform drop-shadow-lg" />
					</Link>
					
					{/* User Profile Display */}
					{user ? (
						<button
							onClick={() => setIsUserPanelOpen(true)}
							className="flex items-center gap-3 px-4 py-2 hover:bg-white/20 rounded-xl transition-all duration-300 group hover:scale-105"
							aria-label="Open user menu"
						>
							<div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-bold shadow-xl group-hover:scale-110 transition-transform">
								{getUserInitials()}
							</div>
							<div className="text-left">
								<p className="text-sm font-bold text-white leading-tight drop-shadow-lg">
									{user.firstName} {user.lastName}
								</p>
								<p className="text-xs text-white/90">View Profile</p>
							</div>
						</button>
					) : (
						<button
							onClick={() => setIsUserPanelOpen(true)}
							className="p-3 hover:bg-white/20 rounded-xl transition-all duration-300 group hover:scale-110"
							aria-label="Open user menu"
						>
							<FaUserCircle className="text-2xl group-hover:scale-110 transition-transform drop-shadow-lg" />
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
