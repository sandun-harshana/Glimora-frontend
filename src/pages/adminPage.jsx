import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { FaChartLine, FaChartBar, FaCog, FaStar, FaHistory, FaGift, FaHeart } from "react-icons/fa";
import { MdShoppingCartCheckout, MdLogout, MdInventory } from "react-icons/md";
import { BsBox2Heart } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { FaEnvelope, FaShoppingBag } from "react-icons/fa";
import AdminProductPage from "./admin/adminProductPage";
import AddProductPage from "./admin/adminAddNewProduct";
import UpdateProductPage from "./admin/adminUpdateProduct";
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminDashboard from "./admin/adminDashboard";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import AdminUsersPage from "./admin/usersPage";
import AdminMessagesPage from "./admin/adminMessagesPage";
import AdminUserOrdersPage from "./admin/adminUserOrdersPage";
import AdminReportsPage from "./admin/adminReportsPage";
import AdminSettingsPage from "./admin/adminSettingsPage";
import AdminReviewsPage from "./admin/adminReviewsPage";
import AdminInventoryPage from "./admin/adminInventoryPage";
import AdminPromotionsPage from "./admin/adminPromotionsPage";
import AdminActivityLogsPage from "./admin/adminActivityLogsPage";
import AdminWishlistsPage from "./admin/adminWishlistsPage";
import NotificationBell from "../components/notificationBell";
import QuickReply from "../components/quickReply";

export default function AdminPage() {

	const navigate = useNavigate();

	const [userLoaded, setUserLoaded] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const handleLogout = () => {
		localStorage.removeItem("token");
		toast.success("Logged out successfully");
		navigate("/login");
	};

	useEffect(
		()=>{
			const token = localStorage.getItem("token");
			if(token == null){
				toast.error("Please login to access admin panel");
				navigate("/login");
				return;
			}
			axios.get(import.meta.env.VITE_API_URL + "/api/users/me",{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}).then((res)=>{
				if(res.data.role !== "admin"){
					toast.error("You are not authorized to access admin panel");
					navigate("/");
					return;
				}
				setUserLoaded(true);
			}).catch(()=>{
				toast.error("Session expired. Please login again");
				localStorage.removeItem("token");
				navigate("/login");
			});
		},[navigate]
	)

	return (
		<div className="w-full h-full relative flex text-secondary overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
			{/* Sidebar */}
			<div className={`${sidebarOpen ? 'w-[280px]' : 'w-0'} h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${sidebarOpen ? 'px-5 py-6' : 'p-0'} relative z-20 shadow-xl`}>
				{sidebarOpen && (
					<>
						{/* Header with Logo and Text */}
						<div className="mb-6 animate-fadeIn">
							<div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 shadow-lg border border-purple-200 transform hover:scale-[1.02] transition-all duration-300">
								<div className="flex items-center gap-3">
									
										<img
											src="/gbg.png"
											alt="GBG Logo"
											className="h-[45px] object-contain"
										/>
									
									<div>
										<h1 className="text-white text-lg font-bold">Admin Panel</h1>
										<div className="text-white/90 text-xs font-medium">Manage your store</div>
									</div>
								</div>
							</div>
						</div>

						{/* Navigation Links */}
						<nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1 animate-slideIn">
							<Link
								to="/admin"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all duration-300 border border-transparent hover:border-purple-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaChartLine className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Dashboard</span>
							</Link>
							<Link
								to="/admin/orders"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all duration-300 border border-transparent hover:border-pink-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaShoppingBag className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Orders</span>
							</Link>
							<Link
								to="/admin/products"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-all duration-300 border border-transparent hover:border-orange-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<BsBox2Heart className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Products</span>
							</Link>
							<Link
								to="/admin/inventory"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-yellow-50 text-gray-700 hover:text-yellow-600 transition-all duration-300 border border-transparent hover:border-yellow-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<MdInventory className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Inventory</span>
							</Link>
							<Link
								to="/admin/reviews"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-green-50 text-gray-700 hover:text-green-600 transition-all duration-300 border border-transparent hover:border-green-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaStar className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Reviews</span>
							</Link>
							<Link
								to="/admin/promotions"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-cyan-50 text-gray-700 hover:text-cyan-600 transition-all duration-300 border border-transparent hover:border-cyan-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaGift className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Promotions</span>
							</Link>
							<Link
								to="/admin/wishlists"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-300 border border-transparent hover:border-blue-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaHeart className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Wishlists</span>
							</Link>
							<Link
								to="/admin/users"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 transition-all duration-300 border border-transparent hover:border-indigo-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<HiOutlineUsers className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Users</span>
							</Link>
							<Link
								to="/admin/messages"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-all duration-300 border border-transparent hover:border-purple-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaEnvelope className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Messages</span>
							</Link>
							<Link
								to="/admin/activity-logs"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all duration-300 border border-transparent hover:border-pink-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaHistory className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Activity Logs</span>
							</Link>
							<Link
								to="/admin/reports"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300 border border-transparent hover:border-red-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaChartBar className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Reports</span>
							</Link>
							<Link
								to="/admin/settings"
								className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-300 border border-transparent hover:border-gray-200 hover:shadow-sm transform hover:translate-x-1"
							>
								<FaCog className="text-base group-hover:scale-110 transition-transform" />
								<span className="font-semibold text-sm">Settings</span>
							</Link>
						</nav>

						{/* Logout Button */}
						<div className="mt-auto pt-4 border-t border-gray-200 animate-fadeIn">
							<button
								onClick={handleLogout}
								className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transition-all duration-300 shadow-md hover:shadow-lg font-semibold transform hover:scale-[1.02]"
							>
								<MdLogout className="text-base" />
								<span className="text-sm">Logout</span>
							</button>
						</div>
					</>
				)}
			</div>

			{/* Sidebar Toggle Button */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className={`fixed ${sidebarOpen ? 'left-[280px]' : 'left-0'} top-4 z-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2.5 rounded-r-xl shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-500 transform hover:scale-110`}
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{sidebarOpen ? (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
					) : (
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
					)}
				</svg>
			</button>

			{/* Notification Bell - Fixed Top Right */}
			<div className="fixed top-4 right-4 z-50">
				<NotificationBell />
			</div>

			{/* Quick Reply Component */}
			<QuickReply />

			{/* Main Content Area */}
			<div className={`${sidebarOpen ? 'flex-1' : 'w-full'} h-screen overflow-hidden transition-all duration-500 ease-in-out relative z-10`}>
				<div className="h-full w-full bg-white overflow-y-auto">
					{userLoaded?<Routes path="/">
						<Route path="/" element={<AdminDashboard />} />
						<Route path="/products" element={<AdminProductPage />} />
						<Route path="/orders" element={<AdminOrdersPage/>} />
						<Route path="/add-product" element={<AddProductPage />} />
						<Route path="/update-product" element={<UpdateProductPage/>}/>
						<Route path="/inventory" element={<AdminInventoryPage/>} />
						<Route path="/reviews" element={<AdminReviewsPage/>} />
						<Route path="/promotions" element={<AdminPromotionsPage/>} />
						<Route path="/wishlists" element={<AdminWishlistsPage/>} />
						<Route path="/users" element={<AdminUsersPage/>} />
						<Route path="/messages" element={<AdminMessagesPage/>} />
						<Route path="/activity-logs" element={<AdminActivityLogsPage/>} />
						<Route path="/user-orders" element={<AdminUserOrdersPage/>} />
						<Route path="/reports" element={<AdminReportsPage/>} />
						<Route path="/settings" element={<AdminSettingsPage/>} />
					</Routes>:<Loader/>}
				</div>
			</div>
		</div>
	);
}