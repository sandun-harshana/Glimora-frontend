import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";
import { FaShoppingBag, FaUser, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaMobileAlt, FaUniversity, FaCrown } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";

export default function CheckoutPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const [address, setAddress] = useState("");
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
	const [paymentDetails, setPaymentDetails] = useState({
		transactionId: "",
		bankName: "",
		accountNumber: "",
		paymentProof: null,
	});
	const [uploadingProof, setUploadingProof] = useState(false);
	const [membershipTier, setMembershipTier] = useState("Bronze");
	const [discountRate, setDiscountRate] = useState(0);

	const [cart, setCart] = useState(location.state);

	useEffect(() => {
		fetchMembershipInfo();
	}, []);

	const fetchMembershipInfo = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/membership", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMembershipTier(res.data.membershipTier);
			setDiscountRate(res.data.discountRate);
		} catch (err) {
			console.error("Error fetching membership info:", err);
		}
	};

	function getTotal() {
		let total = 0;
		cart.forEach((item) => {
			total += item.price * item.quantity;
		});
		return total;
	}

	function getDiscount() {
		return Math.floor(getTotal() * (discountRate / 100));
	}

	function getFinalTotal() {
		return getTotal() - getDiscount();
	}

	async function purchaseCart() {
		const token = localStorage.getItem("token");
		if (token == null) {
			toast.error("Please login to place an order");
			navigate("/login");
			return;
		}

		if (!address.trim()) {
			toast.error("Please enter your shipping address");
			return;
		}

		if (paymentMethod !== "cash-on-delivery" && !paymentDetails.transactionId.trim()) {
			toast.error("Please enter transaction ID for online payment");
			return;
		}

		try {
			const items = [];

			for (let i = 0; i < cart.length; i++) {
				items.push({
					productID: cart[i].productID,
					quantity: cart[i].quantity,
				});
			}

			// Upload payment proof if provided
			let paymentProofUrl = "";
			if (paymentDetails.paymentProof) {
				setUploadingProof(true);
				toast.loading("Uploading payment proof...");
				paymentProofUrl = await mediaUpload(paymentDetails.paymentProof);
				toast.dismiss();
				setUploadingProof(false);
			}

			const orderData = {
				address: address,
				customerName: name === "" ? null : name,
				phone: phone || null,
				items: items,
				paymentMethod: paymentMethod,
				paymentDetails: {
					transactionId: paymentDetails.transactionId,
					bankName: paymentDetails.bankName,
					accountNumber: paymentDetails.accountNumber,
					paymentProof: paymentProofUrl,
					paidAmount: paymentMethod !== "cash-on-delivery" ? getTotal() : 0,
					paymentDate: paymentMethod !== "cash-on-delivery" ? new Date() : null,
				},
			};

			await axios.post(
				import.meta.env.VITE_API_URL + "/api/orders",
				orderData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			toast.success("Order placed successfully!");
			
			// Dispatch event to update rewards points in real-time
			window.dispatchEvent(new Event('order-placed'));
			
			// Clear cart and redirect
			setTimeout(() => {
				navigate("/my-orders");
			}, 1500);
		} catch (error) {
			toast.error("Failed to place order");
			console.error(error);

			//if error is 400
			if (error.response && error.response.status == 400) {
				toast.error(error.response.data.message);
			}
		}
	}

	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-b from-primary via-white to-primary/50 flex flex-col pt-8 pb-12 items-center">
			{/* Page Header */}
			<div className="w-full max-w-6xl px-4 mb-8 animate-fade-in">
				<div className="flex items-center gap-4 mb-2">
					<div className="bg-gradient-to-br from-accent to-accent/70 p-3 rounded-2xl shadow-lg">
						<FaShoppingBag className="text-2xl text-white" />
					</div>
					<h1 className="text-4xl font-bold text-secondary">Checkout</h1>
				</div>
				<div className="h-1 w-32 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
				<p className="text-secondary/70 mt-2">Complete your order</p>
			</div>

			<div className="w-full max-w-6xl px-4 flex flex-col lg:flex-row gap-6">
				{/* Left Side - Order Items */}
				<div className="flex-1 flex flex-col gap-4">
					<h2 className="text-xl font-semibold text-secondary flex items-center gap-2">
						<MdPayment className="text-accent" />
						Order Items
					</h2>
					{cart.map((item, index) => {
						return (
							<div
								key={index}
								className="w-full bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col lg:flex-row relative items-center p-4 lg:p-0 overflow-hidden group"
							>
								<button
									className="absolute text-red-500 right-2 top-2 lg:right-[-40px] lg:top-1/2 lg:-translate-y-1/2 text-2xl rounded-full aspect-square hover:bg-red-500 hover:text-white p-2 font-bold transition-all z-10 lg:group-hover:right-2"
									onClick={() => {}}
								>
									<BiTrash />
								</button>
								<div className="lg:h-[140px] h-[120px] aspect-square overflow-hidden rounded-2xl lg:rounded-none lg:rounded-l-3xl">
									<img
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
										src={item.image}
										alt={item.name}
									/>
								</div>
								<div className="flex-1 flex flex-col lg:flex-row items-center justify-between w-full p-4 gap-4">
									<div className="text-center lg:text-left lg:flex-1">
										<h1 className="font-semibold text-lg text-secondary">
											{item.name}
										</h1>
										<span className="text-sm text-secondary/60">
											{item.productID}
										</span>
									</div>
									<div className="flex flex-row lg:flex-col justify-center items-center gap-2 bg-primary/30 px-4 py-2 rounded-2xl">
										<button
											onClick={() => {
												const newCart = [...cart];
												newCart[index].quantity += 1;
												setCart(newCart);
											}}
											className="text-accent hover:text-accent/70 transition-colors"
										>
											<CiCircleChevUp className="text-3xl" />
										</button>
										<span className="font-semibold text-3xl text-secondary px-2">
											{item.quantity}
										</span>
										<button
											onClick={() => {
												const newCart = [...cart];
												if (newCart[index].quantity > 1) {
													newCart[index].quantity -= 1;
												}
												setCart(newCart);
											}}
											className="text-accent hover:text-accent/70 transition-colors"
										>
											<CiCircleChevDown className="text-3xl" />
										</button>
									</div>
									<div className="flex flex-col items-center lg:items-end">
										{item.labelledPrice > item.price && (
											<span className="text-secondary/60 line-through text-sm">
												LKR {item.labelledPrice.toFixed(2)}
											</span>
										)}
										<span className="font-bold text-accent text-2xl">
											LKR {item.price.toFixed(2)}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Right Side - Shipping Details & Summary */}
				<div className="w-full lg:w-[400px] flex flex-col gap-4">
					{/* Shipping Details */}
					<div className="bg-white rounded-3xl shadow-lg p-6">
						<h2 className="text-xl font-semibold text-secondary flex items-center gap-2 mb-4">
							<FaMapMarkerAlt className="text-accent" />
							Shipping Details
						</h2>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="name"
									className="text-sm font-medium text-secondary flex items-center gap-2"
								>
									<FaUser className="text-accent" />
									Customer Name (Optional)
								</label>
								<input
									type="text"
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter your name"
									className="w-full h-[50px] border-2 border-primary focus:border-accent rounded-2xl px-4 text-secondary transition-colors focus:outline-none"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="phone"
									className="text-sm font-medium text-secondary flex items-center gap-2"
								>
									<FaMobileAlt className="text-accent" />
									Phone Number (Optional)
								</label>
								<input
									type="tel"
									id="phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="Enter your phone number"
									className="w-full h-[50px] border-2 border-primary focus:border-accent rounded-2xl px-4 text-secondary transition-colors focus:outline-none"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="address"
									className="text-sm font-medium text-secondary flex items-center gap-2"
								>
									<FaMapMarkerAlt className="text-accent" />
									Shipping Address *
								</label>
								<textarea
									id="address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="Enter your complete shipping address"
									className="w-full h-[120px] border-2 border-primary focus:border-accent rounded-2xl px-4 py-3 text-secondary transition-colors focus:outline-none resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Payment Method */}
					<div className="bg-white rounded-3xl shadow-lg p-6">
						<h2 className="text-xl font-semibold text-secondary flex items-center gap-2 mb-4">
							<MdPayment className="text-accent" />
							Payment Method
						</h2>
						<div className="flex flex-col gap-3">
							{/* Cash on Delivery */}
							<label
								className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
									paymentMethod === "cash-on-delivery"
										? "border-accent bg-accent/5"
										: "border-primary hover:border-accent/50"
								}`}
							>
								<input
									type="radio"
									name="payment"
									value="cash-on-delivery"
									checked={paymentMethod === "cash-on-delivery"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="w-5 h-5 text-accent"
								/>
								<FaMoneyBillWave className="text-2xl text-green-600" />
								<div className="flex-1">
									<p className="font-semibold text-secondary">Cash on Delivery</p>
									<p className="text-xs text-secondary/60">
										Pay when you receive your order
									</p>
								</div>
							</label>

							{/* Bank Transfer */}
							<label
								className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
									paymentMethod === "bank-transfer"
										? "border-accent bg-accent/5"
										: "border-primary hover:border-accent/50"
								}`}
							>
								<input
									type="radio"
									name="payment"
									value="bank-transfer"
									checked={paymentMethod === "bank-transfer"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="w-5 h-5 text-accent"
								/>
								<FaUniversity className="text-2xl text-blue-600" />
								<div className="flex-1">
									<p className="font-semibold text-secondary">Bank Transfer</p>
									<p className="text-xs text-secondary/60">
										Transfer to our bank account
									</p>
								</div>
							</label>

							{/* Card Payment */}
							<label
								className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
									paymentMethod === "card"
										? "border-accent bg-accent/5"
										: "border-primary hover:border-accent/50"
								}`}
							>
								<input
									type="radio"
									name="payment"
									value="card"
									checked={paymentMethod === "card"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="w-5 h-5 text-accent"
								/>
								<FaCreditCard className="text-2xl text-purple-600" />
								<div className="flex-1">
									<p className="font-semibold text-secondary">
										Credit/Debit Card
									</p>
									<p className="text-xs text-secondary/60">
										Pay securely with your card
									</p>
								</div>
							</label>

							{/* Mobile Payment */}
							<label
								className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
									paymentMethod === "mobile-payment"
										? "border-accent bg-accent/5"
										: "border-primary hover:border-accent/50"
								}`}
							>
								<input
									type="radio"
									name="payment"
									value="mobile-payment"
									checked={paymentMethod === "mobile-payment"}
									onChange={(e) => setPaymentMethod(e.target.value)}
									className="w-5 h-5 text-accent"
								/>
								<FaMobileAlt className="text-2xl text-orange-600" />
								<div className="flex-1">
									<p className="font-semibold text-secondary">Mobile Payment</p>
									<p className="text-xs text-secondary/60">
										eZ Cash, FriMi, gCash, etc.
									</p>
								</div>
							</label>
						</div>

						{/* Payment Details Form (for online payments) */}
						{paymentMethod !== "cash-on-delivery" && (
							<div className="mt-4 p-4 bg-gradient-to-r from-accent/5 to-primary/30 rounded-2xl border-2 border-accent/20">
								<h3 className="font-semibold text-secondary mb-3 text-sm">
									Payment Details
								</h3>
								<div className="flex flex-col gap-3">
									<div>
										<label className="text-xs font-medium text-secondary/80 mb-1 block">
											Transaction ID / Reference Number *
										</label>
										<input
											type="text"
											value={paymentDetails.transactionId}
											onChange={(e) =>
												setPaymentDetails({
													...paymentDetails,
													transactionId: e.target.value,
												})
											}
											placeholder="Enter transaction ID"
											className="w-full h-[45px] border-2 border-primary focus:border-accent rounded-xl px-3 text-sm text-secondary transition-colors focus:outline-none"
										/>
									</div>

									{paymentMethod === "bank-transfer" && (
										<>
											<div>
												<label className="text-xs font-medium text-secondary/80 mb-1 block">
													Bank Name
												</label>
												<input
													type="text"
													value={paymentDetails.bankName}
													onChange={(e) =>
														setPaymentDetails({
															...paymentDetails,
															bankName: e.target.value,
														})
													}
													placeholder="e.g., Bank of Ceylon"
													className="w-full h-[45px] border-2 border-primary focus:border-accent rounded-xl px-3 text-sm text-secondary transition-colors focus:outline-none"
												/>
											</div>
											<div>
												<label className="text-xs font-medium text-secondary/80 mb-1 block">
													Account Number (Last 4 digits)
												</label>
												<input
													type="text"
													value={paymentDetails.accountNumber}
													onChange={(e) =>
														setPaymentDetails({
															...paymentDetails,
															accountNumber: e.target.value,
														})
													}
													placeholder="e.g., ****1234"
													maxLength={4}
													className="w-full h-[45px] border-2 border-primary focus:border-accent rounded-xl px-3 text-sm text-secondary transition-colors focus:outline-none"
												/>
											</div>
										</>
									)}

									<div>
										<label className="text-xs font-medium text-secondary/80 mb-1 block">
											Payment Proof (Screenshot/Receipt)
										</label>
										<input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													setPaymentDetails({
														...paymentDetails,
														paymentProof: file,
													});
												}
											}}
											className="w-full text-sm text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/90 file:cursor-pointer"
										/>
										<p className="text-xs text-secondary/60 mt-1">
											Upload proof of payment for verification
										</p>
									</div>

									<div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-2">
										<p className="text-xs text-blue-800 font-semibold mb-1">
											📝 Bank Transfer Instructions:
										</p>
										<p className="text-xs text-blue-700">
											Bank: Bank of Ceylon<br />
											Account: 1234567890<br />
											Name: Glimora Beauty Glow<br />
											Branch: Colombo
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Order Summary */}
					<div className="bg-gradient-to-br from-accent/10 to-primary rounded-3xl shadow-lg p-6 sticky top-4">
						<h2 className="text-xl font-semibold text-secondary mb-4">
							Order Summary
						</h2>
						
						{/* Membership Badge */}
						{discountRate > 0 && (
							<div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-3 mb-4">
								<div className="flex items-center gap-2 mb-1">
									<FaCrown className={`text-lg ${getTierColor()}`} />
									<span className={`font-bold ${getTierColor()}`}>{membershipTier} Member</span>
								</div>
								<p className="text-xs text-secondary/60">You're getting {discountRate}% discount!</p>
							</div>
						)}
						
						<div className="space-y-3 mb-4">
							<div className="flex justify-between text-secondary/70">
								<span>Subtotal</span>
								<span>LKR {getTotal().toFixed(2)}</span>
							</div>
							{discountRate > 0 && (
								<div className="flex justify-between text-green-600 font-semibold">
									<span>Membership Discount ({discountRate}%)</span>
									<span>- LKR {getDiscount().toFixed(2)}</span>
								</div>
							)}
							<div className="flex justify-between text-secondary/70">
								<span>Shipping</span>
								<span className="text-green-600">Free</span>
							</div>
							<div className="h-px bg-secondary/20"></div>
							<div className="flex justify-between text-secondary font-bold text-xl">
								<span>Total</span>
								<span className="text-accent">LKR {getFinalTotal().toFixed(2)}</span>
							</div>
						</div>
						<button
							onClick={purchaseCart}
							disabled={uploadingProof}
							className="w-full bg-gradient-to-r from-accent to-accent/80 text-white font-semibold px-6 py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							<FaShoppingBag />
							{uploadingProof
								? "Uploading..."
								: paymentMethod === "cash-on-delivery"
								? "Place Order (COD)"
								: "Complete Payment & Order"}
						</button>
						{paymentMethod !== "cash-on-delivery" && (
							<p className="text-xs text-center text-secondary/60 mt-2">
								Your order will be processed after payment verification
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
