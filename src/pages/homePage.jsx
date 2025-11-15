import { Route, Routes, Link } from "react-router-dom";
import Header from "../components/header";
import { ProductPage } from "./productPage";
import ProductOverview from "./productOverview";
import CartPage from "./cart";
import CheckoutPage from "./checkout";
import LandingPage from "./landingPage";
import AboutPage from "./aboutPage";
import ContactPage from "./contactPage";
import WishlistPage from "./wishlistPage";
import HelpPage from "./helpPage";
import ProfilePage from "./profilePage";
import RewardsPage from "./rewardsPage";
import MyOrdersPage from "./myOrdersPage";

function NotFoundPage() {
	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-b from-primary to-white flex items-center justify-center px-6">
			<div className="text-center">
				<h1 className="text-9xl font-bold text-accent mb-4">404</h1>
				<h2 className="text-3xl font-bold text-secondary mb-4">Page Not Found</h2>
				<p className="text-lg text-secondary/70 mb-8">Oops! The page you're looking for doesn't exist.</p>
				<Link 
					to="/" 
					className="inline-block px-8 py-4 bg-accent text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}

export default function HomePage() {
	return (
		<div className="w-full min-h-screen bg-primary">
			<Header />
			<Routes path="/">
				<Route path="/" element={<LandingPage />} />
				<Route path="/products" element={<ProductPage/>} />
				<Route path="/wishlist" element={<WishlistPage/>} />
				<Route path="/rewards" element={<RewardsPage/>} />
				<Route path="/help" element={<HelpPage/>} />
				<Route path="/profile" element={<ProfilePage/>} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/overview/:id" element={<ProductOverview/>} />
				<Route path="/cart" element={<CartPage/>} />
				<Route path="/checkout" element={<CheckoutPage/>} />
				<Route path="/my-orders" element={<MyOrdersPage/>} />
				<Route path="/*" element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}
