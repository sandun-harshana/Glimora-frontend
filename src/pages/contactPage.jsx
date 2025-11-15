export default function ContactPage() {
	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-b from-primary via-white to-primary py-16 px-6 relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
			
			<div className="max-w-6xl mx-auto relative z-10">
				{/* Header */}
				<div className="text-center mb-20">
					<div className="inline-block px-6 py-3 bg-accent/10 rounded-full mb-6">
						<span className="text-accent font-semibold text-sm uppercase tracking-wider">Get In Touch</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6">Contact Us</h1>
					<div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full mb-8"></div>
					<p className="text-xl text-secondary/80 max-w-3xl mx-auto leading-relaxed">
						We love hearing from you! Whether you have questions about our products, your orders, or want to collaborate — we're here to help.
					</p>
				</div>

				{/* Contact Information */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					{/* Contact Details */}
					<div className="group bg-white rounded-3xl shadow-xl p-8 border border-accent/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-8">
								<div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
									<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-secondary">Contact Information</h2>
							</div>
							<div className="space-y-6">
								<div className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300 group/item">
									<div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
										<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-secondary mb-2 text-lg">Address</h3>
										<p className="text-secondary/70">Glimora Beauty Glow HQ</p>
										<p className="text-secondary/70">Colombo, Sri Lanka</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300 group/item">
									<div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
										<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-secondary mb-2 text-lg">Phone</h3>
										<a href="tel:+94752679256" className="text-accent hover:underline text-lg font-medium">+94 75 267 9256</a>
										<p className="text-secondary/60 text-sm mt-1">Mon-Sat: 9AM - 6PM</p>
									</div>
								</div>
								<div className="flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300 group/item">
									<div className="w-12 h-12 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
										<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
										</svg>
									</div>
									<div>
										<h3 className="font-bold text-secondary mb-2 text-lg">Email</h3>
										<a href="mailto:support@glimorabeautyglow.com" className="text-accent hover:underline break-all">
											support@glimorabeautyglow.com
										</a>
										<p className="text-secondary/60 text-sm mt-1">We reply within 24 hours</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Business Hours */}
					<div className="group bg-gradient-to-br from-accent/10 to-white rounded-3xl shadow-xl p-8 border border-accent/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="flex items-center gap-3 mb-8">
								<div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
									<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
								<h2 className="text-2xl font-bold text-secondary">Customer Support</h2>
							</div>
							<div className="space-y-4">
								<div className="flex justify-between items-center py-4 px-4 rounded-xl bg-white hover:shadow-md transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span className="font-semibold text-secondary">Monday – Friday</span>
									</div>
									<span className="text-secondary/70 font-medium">9:00 AM – 6:00 PM</span>
								</div>
								<div className="flex justify-between items-center py-4 px-4 rounded-xl bg-white hover:shadow-md transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
										<span className="font-semibold text-secondary">Saturday</span>
									</div>
									<span className="text-secondary/70 font-medium">10:00 AM – 4:00 PM</span>
								</div>
								<div className="flex justify-between items-center py-4 px-4 rounded-xl bg-white/50 hover:shadow-md transition-all duration-300">
									<div className="flex items-center gap-3">
										<div className="w-2 h-2 bg-red-500 rounded-full"></div>
										<span className="font-semibold text-secondary">Sunday</span>
									</div>
									<span className="text-secondary/70 font-medium">Closed</span>
								</div>
							</div>
							<div className="mt-6 p-4 bg-white rounded-xl">
								<p className="text-sm text-secondary/70 text-center">
									<svg className="w-5 h-5 text-accent inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
									Response time: Within 24 hours
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Social Media */}
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-accent/10 hover:shadow-2xl transition-all duration-500">
					<div className="text-center mb-10">
						<div className="inline-block px-6 py-3 bg-accent/10 rounded-full mb-4">
							<span className="text-accent font-semibold text-sm">Connect With Us</span>
						</div>
						<h2 className="text-3xl font-bold text-secondary mb-4">Follow Us on Social Media</h2>
						<div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full mb-6"></div>
						<p className="text-secondary/70 max-w-2xl mx-auto">Stay connected and join our beauty community! Get the latest updates, beauty tips, and exclusive offers.</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
						<a 
							href="https://instagram.com/glimorabeautyglow" 
							target="_blank" 
							rel="noopener noreferrer"
							className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
							<svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
							</svg>
							<span className="relative z-10">Instagram</span>
						</a>
						<a 
							href="https://wa.me/94752679256" 
							target="_blank" 
							rel="noopener noreferrer"
							className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
							<svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
							</svg>
							<span className="relative z-10">WhatsApp</span>
						</a>
						<a 
							href="https://facebook.com/glimorabeautyglow" 
							target="_blank" 
							rel="noopener noreferrer"
							className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
							<svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
							</svg>
							<span className="relative z-10">Facebook</span>
						</a>
						<a 
							href="https://tiktok.com/@glimora.glow" 
							target="_blank" 
							rel="noopener noreferrer"
							className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
						>
							<div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
							<svg className="w-6 h-6 relative z-10" fill="currentColor" viewBox="0 0 24 24">
								<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
							</svg>
							<span className="relative z-10">TikTok</span>
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
