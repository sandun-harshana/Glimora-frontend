import { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { MdMenu, MdClose } from "react-icons/md";
import { FaUserCircle, FaHeart, FaHome, FaShoppingBag, FaBox, FaComments, FaUser, FaGift, FaQuestionCircle, FaInfoCircle, FaEnvelope } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import NotificationBell from "./notificationBell";
import UserOptionsPanel from "./userOptionsPanel";

export default function Header() {
	const [isSideBarOpen, setIsSidebarOpen] = useState(false);
	const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [wishlistCount, setWishlistCount] = useState(0);
	const location = useLocation();

	const isActive = (path) => location.pathname === path;

	useEffect(() => {
		fetchUser();
		fetchWishlistCount();

		// Listen for wishlist updates
		const handleWishlistUpdate = () => {
			fetchWishlistCount();
		};
		
		// Listen for user login
		const handleUserLogin = () => {
			fetchUser();
			fetchWishlistCount();
		};
		
		window.addEventListener('wishlist-updated', handleWishlistUpdate);
		window.addEventListener('user-logged-in', handleUserLogin);

		return () => {
			window.removeEventListener('wishlist-updated', handleWishlistUpdate);
			window.removeEventListener('user-logged-in', handleUserLogin);
		};
	}, []);

	// Fetch wishlist count when user state changes
	useEffect(() => {
		fetchWishlistCount();
	}, [user]);

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

	const fetchWishlistCount = async () => {
		const token = localStorage.getItem("token");
		
		if (!token) {
			// If not logged in, check localStorage
			const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
			setWishlistCount(wishlist.length);
			return;
		}

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/wishlist", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setWishlistCount(res.data.wishlist?.length || 0);
		} catch (err) {
			console.error("Error fetching wishlist:", err);
			setWishlistCount(0);
		}
	};

	const getUserInitials = () => {
		if (!user) return "?";
		const firstName = user.firstName || user.email?.charAt(0) || "U";
		const lastName = user.lastName || "";
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	return (
		<header className="w-full bg-purple-400 h-[100px] text-secondary shadow-md border-b-2 border-accent/20 relative z-50">
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
				<div className="w-[320px] bg-white h-full flex flex-col shadow-2xl animate-slide-in">
					{/* Sidebar Header */}
					<div className="h-[100px] w-full bg-gradient-to-br from-purple-400 via-purple-400 to-purple-500 flex items-center justify-between px-6 shadow-lg border-b border-purple-500/20">
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
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
										isActive('/') 
											? 'border-accent bg-accent/20 text-accent shadow-md' 
											: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
									}`}
								>
									<FaHome className="inline-block mr-3 text-lg" /> Home
								</Link>
							<Link
								to="/products"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/products') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaShoppingBag className="inline-block mr-3 text-lg" /> Products
							</Link>
							<Link
								to="/wishlist"
								onClick={() => setIsSidebarOpen(false)}
							className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 flex items-center justify-between ${
								isActive('/wishlist') 
									? 'border-accent bg-accent/20 text-accent shadow-md' 
									: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
							}`}
						>
							<span><FaHeart className="inline-block mr-3 text-lg" /> Wishlist</span>
							{wishlistCount > 0 && (
								<span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
										{wishlistCount}
									</span>
								)}
							</Link>
							<Link
								to="/my-orders"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/my-orders') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaBox className="inline-block mr-3 text-lg" /> My Orders
							</Link>
							<Link
								to="/messages"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/messages') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaComments className="inline-block mr-3 text-lg" /> Messages
							</Link>
							<Link
								to="/profile"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/profile') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaUser className="inline-block mr-3 text-lg" /> Profile
							</Link>
							<Link
								to="/rewards"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/rewards') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaGift className="inline-block mr-3 text-lg" /> Rewards
							</Link>
							<Link
								to="/help"
								onClick={() => setIsSidebarOpen(false)}
								className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
									isActive('/help') 
										? 'border-accent bg-accent/20 text-accent shadow-md' 
										: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
								}`}
							>
								<FaQuestionCircle className="inline-block mr-3 text-lg" /> Help Center
							</Link>
								<Link
									to="/about"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
										isActive('/about') 
											? 'border-accent bg-accent/20 text-accent shadow-md' 
											: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
									}`}
								>
									<FaInfoCircle className="inline-block mr-3 text-lg" /> About
								</Link>
								<Link
									to="/contact"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
										isActive('/contact') 
											? 'border-accent bg-accent/20 text-accent shadow-md' 
											: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
									}`}
								>
									<FaEnvelope className="inline-block mr-3 text-lg" /> Contact
								</Link>
								<Link
									to="/cart"
									onClick={() => setIsSidebarOpen(false)}
									className={`px-6 py-4 font-semibold transition-all duration-300 border-l-4 rounded-r-xl mx-2 ${
										isActive('/cart') 
											? 'border-accent bg-accent/20 text-accent shadow-md' 
											: 'border-transparent hover:border-accent/50 hover:bg-accent/10 text-secondary'
									}`}
								>
									<BsCart3 className="inline-block mr-3 text-lg" /> Cart
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
								: 'hover:bg-accent/10 text-secondary hover:text-white'
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
						className={`px-5 py-2 rounded-xl font-semibold transition-all duration-300 relative ${
							isActive('/wishlist') 
								? 'bg-accent text-white shadow-md' 
								: 'hover:bg-accent/10 text-secondary hover:text-accent'
						}`}
					>
						Wishlist
						{wishlistCount > 0 && (
							<span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
								{wishlistCount}
							</span>
						)}
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
