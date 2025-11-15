import { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Loader } from "../components/loader";

export default function WishlistPage() {
	const [wishlist, setWishlist] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		loadWishlist();
	}, []);

	const loadWishlist = async () => {
		const token = localStorage.getItem("token");
		
		if (!token) {
			// If not logged in, load from localStorage
			const savedWishlist = localStorage.getItem("wishlist");
			if (savedWishlist) {
				setWishlist(JSON.parse(savedWishlist));
			}
			setIsLoading(false);
			return;
		}

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/wishlist", {
				headers: { Authorization: `Bearer ${token}` }
			});
			
			// Format the wishlist data to match the expected structure
			const formattedWishlist = res.data.wishlist.map(item => ({
				...item.productId,
				_id: item.productId._id,
				addedAt: item.addedAt
			}));
			
			setWishlist(formattedWishlist);
		} catch (error) {
			console.error("Error loading wishlist:", error);
			toast.error("Failed to load wishlist");
		} finally {
			setIsLoading(false);
		}
	};

	const removeFromWishlist = async (productId) => {
		const token = localStorage.getItem("token");
		
		if (!token) {
			// If not logged in, use localStorage
			const updatedWishlist = wishlist.filter((item) => item._id !== productId);
			setWishlist(updatedWishlist);
			localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
			toast.success("Removed from wishlist");
			return;
		}

		try {
			await axios.delete(
				import.meta.env.VITE_API_URL + `/api/wishlist/${productId}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			
			const updatedWishlist = wishlist.filter((item) => item._id !== productId);
			setWishlist(updatedWishlist);
			toast.success("Removed from wishlist");
		} catch (error) {
			console.error("Error removing from wishlist:", error);
			toast.error("Failed to remove from wishlist");
		}
	};

	const addToCart = (product) => {
		const cart = JSON.parse(localStorage.getItem("cart") || "[]");
		const existingItem = cart.find((item) => item._id === product._id);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.push({ ...product, quantity: 1 });
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		toast.success("Added to cart!");
	};

	const clearWishlist = async () => {
		const token = localStorage.getItem("token");
		
		if (!token) {
			// If not logged in, use localStorage
			setWishlist([]);
			localStorage.removeItem("wishlist");
			toast.success("Wishlist cleared");
			return;
		}

		try {
			await axios.delete(
				import.meta.env.VITE_API_URL + "/api/wishlist",
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			
			setWishlist([]);
			toast.success("Wishlist cleared");
		} catch (error) {
			console.error("Error clearing wishlist:", error);
			toast.error("Failed to clear wishlist");
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 py-12 px-4">
			<div className="max-w-[1400px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
								<FaHeart className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-pink-600 bg-clip-text text-transparent">
									My Wishlist
								</h1>
								<p className="text-secondary/60 font-medium">
									{wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
								</p>
							</div>
						</div>
						{wishlist.length > 0 && (
							<button
								onClick={clearWishlist}
								className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
							>
								<FaTrash />
								Clear All
							</button>
						)}
					</div>
				</div>

				{/* Wishlist Items */}
				{wishlist.length === 0 ? (
					<div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-accent/20">
						<div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-pink-50 rounded-full flex items-center justify-center">
							<FaHeart className="text-6xl text-pink-300" />
						</div>
						<h2 className="text-3xl font-bold text-secondary mb-4">Your Wishlist is Empty</h2>
						<p className="text-secondary/60 mb-8 text-lg">
							Start adding products you love to your wishlist!
						</p>
						<Link
							to="/products"
							className="inline-block px-8 py-4 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
						>
							Browse Products
						</Link>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{wishlist.map((product) => (
							<div
								key={product._id}
								className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-accent/20 hover:border-accent/40 hover:-translate-y-2"
							>
								{/* Product Image */}
								<div className="relative overflow-hidden h-64 bg-gradient-to-br from-primary/20 to-accent/10">
									<img
										src={product.images?.[0] || "/placeholder.png"}
										alt={product.name}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									<button
										onClick={() => removeFromWishlist(product._id)}
										className="absolute top-4 right-4 w-12 h-12 bg-white/90 hover:bg-red-500 text-red-500 hover:text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110"
									>
										<FaTrash />
									</button>
								</div>

								{/* Product Info */}
								<div className="p-6">
									<Link to={`/overview/${product._id}`}>
										<h3 className="text-xl font-bold text-secondary mb-2 hover:text-accent transition-colors line-clamp-2">
											{product.name}
										</h3>
									</Link>
									<p className="text-secondary/60 text-sm mb-4 line-clamp-2">
										{product.description}
									</p>

									{/* Price and Stock */}
									<div className="flex items-center justify-between mb-4">
										<div>
											<p className="text-2xl font-bold text-accent">
												LKR {product.price?.toLocaleString()}
											</p>
											{product.stock > 0 ? (
												<p className="text-xs text-green-600 font-semibold">
													✓ In Stock ({product.stock} available)
												</p>
											) : (
												<p className="text-xs text-red-600 font-semibold">
													✗ Out of Stock
												</p>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className="flex gap-3">
										<button
											onClick={() => addToCart(product)}
											disabled={product.stock === 0}
											className="flex-1 px-4 py-3 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											<FaShoppingCart />
											Add to Cart
										</button>
										<Link
											to={`/overview/${product._id}`}
											className="px-4 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-bold transition-all"
										>
											View
										</Link>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
