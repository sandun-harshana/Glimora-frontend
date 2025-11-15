import { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaExclamationTriangle, FaEdit, FaSync } from "react-icons/fa";
import { MdInventory } from "react-icons/md";
import toast from "react-hot-toast";
import { Loader } from "../../components/loader";

export default function AdminInventoryPage() {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [editingProduct, setEditingProduct] = useState(null);
	const [newStock, setNewStock] = useState("");
	const [filterLevel, setFilterLevel] = useState("all");

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/products");
			setProducts(res.data);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching products:", err);
			toast.error("Failed to load inventory");
			setIsLoading(false);
		}
	};

	const getStockLevel = (stock) => {
		if (stock === 0) return "out";
		if (stock <= 10) return "low";
		if (stock <= 30) return "medium";
		return "high";
	};

	const getStockColor = (level) => {
		switch (level) {
			case "out":
				return "bg-red-100 text-red-700 border-red-300";
			case "low":
				return "bg-orange-100 text-orange-700 border-orange-300";
			case "medium":
				return "bg-yellow-100 text-yellow-700 border-yellow-300";
			default:
				return "bg-green-100 text-green-700 border-green-300";
		}
	};

	const handleUpdateStock = async (productId) => {
		if (!newStock || isNaN(newStock) || parseInt(newStock) < 0) {
			toast.error("Please enter a valid stock quantity");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.put(
				`${import.meta.env.VITE_API_URL}/api/products/${productId}`,
				{ stock: parseInt(newStock) },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			const updatedProducts = products.map((p) =>
				p._id === productId ? { ...p, stock: parseInt(newStock) } : p
			);
			setProducts(updatedProducts);
			setEditingProduct(null);
			setNewStock("");
			toast.success("Stock updated successfully!");
		} catch (err) {
			console.error("Error updating stock:", err);
			toast.error("Failed to update stock");
		}
	};

	const filteredProducts = products.filter((product) => {
		if (filterLevel === "all") return true;
		return getStockLevel(product.stock) === filterLevel;
	});

	const stats = {
		total: products.length,
		outOfStock: products.filter((p) => p.stock === 0).length,
		lowStock: products.filter((p) => p.stock > 0 && p.stock <= 10).length,
		healthy: products.filter((p) => p.stock > 30).length,
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1600px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
								<MdInventory className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-blue-600 bg-clip-text text-transparent">
									Inventory Management
								</h1>
								<p className="text-secondary/60 font-medium">
									Track and manage product stock levels
								</p>
							</div>
						</div>

						<button
							onClick={fetchProducts}
							className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg"
						>
							<FaSync />
							Refresh
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-blue-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<FaBox className="text-blue-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-blue-700">{stats.total}</span>
						</div>
						<h3 className="text-blue-600 font-bold text-sm">Total Products</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-red-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
								<FaExclamationTriangle className="text-red-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-red-700">{stats.outOfStock}</span>
						</div>
						<h3 className="text-red-600 font-bold text-sm">Out of Stock</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-orange-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
								<FaExclamationTriangle className="text-orange-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-orange-700">{stats.lowStock}</span>
						</div>
						<h3 className="text-orange-600 font-bold text-sm">Low Stock (≤10)</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<FaBox className="text-green-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-green-700">{stats.healthy}</span>
						</div>
						<h3 className="text-green-600 font-bold text-sm">Healthy Stock (&gt;30)</h3>
					</div>
				</div>

				{/* Filter Tabs */}
				<div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-accent/20">
					<div className="flex gap-4">
						{[
							{ key: "all", label: "All Products" },
							{ key: "out", label: "Out of Stock" },
							{ key: "low", label: "Low Stock" },
							{ key: "medium", label: "Medium Stock" },
							{ key: "high", label: "High Stock" },
						].map((filter) => (
							<button
								key={filter.key}
								onClick={() => setFilterLevel(filter.key)}
								className={`px-6 py-3 rounded-xl font-semibold transition-all ${
									filterLevel === filter.key
										? "bg-accent text-white shadow-lg"
										: "bg-secondary/10 text-secondary hover:bg-secondary/20"
								}`}
							>
								{filter.label}
								<span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
									{filter.key === "all"
										? products.length
										: products.filter((p) => getStockLevel(p.stock) === filter.key)
												.length}
								</span>
							</button>
						))}
					</div>
				</div>

				{/* Products Table */}
				<div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-accent/20">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gradient-to-r from-secondary to-secondary/80 text-white">
								<tr>
									<th className="px-6 py-4 text-left font-bold">Product</th>
									<th className="px-6 py-4 text-left font-bold">Category</th>
									<th className="px-6 py-4 text-center font-bold">Current Stock</th>
									<th className="px-6 py-4 text-center font-bold">Status</th>
									<th className="px-6 py-4 text-center font-bold">Price</th>
									<th className="px-6 py-4 text-center font-bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredProducts.length === 0 ? (
									<tr>
										<td colSpan="6" className="px-6 py-16 text-center">
											<FaBox className="text-6xl text-secondary/30 mx-auto mb-4" />
											<h3 className="text-2xl font-bold text-secondary mb-2">
												No Products Found
											</h3>
											<p className="text-secondary/60">
												{filterLevel === "all"
													? "No products in inventory"
													: `No products with ${filterLevel} stock level`}
											</p>
										</td>
									</tr>
								) : (
									filteredProducts.map((product, index) => {
										const stockLevel = getStockLevel(product.stock);
										const isEditing = editingProduct === product._id;

										return (
											<tr
												key={product._id}
												className={`border-b border-secondary/10 hover:bg-secondary/5 transition-all ${
													index % 2 === 0 ? "bg-white" : "bg-secondary/3"
												}`}
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-4">
														<img
															src={product.images?.[0] || "/placeholder.jpg"}
															alt={product.name}
															className="w-16 h-16 object-cover rounded-xl border-2 border-accent/20"
														/>
														<div>
															<p className="font-bold text-secondary">
																{product.name}
															</p>
															<p className="text-sm text-secondary/60">
																SKU: {product._id.slice(-8)}
															</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-semibold rounded-full">
														{product.category}
													</span>
												</td>
												<td className="px-6 py-4 text-center">
													{isEditing ? (
														<input
															type="number"
															value={newStock}
															onChange={(e) => setNewStock(e.target.value)}
															className="w-20 px-3 py-2 border-2 border-accent rounded-xl text-center font-bold focus:outline-none focus:ring-2 focus:ring-accent"
															min="0"
															autoFocus
														/>
													) : (
														<span className="text-2xl font-bold text-secondary">
															{product.stock}
														</span>
													)}
												</td>
												<td className="px-6 py-4 text-center">
													<span
														className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm border-2 ${getStockColor(
															stockLevel
														)}`}
													>
														{stockLevel === "out" && "Out of Stock"}
														{stockLevel === "low" && "Low Stock"}
														{stockLevel === "medium" && "Medium Stock"}
														{stockLevel === "high" && "In Stock"}
													</span>
												</td>
												<td className="px-6 py-4 text-center font-bold text-secondary">
													LKR {product.price?.toLocaleString()}
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center justify-center gap-2">
														{isEditing ? (
															<>
																<button
																	onClick={() =>
																		handleUpdateStock(product._id)
																	}
																	className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all"
																>
																	Save
																</button>
																<button
																	onClick={() => {
																		setEditingProduct(null);
																		setNewStock("");
																	}}
																	className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
																>
																	Cancel
																</button>
															</>
														) : (
															<button
																onClick={() => {
																	setEditingProduct(product._id);
																	setNewStock(product.stock.toString());
																}}
																className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all"
															>
																<FaEdit />
																Update Stock
															</button>
														)}
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
