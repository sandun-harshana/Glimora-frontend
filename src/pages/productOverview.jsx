import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";
import { FaShoppingCart, FaBolt, FaTag, FaBoxOpen, FaHeart, FaRegHeart } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

export default function ProductOverview() {
	const params = useParams();
	//laoding, success, error
	const [status, setStatus] = useState("loading");
	const [product, setProduct] = useState(null);
	const [isInWishlist, setIsInWishlist] = useState(false);

	useEffect(() => {
		axios
			.get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
			.then((res) => {
				setProduct(res.data);
				setStatus("success");
				checkWishlistStatus(res.data._id);
			})
			.catch(() => {
				toast.error("Failed to fetch product details");
				setStatus("error");
			});
	}, []);

	const checkWishlistStatus = async (productId) => {
		const token = localStorage.getItem("token");
		
		if (!token) {
			// Check localStorage for non-logged users
			const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
			setIsInWishlist(wishlist.some(item => item._id === productId));
			return;
		}

		// Check backend for logged-in users
		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/wishlist", {
				headers: { Authorization: `Bearer ${token}` }
			});
			
			if (res.data && res.data.wishlist) {
				setIsInWishlist(res.data.wishlist.some(item => item.productId?._id === productId));
			}
		} catch (error) {
			console.error("Error checking wishlist:", error);
			// If authentication fails, fall back to localStorage
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
				setIsInWishlist(wishlist.some(item => item._id === productId));
			}
		}
	};

	const toggleWishlist = async () => {
		if (!product) return;
		
		const token = localStorage.getItem("token");
		
		if (!token) {
			// Use localStorage for non-logged users
			const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
			
			if (isInWishlist) {
				const updatedWishlist = wishlist.filter(item => item._id !== product._id);
				localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
				setIsInWishlist(false);
				toast.success("Removed from wishlist");
			} else {
				wishlist.push(product);
				localStorage.setItem("wishlist", JSON.stringify(wishlist));
				setIsInWishlist(true);
				toast.success("Added to wishlist");
			}
			return;
		}

		// Use backend API for logged-in users
		try {
			if (isInWishlist) {
				await axios.delete(
					import.meta.env.VITE_API_URL + `/api/wishlist/${product._id}`,
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setIsInWishlist(false);
				toast.success("Removed from wishlist");
			} else {
				await axios.post(
					import.meta.env.VITE_API_URL + "/api/wishlist",
					{ productId: product._id },
					{ headers: { Authorization: `Bearer ${token}` } }
				);
				setIsInWishlist(true);
				toast.success("Added to wishlist");
			}
		} catch (error) {
			console.error("Error toggling wishlist:", error);
			
			// Handle specific error cases
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				toast.error("Please login to use wishlist");
			} else if (error.response?.status === 400) {
				toast.error(error.response?.data?.message || "Item already in wishlist");
				checkWishlistStatus(product._id); // Refresh status
			} else {
				toast.error("Failed to update wishlist. Please try again.");
			}
		}
	};

	return (
		<div className="w-full min-h-[calc(100vh-100px)] text-secondary bg-gradient-to-b from-primary via-white to-primary/50">
			{status == "loading" && <Loader />}
			{status == "success" && (
				<div className="w-full flex flex-col lg:flex-row p-4 lg:p-10 gap-6 lg:gap-10 max-w-7xl mx-auto">
					{/* Mobile Title */}
					<h1 className="text-3xl font-bold text-center lg:hidden text-secondary mb-4">
						{product.name}
					</h1>

					{/* Left Side - Image Gallery */}
					<div className="w-full lg:w-[50%] flex justify-center items-start">
						<div className="w-full bg-white rounded-3xl shadow-xl p-6 sticky top-4">
							<ImageSlider images={product.images}/>
						</div>
					</div>

					{/* Right Side - Product Details */}
					<div className="w-full lg:w-[50%] flex flex-col gap-6">
						{/* Product ID Badge */}
						<div className="flex items-center gap-2">
							<div className="bg-accent/10 px-4 py-2 rounded-full">
								<span className="text-accent font-semibold flex items-center gap-2">
									<FaBoxOpen />
									{product.productID}
								</span>
							</div>
						</div>

						{/* Product Name & Alt Names */}
						<div className="bg-white rounded-3xl shadow-lg p-6">
							<h1 className="text-3xl lg:text-4xl font-bold text-secondary mb-3">
								{product.name}
							</h1>
							{product.altNames && product.altNames.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{product.altNames.map((name, index) => (
										<span
											key={index}
											className="text-sm text-secondary/70 bg-primary/50 px-3 py-1 rounded-full"
										>
											{name}
										</span>
									))}
								</div>
							)}
						</div>

						{/* Description */}
						<div className="bg-white rounded-3xl shadow-lg p-6">
							<h3 className="text-xl font-semibold text-secondary mb-3 flex items-center gap-2">
								<FaTag className="text-accent" />
								Description
							</h3>
							<p className="text-secondary/80 text-justify leading-relaxed">
								{product.description}
							</p>
						</div>

						{/* Category */}
						<div className="bg-gradient-to-br from-accent/10 to-primary rounded-3xl shadow-lg p-6">
							<div className="flex items-center gap-3">
								<div className="bg-accent/20 p-3 rounded-2xl">
									<BiCategory className="text-2xl text-accent" />
								</div>
								<div>
									<p className="text-sm text-secondary/70">Category</p>
									<p className="text-lg font-semibold text-secondary">
										{product.category}
									</p>
								</div>
							</div>
						</div>

						{/* Price */}
						<div className="bg-white rounded-3xl shadow-lg p-6">
							<div className="flex items-center justify-between">
								<span className="text-secondary/70">Price</span>
								<div className="flex items-center gap-3">
									{product.labelledPrice > product.price && (
										<>
											<p className="text-xl text-secondary/60 font-semibold line-through">
												LKR {product.labelledPrice.toFixed(2)}
											</p>
											<div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
												-{Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}%
											</div>
										</>
									)}
								</div>
							</div>
							<p className="text-3xl text-accent font-bold mt-2">
								LKR {product.price.toFixed(2)}
							</p>
						</div>

						{/* Action Buttons */}
						<div className="sticky bottom-4 bg-white rounded-3xl shadow-xl p-6">
							<div className="flex gap-4">
								<button
									onClick={toggleWishlist}
									className="h-14 px-6 border-2 border-accent text-accent font-semibold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
								>
									{isInWishlist ? (
										<>
											<FaHeart className="text-xl" />
											<span className="hidden sm:inline">In Wishlist</span>
										</>
									) : (
										<>
											<FaRegHeart className="text-xl" />
											<span className="hidden sm:inline">Add to Wishlist</span>
										</>
									)}
								</button>
								<button
									className="flex-1 h-14 bg-gradient-to-r from-accent to-accent/80 text-white font-semibold rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
									onClick={() => {
										addToCart(product, 1);
										toast.success("Added to cart");
									}}
								>
									<FaShoppingCart />
									Add to Cart
								</button>
								<Link
									to="/checkout"
									state={[
										{
											image: product.images[0],
											productID: product.productID,
											name: product.name,
											price: product.price,
											labelledPrice: product.labelledPrice,
											quantity: 1,
										},
									]}
									className="flex-1 h-14 border-2 border-accent text-accent font-semibold rounded-2xl hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
								>
									<FaBolt />
									Buy Now
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}
			{status == "error" && (
				<div className="w-full h-[calc(100vh-100px)] flex flex-col items-center justify-center">
					<div className="bg-white rounded-3xl shadow-xl p-8 text-center">
						<div className="text-6xl text-red-500 mb-4">⚠️</div>
						<h1 className="text-2xl font-bold text-red-500 mb-2">
							Failed to Load Product
						</h1>
						<p className="text-secondary/70 mb-6">
							Unable to fetch product details. Please try again later.
						</p>
						<Link
							to="/products"
							className="bg-accent text-white px-6 py-3 rounded-2xl hover:bg-accent/80 transition-all inline-block"
						>
							Back to Products
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
