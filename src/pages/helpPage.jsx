import { FaQuestionCircle, FaShoppingBag, FaTruck, FaCreditCard, FaUndo, FaShieldAlt } from "react-icons/fa";
import { useState } from "react";

export default function HelpPage() {
	const [activeCategory, setActiveCategory] = useState("orders");

	const faqs = {
		orders: [
			{
				question: "How do I place an order?",
				answer: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping information and choose your payment method to complete your order."
			},
			{
				question: "Can I modify or cancel my order?",
				answer: "You can request order modifications or cancellations from the 'My Orders' page before the order is shipped. Once shipped, modifications are not possible, but you can request a return after delivery."
			},
			{
				question: "How do I track my order?",
				answer: "Visit the 'My Orders' page and click on your order to view detailed tracking information including order status, tracking number, and estimated delivery date."
			},
			{
				question: "What should I do if I receive a damaged product?",
				answer: "Please contact us immediately with photos of the damaged item. We'll arrange for a replacement or refund within 24-48 hours."
			}
		],
		shipping: [
			{
				question: "What are the shipping charges?",
				answer: "Shipping charges are calculated based on your location and order weight. Free shipping is available for orders over LKR 5,000 within Colombo."
			},
			{
				question: "How long does delivery take?",
				answer: "Standard delivery takes 3-5 business days within Colombo and 5-7 business days for other areas in Sri Lanka."
			},
			{
				question: "Do you ship internationally?",
				answer: "Currently, we only ship within Sri Lanka. International shipping will be available soon."
			},
			{
				question: "Can I change my delivery address?",
				answer: "Yes, you can change your delivery address before the order is shipped by contacting our support team or requesting changes through the 'My Orders' page."
			}
		],
		payment: [
			{
				question: "What payment methods do you accept?",
				answer: "We accept Cash on Delivery (COD), Bank Transfers, Credit/Debit Cards, and Mobile Payments (eZ Cash, mCash)."
			},
			{
				question: "Is it safe to use my credit card?",
				answer: "Yes, all card transactions are secured with SSL encryption. We never store your complete card details on our servers."
			},
			{
				question: "When will I be charged?",
				answer: "For online payments, you're charged immediately. For COD, payment is collected upon delivery. For bank transfers, your order is processed after payment verification."
			},
			{
				question: "Can I get a refund?",
				answer: "Yes, refunds are processed within 7-10 business days for returned items or cancelled orders, depending on your payment method."
			}
		],
		returns: [
			{
				question: "What is your return policy?",
				answer: "We offer a 14-day return policy for unused, unopened products in original packaging. Beauty and cosmetic products must be sealed for hygiene reasons."
			},
			{
				question: "How do I return a product?",
				answer: "Go to 'My Orders', select the order you want to return, and click 'Request Return'. Our team will contact you with return instructions and arrange pickup."
			},
			{
				question: "Who pays for return shipping?",
				answer: "Return shipping is free if the product is defective or wrong. For other returns, shipping charges may apply based on your location."
			},
			{
				question: "When will I get my refund?",
				answer: "Refunds are processed within 3-5 business days after we receive and inspect the returned product. The amount will be credited to your original payment method."
			}
		],
		account: [
			{
				question: "How do I create an account?",
				answer: "Click on 'Register' in the header, fill in your details including name, email, and password. You can also sign up using your Google account for faster registration."
			},
			{
				question: "I forgot my password. What should I do?",
				answer: "Click 'Forgot Password' on the login page, enter your email, and we'll send you a password reset link. Follow the instructions to create a new password."
			},
			{
				question: "How do I update my profile information?",
				answer: "Go to 'Settings' from your account menu to update your personal information, contact details, and password."
			},
			{
				question: "Can I delete my account?",
				answer: "Yes, you can request account deletion by contacting our support team. Please note that this action cannot be undone and all your data will be permanently removed."
			}
		]
	};

	const categories = [
		{ id: "orders", name: "Orders & Purchases", icon: FaShoppingBag, color: "from-blue-500 to-blue-600" },
		{ id: "shipping", name: "Shipping & Delivery", icon: FaTruck, color: "from-green-500 to-green-600" },
		{ id: "payment", name: "Payment Methods", icon: FaCreditCard, color: "from-purple-500 to-purple-600" },
		{ id: "returns", name: "Returns & Refunds", icon: FaUndo, color: "from-orange-500 to-orange-600" },
		{ id: "account", name: "Account & Security", icon: FaShieldAlt, color: "from-pink-500 to-pink-600" }
	];

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 py-12 px-4">
			<div className="max-w-[1400px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
							<FaQuestionCircle className="text-white text-2xl" />
						</div>
						<div>
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-blue-600 bg-clip-text text-transparent">
								Help Center
							</h1>
							<p className="text-secondary/60 font-medium">
								Find answers to frequently asked questions
							</p>
						</div>
					</div>
				</div>

				{/* Category Tabs */}
				<div className="bg-white rounded-3xl shadow-xl p-6 mb-8 border-2 border-accent/20">
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{categories.map((category) => {
							const Icon = category.icon;
							return (
								<button
									key={category.id}
									onClick={() => setActiveCategory(category.id)}
									className={`group p-6 rounded-2xl transition-all duration-300 ${
										activeCategory === category.id
											? "bg-gradient-to-br " + category.color + " text-white shadow-lg scale-105"
											: "bg-secondary/5 hover:bg-secondary/10 text-secondary"
									}`}
								>
									<Icon className={`text-4xl mb-3 mx-auto ${activeCategory === category.id ? "" : "group-hover:scale-110"} transition-transform`} />
									<h3 className="font-bold text-sm text-center leading-tight">
										{category.name}
									</h3>
								</button>
							);
						})}
					</div>
				</div>

				{/* FAQ Content */}
				<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
					<h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-3">
						{categories.find(c => c.id === activeCategory)?.name}
						<span className="text-sm bg-accent/10 text-accent px-3 py-1 rounded-full">
							{faqs[activeCategory].length} Questions
						</span>
					</h2>
					<div className="space-y-4">
						{faqs[activeCategory].map((faq, index) => (
							<details
								key={index}
								className="group bg-gradient-to-br from-white to-primary/20 rounded-2xl border-2 border-secondary/10 overflow-hidden hover:border-accent/30 transition-all"
							>
								<summary className="cursor-pointer p-6 font-bold text-secondary text-lg flex items-start gap-4 hover:text-accent transition-colors">
									<span className="flex-shrink-0 w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center font-bold text-sm">
										{index + 1}
									</span>
									<span className="flex-1">{faq.question}</span>
									<span className="text-accent group-open:rotate-180 transition-transform">▼</span>
								</summary>
								<div className="px-6 pb-6 text-secondary/70 leading-relaxed border-t border-secondary/10 pt-4 mx-6">
									{faq.answer}
								</div>
							</details>
						))}
					</div>
				</div>

				{/* Contact Support */}
				<div className="mt-8 bg-gradient-to-r from-accent to-accent/90 rounded-3xl shadow-2xl p-8 text-white">
					<div className="flex flex-col md:flex-row items-center justify-between gap-6">
						<div>
							<h3 className="text-2xl font-bold mb-2">Still Need Help?</h3>
							<p className="text-white/80">
								Our support team is here to assist you 24/7
							</p>
						</div>
						<div className="flex gap-4">
							<a
								href="/contact"
								className="px-8 py-4 bg-white text-accent rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
							>
								Contact Support
							</a>
							<a
								href="/messages"
								className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold border-2 border-white/20 transition-all"
							>
								Send Message
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
