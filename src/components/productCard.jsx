import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProductCard(props) {
	const product = props.product;
	const [isInWishlist, setIsInWishlist] = useState(false);

	useEffect(() => {
		const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
		setIsInWishlist(wishlist.some(item => item._id === product._id));
	}, [product._id]);

	const toggleWishlist = (e) => {
		e.preventDefault();
		e.stopPropagation();
		
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
	};

	return (
		<div className="group w-full h-auto bg-white rounded-3xl shadow-lg hover:shadow-2xl border border-accent/10 hover:border-accent/30 overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col">
			{/* Product Image Container */}
			<div className="relative w-full h-[280px] overflow-hidden bg-gradient-to-br from-primary/50 to-accent/5">
				<img 
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
					src={product.images[0]}
					alt={product.name}
				/>
				{/* Wishlist Button */}
				<button
					onClick={toggleWishlist}
					className="absolute top-4 left-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-10"
				>
					{isInWishlist ? (
						<FaHeart className="text-pink-500 text-xl" />
					) : (
						<FaRegHeart className="text-secondary text-xl" />
					)}
				</button>
				{/* Discount Badge */}
				{product.labelledPrice > product.price && (
					<div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
						-{Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}%
					</div>
				)}
				{/* Hover Overlay */}
				<div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
			</div>

			{/* Product Info */}
			<div className="p-6 flex flex-col flex-1">
				{/* Category */}
				<div className="mb-2">
					<span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full uppercase tracking-wider">
						{product.category}
					</span>
				</div>

				{/* Product Name */}
				<h2 className="text-xl font-bold text-secondary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-300">
					{product.name}
				</h2>

				{/* Product ID */}
				<p className="text-xs text-secondary/50 font-mono mb-3">ID: {product.productID}</p>

				{/* Price Section */}
				<div className="mb-4">
					{product.labelledPrice > product.price ? (
						<div className="flex items-center gap-3">
							<p className="text-lg text-secondary/60 font-semibold line-through">
								LKR {product.labelledPrice.toFixed(2)}
							</p>
							<p className="text-2xl text-accent font-bold">
								LKR {product.price.toFixed(2)}
							</p>
						</div>
					) : (
						<p className="text-2xl text-accent font-bold">
							LKR {product.price.toFixed(2)}
						</p>
					)}
				</div>

				{/* View Product Button */}
				<Link 
					to={"/overview/" + product.productID} 
					className="w-full mt-auto py-3 px-6 bg-accent text-white rounded-xl font-semibold text-center shadow-lg shadow-accent/20 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/30 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group/button"
				>
					<span>View Details</span>
					<svg className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
					</svg>
				</Link>
			</div>
		</div>
	);
}
