import { Link } from "react-router-dom";

export default function LandingPage() {
	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
			{/* Hero Section */}
			<div className="w-full bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 py-16 md:py-24 relative overflow-hidden">
				{/* Animated background elements */}
				<div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
				<div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
				<div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}></div>
				
				<div className="max-w-7xl mx-auto px-6 relative z-10">
					<div className="flex flex-col md:flex-row items-center gap-12">
						<div className="flex-1 space-y-6 animate-fade-in">
							<div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg animate-shimmer">
								<span className="text-white font-semibold text-sm">✨ Premium Organic Beauty</span>
							</div>
							<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight">
								Welcome to <span className="block mt-2 bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">Glimora Beauty Glow</span>
							</h1>
							<p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
								Where nature meets elegance — Glimora Beauty Glow brings you the finest in organic beauty and skincare.
							</p>
							<p className="text-lg text-gray-600 flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-md">
								<svg className="w-6 h-6 text-pink-500 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
								</svg>
								We believe true beauty begins with healthy, glowing skin, powered by nature and perfected by innovation.
							</p>
							<div className="flex flex-wrap gap-4 pt-6">
								<Link 
									to="/products" 
									className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
								>
									Shop Now
									<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
									</svg>
								</Link>
								<Link 
									to="/about" 
									className="px-8 py-4 border-2 border-pink-500 bg-white/80 backdrop-blur-sm text-pink-600 rounded-xl font-semibold text-lg hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white hover:border-transparent hover:scale-105 transition-all duration-300 shadow-lg"
								>
									Learn More
								</Link>
							</div>
						</div>
						<div className="flex-1">
							<div className="relative animate-float">
								<div className="absolute -inset-4 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl blur-3xl opacity-50 animate-pulse"></div>
								<img 
									src="/logo.png" 
									alt="Glimora Beauty Glow" 
									className="relative w-full max-w-md mx-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Why Choose Us Section */}
			<div className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center mb-16">
					<span className="text-pink-600 font-semibold text-sm uppercase tracking-wider bg-pink-100 px-4 py-2 rounded-full">Our Benefits</span>
					<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 mt-4">Why Choose Us</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto rounded-full"></div>
					<p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
						Discover what makes Glimora Beauty Glow the preferred choice for conscious beauty enthusiasts
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-purple-200 hover:border-purple-400 hover:-translate-y-2">
						<div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-purple-900 mb-3 group-hover:text-pink-600 transition-colors">100% Natural</h3>
						<p className="text-gray-600 leading-relaxed">Natural ingredients sourced responsibly from sustainable farms</p>
					</div>
					<div className="group bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-pink-200 hover:border-pink-400 hover:-translate-y-2" style={{animationDelay: '100ms'}}>
						<div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-pink-900 mb-3 group-hover:text-orange-600 transition-colors">Cruelty-Free</h3>
						<p className="text-gray-600 leading-relaxed">Eco-friendly production, never tested on animals</p>
					</div>
					<div className="group bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-orange-200 hover:border-orange-400 hover:-translate-y-2" style={{animationDelay: '200ms'}}>
						<div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-orange-900 mb-3 group-hover:text-yellow-600 transition-colors">Dermatologist-Tested</h3>
						<p className="text-gray-600 leading-relaxed">Clinically tested and safe for all skin types</p>
					</div>
					<div className="group bg-gradient-to-br from-yellow-50 to-green-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 text-center border-2 border-yellow-200 hover:border-yellow-400 hover:-translate-y-2" style={{animationDelay: '300ms'}}>
						<div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
							<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-green-900 mb-3 group-hover:text-green-600 transition-colors">Natural Glow</h3>
						<p className="text-gray-600 leading-relaxed">Designed to help you glow naturally, every day</p>
					</div>
				</div>
			</div>

			{/* Our Promise Section */}
			<div className="w-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 py-20 relative overflow-hidden">
				<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl opacity-30"></div>
				<div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full blur-3xl opacity-30"></div>
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300 to-pink-300 rounded-full blur-3xl opacity-20"></div>
				
				<div className="max-w-5xl mx-auto px-6 text-center relative z-10">
					<div className="inline-block px-6 py-3 bg-white rounded-full shadow-xl mb-6 border-2 border-pink-200">
						<span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent font-bold">✨ Our Commitment</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-8">Our Promise to You</h2>
					<p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto font-medium bg-white/50 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
						At Glimora, we don't just sell cosmetics — we inspire confidence and self-love. 
						Whether it's skincare, makeup, or self-care essentials, each product is crafted to help you shine from within.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
						<div className="bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
							<div className="font-bold text-5xl mb-2">100%</div>
							<p className="text-white/90 font-medium text-lg">Satisfaction Guaranteed</p>
						</div>
						<div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
							<div className="font-bold text-5xl mb-2">500+</div>
							<p className="text-white/90 font-medium text-lg">Premium Products</p>
						</div>
						<div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
							<div className="font-bold text-5xl mb-2">50K+</div>
							<p className="text-white/90 font-medium text-lg">Happy Customers</p>
						</div>
					</div>
				</div>
			</div>

			{/* Collections Section */}
			<div className="max-w-7xl mx-auto px-6 py-20">
				<div className="text-center mb-16">
					<span className="text-pink-600 font-semibold text-sm uppercase tracking-wider bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">Our Products</span>
					<h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 mt-4">Explore Our Collections</h2>
					<div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 mx-auto rounded-full"></div>
					<p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
						Curated collections designed to enhance your natural beauty with the power of nature
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="group bg-gradient-to-br from-purple-100 via-pink-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-purple-200 hover:border-purple-400 hover:-translate-y-2 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-purple-900 mb-3 group-hover:text-pink-600 transition-colors">Glow Essentials</h3>
							<p className="text-gray-600 mb-6 leading-relaxed">Skincare that hydrates and revitalizes your natural beauty with vitamin-rich formulas</p>
							<Link to="/products" className="text-pink-600 font-semibold hover:gap-3 inline-flex items-center gap-2 transition-all group">
								Explore Collection 
								<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</Link>
						</div>
					</div>
					<div className="group bg-gradient-to-br from-pink-100 via-orange-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-pink-200 hover:border-pink-400 hover:-translate-y-2 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-pink-900 mb-3 group-hover:text-orange-600 transition-colors">Pure Botanics</h3>
							<p className="text-gray-600 mb-6 leading-relaxed">Natural products inspired by plant extracts and botanicals from around the world</p>
							<Link to="/products" className="text-orange-600 font-semibold hover:gap-3 inline-flex items-center gap-2 transition-all group">
								Explore Collection 
								<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</Link>
						</div>
					</div>
					<div className="group bg-gradient-to-br from-orange-100 via-yellow-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-orange-200 hover:border-orange-400 hover:-translate-y-2 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300 to-yellow-300 rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
								</svg>
							</div>
							<h3 className="text-2xl font-bold text-orange-900 mb-3 group-hover:text-yellow-600 transition-colors">Luxe Touch</h3>
							<p className="text-gray-600 mb-6 leading-relaxed">Premium beauty for a radiant, luxurious finish with our signature formulations</p>
							<Link to="/products" className="text-yellow-600 font-semibold hover:gap-3 inline-flex items-center gap-2 transition-all group">
								Explore Collection 
								<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</div>
			
			<style jsx>{`
				@keyframes fade-in {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes float {
					0%, 100% { transform: translateY(0px); }
					50% { transform: translateY(-20px); }
				}
				@keyframes shimmer {
					0% { background-position: -200% center; }
					100% { background-position: 200% center; }
				}
				.animate-fade-in {
					animation: fade-in 1s ease-out;
				}
				.animate-float {
					animation: float 6s ease-in-out infinite;
				}
				.animate-shimmer {
					background-size: 200% auto;
					animation: shimmer 3s linear infinite;
				}
			`}</style>
		</div>
	);
}
