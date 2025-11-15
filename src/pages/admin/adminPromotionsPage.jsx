import { useState } from "react";
import { FaGift, FaPercent, FaPlus, FaEdit, FaTrash, FaCopy } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import toast from "react-hot-toast";

export default function AdminPromotionsPage() {
	const [promotions, setPromotions] = useState([
		{
			id: "PROMO001",
			code: "WELCOME20",
			type: "percentage",
			value: 20,
			description: "Welcome discount for new customers",
			minOrder: 5000,
			maxDiscount: 2000,
			usageLimit: 100,
			usedCount: 23,
			startDate: "2024-01-01",
			endDate: "2024-12-31",
			status: "active",
		},
		{
			id: "PROMO002",
			code: "FLAT500",
			type: "fixed",
			value: 500,
			description: "Flat 500 LKR off on orders above 3000",
			minOrder: 3000,
			maxDiscount: 500,
			usageLimit: 200,
			usedCount: 87,
			startDate: "2024-01-01",
			endDate: "2024-06-30",
			status: "active",
		},
	]);

	const [showModal, setShowModal] = useState(false);
	const [editingPromo, setEditingPromo] = useState(null);
	const [formData, setFormData] = useState({
		code: "",
		type: "percentage",
		value: "",
		description: "",
		minOrder: "",
		maxDiscount: "",
		usageLimit: "",
		startDate: "",
		endDate: "",
	});

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCreatePromotion = () => {
		if (
			!formData.code ||
			!formData.value ||
			!formData.description ||
			!formData.startDate ||
			!formData.endDate
		) {
			toast.error("Please fill in all required fields");
			return;
		}

		const newPromo = {
			id: `PROMO${String(promotions.length + 1).padStart(3, "0")}`,
			...formData,
			value: parseFloat(formData.value),
			minOrder: parseFloat(formData.minOrder) || 0,
			maxDiscount: parseFloat(formData.maxDiscount) || 0,
			usageLimit: parseInt(formData.usageLimit) || 0,
			usedCount: 0,
			status: "active",
		};

		setPromotions([...promotions, newPromo]);
		toast.success("Promotion created successfully!");
		setShowModal(false);
		resetForm();
	};

	const handleUpdatePromotion = () => {
		const updatedPromotions = promotions.map((promo) =>
			promo.id === editingPromo.id ? { ...promo, ...formData } : promo
		);
		setPromotions(updatedPromotions);
		toast.success("Promotion updated successfully!");
		setShowModal(false);
		setEditingPromo(null);
		resetForm();
	};

	const handleDeletePromotion = (id) => {
		if (window.confirm("Are you sure you want to delete this promotion?")) {
			setPromotions(promotions.filter((promo) => promo.id !== id));
			toast.success("Promotion deleted successfully!");
		}
	};

	const handleToggleStatus = (id) => {
		const updatedPromotions = promotions.map((promo) =>
			promo.id === id
				? { ...promo, status: promo.status === "active" ? "inactive" : "active" }
				: promo
		);
		setPromotions(updatedPromotions);
		toast.success("Promotion status updated!");
	};

	const handleCopyCode = (code) => {
		navigator.clipboard.writeText(code);
		toast.success("Promo code copied!");
	};

	const resetForm = () => {
		setFormData({
			code: "",
			type: "percentage",
			value: "",
			description: "",
			minOrder: "",
			maxDiscount: "",
			usageLimit: "",
			startDate: "",
			endDate: "",
		});
	};

	const openEditModal = (promo) => {
		setEditingPromo(promo);
		setFormData({
			code: promo.code,
			type: promo.type,
			value: promo.value.toString(),
			description: promo.description,
			minOrder: promo.minOrder.toString(),
			maxDiscount: promo.maxDiscount.toString(),
			usageLimit: promo.usageLimit.toString(),
			startDate: promo.startDate,
			endDate: promo.endDate,
		});
		setShowModal(true);
	};

	const stats = {
		total: promotions.length,
		active: promotions.filter((p) => p.status === "active").length,
		totalUsage: promotions.reduce((sum, p) => sum + p.usedCount, 0),
	};

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1600px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
								<MdLocalOffer className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
									Promotions & Discounts
								</h1>
								<p className="text-secondary/60 font-medium">
									Create and manage promotional codes
								</p>
							</div>
						</div>

						<button
							onClick={() => {
								setEditingPromo(null);
								resetForm();
								setShowModal(true);
							}}
							className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all shadow-lg"
						>
							<FaPlus />
							Create Promotion
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-purple-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
								<FaGift className="text-purple-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-purple-700">{stats.total}</span>
						</div>
						<h3 className="text-purple-600 font-bold text-sm">Total Promotions</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-green-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
								<MdLocalOffer className="text-green-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-green-700">{stats.active}</span>
						</div>
						<h3 className="text-green-600 font-bold text-sm">Active Promotions</h3>
					</div>

					<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-blue-300">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
								<FaPercent className="text-blue-600 text-xl" />
							</div>
							<span className="text-3xl font-bold text-blue-700">{stats.totalUsage}</span>
						</div>
						<h3 className="text-blue-600 font-bold text-sm">Total Redemptions</h3>
					</div>
				</div>

				{/* Promotions List */}
				<div className="space-y-4">
					{promotions.map((promo) => (
						<div
							key={promo.id}
							className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all p-6 border-2 border-accent/20 hover:border-accent/40"
						>
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-4 mb-4">
										<div
											className={`px-4 py-2 rounded-xl font-bold text-xl ${
												promo.type === "percentage"
													? "bg-gradient-to-r from-purple-500 to-purple-600"
													: "bg-gradient-to-r from-green-500 to-green-600"
											} text-white shadow-lg flex items-center gap-2`}
										>
											{promo.type === "percentage" ? (
												<>
													<FaPercent />
													{promo.value}% OFF
												</>
											) : (
												<>
													<FaGift />
													{promo.value} LKR OFF
												</>
											)}
										</div>

										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="text-2xl font-bold text-secondary">
													{promo.code}
												</h3>
												<button
													onClick={() => handleCopyCode(promo.code)}
													className="p-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-all"
													title="Copy Code"
												>
													<FaCopy />
												</button>
											</div>
											<p className="text-secondary/70">{promo.description}</p>
										</div>

										<button
											onClick={() => handleToggleStatus(promo.id)}
											className={`px-6 py-3 rounded-xl font-bold transition-all ${
												promo.status === "active"
													? "bg-green-100 text-green-700 border-2 border-green-300"
													: "bg-red-100 text-red-700 border-2 border-red-300"
											}`}
										>
											{promo.status === "active" ? "ACTIVE" : "INACTIVE"}
										</button>
									</div>

									<div className="grid grid-cols-5 gap-4 mb-4">
										<div className="bg-secondary/5 rounded-xl p-3">
											<p className="text-xs text-secondary/60 font-semibold mb-1">
												Min Order
											</p>
											<p className="text-lg font-bold text-secondary">
												LKR {promo.minOrder.toLocaleString()}
											</p>
										</div>

										<div className="bg-secondary/5 rounded-xl p-3">
											<p className="text-xs text-secondary/60 font-semibold mb-1">
												Max Discount
											</p>
											<p className="text-lg font-bold text-secondary">
												LKR {promo.maxDiscount.toLocaleString()}
											</p>
										</div>

										<div className="bg-secondary/5 rounded-xl p-3">
											<p className="text-xs text-secondary/60 font-semibold mb-1">
												Usage
											</p>
											<p className="text-lg font-bold text-secondary">
												{promo.usedCount} / {promo.usageLimit}
											</p>
										</div>

										<div className="bg-secondary/5 rounded-xl p-3">
											<p className="text-xs text-secondary/60 font-semibold mb-1">
												Start Date
											</p>
											<p className="text-sm font-bold text-secondary">
												{new Date(promo.startDate).toLocaleDateString()}
											</p>
										</div>

										<div className="bg-secondary/5 rounded-xl p-3">
											<p className="text-xs text-secondary/60 font-semibold mb-1">
												End Date
											</p>
											<p className="text-sm font-bold text-secondary">
												{new Date(promo.endDate).toLocaleDateString()}
											</p>
										</div>
									</div>

									{/* Progress Bar */}
									<div className="mb-2">
										<div className="flex items-center justify-between mb-2">
											<span className="text-sm font-semibold text-secondary/60">
												Usage Progress
											</span>
											<span className="text-sm font-bold text-secondary">
												{Math.round((promo.usedCount / promo.usageLimit) * 100)}%
											</span>
										</div>
										<div className="w-full h-3 bg-secondary/10 rounded-full overflow-hidden">
											<div
												className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all"
												style={{
													width: `${Math.min(
														(promo.usedCount / promo.usageLimit) * 100,
														100
													)}%`,
												}}
											></div>
										</div>
									</div>
								</div>

								{/* Action Buttons */}
								<div className="flex flex-col gap-2 ml-4">
									<button
										onClick={() => openEditModal(promo)}
										className="p-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all"
										title="Edit"
									>
										<FaEdit />
									</button>
									<button
										onClick={() => handleDeletePromotion(promo.id)}
										className="p-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all"
										title="Delete"
									>
										<FaTrash />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Create/Edit Modal */}
				{showModal && (
					<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
						<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full border-2 border-accent/20 max-h-[90vh] overflow-y-auto">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-3xl font-bold text-secondary">
									{editingPromo ? "Edit Promotion" : "Create New Promotion"}
								</h2>
								<button
									onClick={() => {
										setShowModal(false);
										setEditingPromo(null);
										resetForm();
									}}
									className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-700 rounded-full flex items-center justify-center transition-all"
								>
									✕
								</button>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-bold text-secondary mb-2">
										Promo Code *
									</label>
									<input
										type="text"
										name="code"
										value={formData.code}
										onChange={handleInputChange}
										placeholder="e.g., SUMMER20"
										className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											Discount Type *
										</label>
										<select
											name="type"
											value={formData.type}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										>
											<option value="percentage">Percentage</option>
											<option value="fixed">Fixed Amount</option>
										</select>
									</div>

									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											{formData.type === "percentage"
												? "Discount % *"
												: "Discount Amount (LKR) *"}
										</label>
										<input
											type="number"
											name="value"
											value={formData.value}
											onChange={handleInputChange}
											placeholder={
												formData.type === "percentage" ? "e.g., 20" : "e.g., 500"
											}
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-bold text-secondary mb-2">
										Description *
									</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleInputChange}
										placeholder="Describe this promotion..."
										rows="3"
										className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											Minimum Order (LKR)
										</label>
										<input
											type="number"
											name="minOrder"
											value={formData.minOrder}
											onChange={handleInputChange}
											placeholder="e.g., 5000"
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>

									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											Max Discount (LKR)
										</label>
										<input
											type="number"
											name="maxDiscount"
											value={formData.maxDiscount}
											onChange={handleInputChange}
											placeholder="e.g., 2000"
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-bold text-secondary mb-2">
										Usage Limit
									</label>
									<input
										type="number"
										name="usageLimit"
										value={formData.usageLimit}
										onChange={handleInputChange}
										placeholder="e.g., 100"
										className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											Start Date *
										</label>
										<input
											type="date"
											name="startDate"
											value={formData.startDate}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>

									<div>
										<label className="block text-sm font-bold text-secondary mb-2">
											End Date *
										</label>
										<input
											type="date"
											name="endDate"
											value={formData.endDate}
											onChange={handleInputChange}
											className="w-full px-4 py-3 border-2 border-secondary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
										/>
									</div>
								</div>
							</div>

							<div className="flex gap-4 mt-8">
								<button
									onClick={editingPromo ? handleUpdatePromotion : handleCreatePromotion}
									className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-bold transition-all"
								>
									{editingPromo ? "Update Promotion" : "Create Promotion"}
								</button>
								<button
									onClick={() => {
										setShowModal(false);
										setEditingPromo(null);
										resetForm();
									}}
									className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-bold transition-all"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
