import { useState, useEffect } from "react";
import { FaGift, FaStar, FaTrophy, FaCrown, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import axios from "axios";

export default function RewardsPage() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [points, setPoints] = useState(0);
	const [tier, setTier] = useState("Bronze");
	const [discountRate, setDiscountRate] = useState(0);

	useEffect(() => {
		fetchMembershipInfo();

		// Listen for new order events to update points in real-time
		const handleOrderPlaced = () => {
			fetchMembershipInfo();
		};

		window.addEventListener('order-placed', handleOrderPlaced);

		return () => {
			window.removeEventListener('order-placed', handleOrderPlaced);
		};
	}, []);

	const fetchMembershipInfo = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				setIsLoading(false);
				return;
			}

			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/membership", {
				headers: { Authorization: `Bearer ${token}` },
			});

			setPoints(res.data.points);
			setTier(res.data.membershipTier);
			setDiscountRate(res.data.discountRate);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching membership info:", err);
			setIsLoading(false);
		}
	};

	const getTierColor = (tierName) => {
		const colors = {
			Bronze: "from-orange-600 to-orange-700",
			Silver: "from-gray-400 to-gray-500",
			Gold: "from-yellow-500 to-yellow-600",
			Diamond: "from-blue-400 to-purple-500",
		};
		return colors[tierName] || colors.Bronze;
	};

	const getTierIcon = (tierName) => {
		const icons = {
			Bronze: FaStar,
			Silver: FaTrophy,
			Gold: FaCrown,
			Diamond: FaGift,
		};
		const Icon = icons[tierName] || FaStar;
		return <Icon className="text-6xl" />;
	};

	const getNextTier = () => {
		const tiers = ["Bronze", "Silver", "Gold", "Diamond"];
		const currentIndex = tiers.indexOf(tier);
		return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
	};

	const getPointsToNextTier = () => {
		const thresholds = { Bronze: 200, Silver: 500, Gold: 1000 };
		const nextTier = getNextTier();
		if (!nextTier) return 0;
		return thresholds[nextTier] - points;
	};

	const benefits = {
		Bronze: [
			"0% discount on all orders",
			"1 point per LKR 100 spent",
			"Exclusive member-only promotions",
			"Birthday month special discount",
		],
		Silver: [
			"5% discount on all orders",
			"1 point per LKR 100 spent",
			"Priority customer support",
			"Free shipping on orders over LKR 3,000",
			"Early access to sales",
		],
		Gold: [
			"10% discount on all orders",
			"1 point per LKR 100 spent",
			"Free shipping on all orders",
			"Exclusive product launches",
			"15% birthday month discount",
			"VIP customer support",
		],
		Diamond: [
			"15% discount on all orders",
			"1 point per LKR 100 spent",
			"Free express shipping",
			"Personal beauty consultant",
			"20% birthday month discount",
			"Exclusive luxury gift sets",
			"First access to limited editions",
		],
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 py-12 px-4">
			<div className="max-w-[1400px] mx-auto">
				{/* Back Button */}
				<button
					onClick={() => navigate(-1)}
					className="mb-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-secondary rounded-xl shadow-md hover:shadow-lg transition-all"
				>
					<FaArrowLeft />
					<span className="font-semibold">Back</span>
				</button>

				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
							<FaGift className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
								Rewards Program
							</h1>
							<p className="text-secondary/60 font-medium">
								Earn points with every purchase and unlock exclusive benefits
							</p>
						</div>
					</div>
				</div>

				{/* Points and Tier Card */}
				<div className={`bg-gradient-to-br ${getTierColor(tier)} rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden`}>
					<div className="absolute top-0 right-0 w-64 h-64 opacity-20">
						{getTierIcon(tier)}
					</div>
					<div className="relative z-10">
						<div className="flex items-center justify-between mb-6">
							<div>
								<p className="text-white/80 text-sm font-semibold mb-2">Your Tier</p>
								<h2 className="text-5xl font-bold flex items-center gap-3">
									{tier} Member
									<span className="text-3xl">{getTierIcon(tier)}</span>
								</h2>
							</div>
							<div className="text-right">
								<p className="text-white/80 text-sm font-semibold mb-2">Total Points</p>
								<h3 className="text-5xl font-bold">{points}</h3>
							</div>
						</div>

						{/* Progress to Next Tier */}
						{getNextTier() && (
							<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
								<div className="flex items-center justify-between mb-3">
									<p className="font-semibold text-lg">Progress to {getNextTier()}</p>
									<p className="font-bold text-xl">{getPointsToNextTier()} points to go</p>
								</div>
								<div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
									<div
										className="bg-white h-full rounded-full transition-all duration-1000"
										style={{
											width: `${Math.min(
												(points /
													(points + getPointsToNextTier())) *
													100,
												100
											)}%`,
										}}
									></div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* How to Earn Points */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
							<FaShoppingBag className="text-accent" />
							How to Earn Points
						</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-4 p-4 bg-gradient-to-r from-accent/10 to-transparent rounded-2xl border-2 border-accent/20">
								<div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
									<span className="text-white text-2xl font-bold">1</span>
								</div>
								<div>
									<h4 className="font-bold text-secondary mb-1">Shop & Earn</h4>
									<p className="text-secondary/60 text-sm">
										Earn points with every purchase based on your tier level
									</p>
								</div>
							</div>
							<div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-2xl border-2 border-blue-500/20">
								<div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
									<span className="text-white text-2xl font-bold">2</span>
								</div>
								<div>
									<h4 className="font-bold text-secondary mb-1">Complete Orders</h4>
									<p className="text-secondary/60 text-sm">
										Points are credited after successful delivery
									</p>
								</div>
							</div>
							<div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-2xl border-2 border-purple-500/20">
								<div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
									<span className="text-white text-2xl font-bold">3</span>
								</div>
								<div>
									<h4 className="font-bold text-secondary mb-1">Redeem Rewards</h4>
									<p className="text-secondary/60 text-sm">
										Use points for discounts on future purchases
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Current Tier Benefits */}
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
							<FaTrophy className="text-accent" />
							Your Benefits ({tier})
						</h3>
						<div className="space-y-3">
							{benefits[tier].map((benefit, index) => (
								<div
									key={index}
									className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-2xl border-2 border-green-500/20"
								>
									<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
										<svg
											className="w-5 h-5 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
									<p className="font-semibold text-secondary">{benefit}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* All Tiers Overview */}
				<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
					<h3 className="text-2xl font-bold text-secondary mb-6">Membership Tiers</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{["Bronze", "Silver", "Gold", "Diamond"].map((tierName) => (
							<div
								key={tierName}
								className={`p-6 rounded-2xl border-2 transition-all ${
									tier === tierName
										? `bg-gradient-to-br ${getTierColor(tierName)} text-white border-transparent shadow-xl scale-105`
										: "bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20"
								}`}
							>
								<div className="text-center mb-4">
									<div className={`w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center ${
										tier === tierName ? "bg-white/20" : "bg-secondary/10"
									}`}>
										<span className={`text-3xl ${tier === tierName ? "" : "opacity-50"}`}>
											{getTierIcon(tierName)}
										</span>
									</div>
									<h4 className={`text-2xl font-bold mb-2 ${tier === tierName ? "" : "text-secondary"}`}>
										{tierName}
									</h4>
									<p className={`text-sm font-semibold ${tier === tierName ? "text-white/80" : "text-secondary/60"}`}>
										{tierName === "Bronze" && "0-199 points"}
										{tierName === "Silver" && "200-499 points"}
										{tierName === "Gold" && "500-999 points"}
										{tierName === "Diamond" && "1000+ points"}
									</p>
								</div>
								{tier === tierName && (
									<div className="bg-white/20 px-4 py-2 rounded-lg text-center">
										<p className="font-bold text-sm">Your Current Tier</p>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
