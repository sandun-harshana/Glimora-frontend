import { useEffect, useState } from "react";
import { FaHeart, FaUser, FaBox, FaTrophy } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";

export default function AdminWishlistsPage() {
	const [wishlists, setWishlists] = useState([]);
	const [stats, setStats] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("all"); // 'all' or 'stats'

	useEffect(() => {
		fetchWishlists();
		fetchStats();
	}, []);

	const fetchWishlists = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.get(
				import.meta.env.VITE_API_URL + "/api/wishlist/admin/all",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setWishlists(res.data.wishlists);
		} catch (error) {
			console.error("Error fetching wishlists:", error);
			toast.error("Failed to load wishlists");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchStats = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.get(
				import.meta.env.VITE_API_URL + "/api/wishlist/admin/stats",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setStats(res.data);
		} catch (error) {
			console.error("Error fetching stats:", error);
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
			<div className="max-w-[1600px] mx-auto">
				{/* Header */}
				<div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
					<div className="relative z-10">
						<div className="flex items-center gap-4 mb-2">
							<div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
								<FaHeart className="text-3xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold">Wishlist Management</h1>
								<p className="text-white/90 text-lg">Monitor user wishlists and popular products</p>
							</div>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-4 mb-6">
					<button
						onClick={() => setActiveTab("all")}
						className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
							activeTab === "all"
								? "bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-xl"
								: "bg-white text-gray-700 hover:shadow-lg"
						}`}
					>
						<FaUser className="inline mr-2" />
						All Wishlists ({wishlists.length})
					</button>
					<button
						onClick={() => setActiveTab("stats")}
						className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
							activeTab === "stats"
								? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl"
								: "bg-white text-gray-700 hover:shadow-lg"
						}`}
					>
						<FaTrophy className="inline mr-2" />
						Statistics & Top Products
					</button>
				</div>

				{/* Content */}
				{activeTab === "all" ? (
					<div className="space-y-6">
						{wishlists.length === 0 ? (
							<div className="bg-white rounded-3xl shadow-xl p-16 text-center">
								<FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
								<h2 className="text-2xl font-bold text-gray-700 mb-2">No Wishlists Yet</h2>
								<p className="text-gray-500">Users haven't added any products to their wishlists</p>
							</div>
						) : (
							wishlists.map((userWishlist) => (
								<div
									key={userWishlist.userId}
									className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-pink-200"
								>
									{/* User Info Header */}
									<div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 border-b-2 border-pink-200">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
													{userWishlist.userName.charAt(0)}
												</div>
												<div>
													<h3 className="text-xl font-bold text-gray-800">
														{userWishlist.userName}
													</h3>
													<p className="text-gray-600">{userWishlist.email}</p>
												</div>
											</div>
											<div className="text-right">
												<div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md">
													<FaBox className="text-pink-500" />
													<span className="font-bold text-gray-800">
														{userWishlist.itemCount} {userWishlist.itemCount === 1 ? "item" : "items"}
													</span>
												</div>
											</div>
										</div>
									</div>

									{/* Wishlist Items */}
									<div className="p-6">
										<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
											{userWishlist.wishlist.map((item) => (
												<div
													key={item._id}
													className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 hover:border-pink-400 transition-all hover:shadow-lg"
												>
													<div className="aspect-square bg-white rounded-xl mb-3 overflow-hidden">
														<img
															src={item.productId?.images?.[0] || "/placeholder.png"}
															alt={item.productId?.name}
															className="w-full h-full object-cover"
														/>
													</div>
													<h4 className="font-bold text-gray-800 mb-1 line-clamp-2">
														{item.productId?.name}
													</h4>
													<p className="text-pink-600 font-bold text-lg">
														LKR {item.productId?.price?.toLocaleString()}
													</p>
													<p className="text-xs text-gray-500 mt-2">
														Added: {new Date(item.addedAt).toLocaleDateString()}
													</p>
												</div>
											))}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				) : (
					<div className="space-y-6">
						{/* Statistics Cards */}
						{stats && (
							<>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
									<div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
										<div className="flex items-center justify-between mb-2">
											<FaUser className="text-3xl opacity-80" />
											<div className="text-right">
												<p className="text-4xl font-bold">{stats.totalUsersWithWishlist}</p>
												<p className="text-purple-100">Users with Wishlists</p>
											</div>
										</div>
									</div>
									<div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
										<div className="flex items-center justify-between mb-2">
											<FaHeart className="text-3xl opacity-80" />
											<div className="text-right">
												<p className="text-4xl font-bold">{stats.totalWishlistItems}</p>
												<p className="text-pink-100">Total Wishlist Items</p>
											</div>
										</div>
									</div>
									<div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl">
										<div className="flex items-center justify-between mb-2">
											<FaBox className="text-3xl opacity-80" />
											<div className="text-right">
												<p className="text-4xl font-bold">{stats.averageItemsPerUser}</p>
												<p className="text-orange-100">Avg Items Per User</p>
											</div>
										</div>
									</div>
								</div>

								{/* Top Products */}
								<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-pink-200">
									<h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
										<FaTrophy className="text-yellow-500" />
										Most Wishlisted Products
									</h2>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{stats.topProducts.map((item, index) => (
											<div
												key={item.product?._id}
												className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-pink-400 transition-all hover:shadow-lg relative"
											>
												{/* Rank Badge */}
												<div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
													{index + 1}
												</div>
												<div className="aspect-square bg-white rounded-xl mb-4 overflow-hidden">
													<img
														src={item.product?.images?.[0] || "/placeholder.png"}
														alt={item.product?.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
													{item.product?.name}
												</h3>
												<p className="text-pink-600 font-bold text-lg mb-2">
													LKR {item.product?.price?.toLocaleString()}
												</p>
												<div className="flex items-center gap-2 text-purple-600">
													<FaHeart />
													<span className="font-semibold">
														{item.wishlistCount} users wishlisted
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
