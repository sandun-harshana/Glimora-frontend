export default function AboutPage() {
	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-b from-primary via-white to-primary py-16 px-6 relative overflow-hidden">
			{/* Decorative background elements */}
			<div className="absolute top-20 left-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl animate-pulse"></div>
			<div className="absolute bottom-20 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
			
			<div className="max-w-6xl mx-auto relative z-10">
				{/* Header */}
				<div className="text-center mb-20">
					<div className="inline-block px-6 py-3 bg-accent/10 rounded-full mb-6 animate-fade-in">
						<span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Journey</span>
					</div>
					<h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6 animate-fade-in" style={{animationDelay: '100ms'}}>About Us</h1>
					<div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full mb-8"></div>
					<p className="text-xl text-secondary/80 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '200ms'}}>Discover the story behind Glimora Beauty Glow</p>
				</div>

				{/* Our Story */}
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12 border border-accent/10 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
					<div className="relative z-10">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
								<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-secondary">Our Story</h2>
						</div>
						<p className="text-lg text-secondary/80 leading-relaxed mb-6">
							Founded with a passion for natural beauty, Glimora Beauty Glow began as a vision to redefine cosmetics through nature. 
							We believe that the glow you wear should come from care, not chemicals.
						</p>
						<p className="text-lg text-secondary/80 leading-relaxed">
							Our formulas are created using organic ingredients, cutting-edge research, and sustainable practices to give your skin 
							the care it truly deserves. Every product embodies our belief that beauty is best when it's pure.
						</p>
						<div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-accent/10">
							<div className="text-center">
								<div className="text-accent font-bold text-2xl mb-1">2020</div>
								<div className="text-secondary/70 text-sm">Founded</div>
							</div>
							<div className="text-center">
								<div className="text-accent font-bold text-2xl mb-1">100%</div>
								<div className="text-secondary/70 text-sm">Organic</div>
							</div>
							<div className="text-center">
								<div className="text-accent font-bold text-2xl mb-1">50+</div>
								<div className="text-secondary/70 text-sm">Countries</div>
							</div>
						</div>
					</div>
				</div>

				{/* Mission & Vision */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
					<div className="group bg-gradient-to-br from-accent/10 to-white rounded-3xl shadow-lg p-8 border border-accent/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-secondary mb-6 group-hover:text-accent transition-colors">Our Mission</h2>
							<p className="text-lg text-secondary/80 leading-relaxed">
								To empower every person to embrace their natural glow through ethical, effective, and luxurious beauty solutions.
							</p>
						</div>
					</div>
					<div className="group bg-gradient-to-br from-accent/10 to-white rounded-3xl shadow-lg p-8 border border-accent/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
						<div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
						<div className="relative z-10">
							<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
								<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-secondary mb-6 group-hover:text-accent transition-colors">Our Vision</h2>
							<p className="text-lg text-secondary/80 leading-relaxed">
								A world where beauty and sustainability shine together — where every product enhances confidence and nurtures the planet.
							</p>
						</div>
					</div>
				</div>

				{/* Values */}
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-accent/10 hover:shadow-2xl transition-all duration-500">
					<div className="text-center mb-10">
						<h2 className="text-4xl font-bold text-secondary mb-4">Our Values</h2>
						<div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full"></div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300">
							<div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
								<svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
								</svg>
							</div>
							<div>
								<h3 className="font-bold text-secondary text-xl mb-2 group-hover:text-accent transition-colors">Natural & Organic</h3>
								<p className="text-secondary/70 leading-relaxed">Only the finest natural ingredients sourced from certified organic farms</p>
							</div>
						</div>
						<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300">
							<div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
								<svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<h3 className="font-bold text-secondary text-xl mb-2 group-hover:text-accent transition-colors">Sustainable</h3>
								<p className="text-secondary/70 leading-relaxed">Eco-friendly practices that protect our planet for future generations</p>
							</div>
						</div>
						<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300">
							<div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
								<svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
								</svg>
							</div>
							<div>
								<h3 className="font-bold text-secondary text-xl mb-2 group-hover:text-accent transition-colors">Ethical</h3>
								<p className="text-secondary/70 leading-relaxed">Cruelty-free and responsibly sourced with complete transparency</p>
							</div>
						</div>
						<div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-accent/5 transition-all duration-300">
							<div className="w-14 h-14 bg-gradient-to-br from-accent/30 to-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
								<svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<div>
								<h3 className="font-bold text-secondary text-xl mb-2 group-hover:text-accent transition-colors">Effective</h3>
								<p className="text-secondary/70 leading-relaxed">Proven results backed by science, research, and nature</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
