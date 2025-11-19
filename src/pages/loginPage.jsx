import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate()
	const googleLogin = useGoogleLogin({
			onSuccess: (response)=>{
				axios.post(import.meta.env.VITE_API_URL + "/api/users/google-login",{
					token : response.access_token
				}).then((res)=>{
					localStorage.setItem("token",res.data.token)
					const user = res.data.user;
					if(user.role == "admin"){
						navigate("/admin");
					}else{
						navigate("/");
					}
				}).catch((err)=>{
					console.error("Google login failed:", err);
					toast.error("Google login failed. Please try again.");
				});
			}
	});

	async function login() {
		// Input validation
		if (!email || !email.trim()) {
			toast.error("Please enter your email address");
			return;
		}
		
		if (!password || !password.trim()) {
			toast.error("Please enter your password");
			return;
		}
		
		// Basic email format validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Please enter a valid email address");
			return;
		}
		
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "/api/users/login",
				{ email : email.trim(), password : password }
			);
            localStorage.setItem("token",response.data.token)
            toast.success("Login successful!");
			const user = response.data.user;
			if (user.role == "admin") { 
				navigate("/admin");
			} else {
				navigate("/");
			}
		} catch (e) {
			console.error("Login failed:", e);
			
			// Handle different error types
			if (e.response) {
				const status = e.response.status;
				const message = e.response.data?.message || "Login failed";
				
				if (status === 404) {
					toast.error("User not found. Please check your email.");
				} else if (status === 401) {
					toast.error("Invalid password. Please try again.");
				} else if (status === 403) {
					toast.error(message); // Account blocked message
				} else {
					toast.error(message);
				}
			} else if (e.request) {
				toast.error("Cannot connect to server. Please check your connection.");
			} else {
				toast.error("Login failed. Please try again.");
			}
		}
	}

	return (
		<div className="min-h-screen w-full relative flex items-stretch overflow-hidden">
			{/* Background image */}
			<div className="absolute inset-0">
				<div className="h-full w-full bg-[url('/bg.jpg')] bg-cover bg-center" />
			</div>
			
			{/* Animated gradient overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 via-pink-500/60 to-orange-400/70"></div>
			
			{/* Animated floating orbs */}
			<div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
			<div className="absolute top-40 right-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
			<div className="absolute bottom-20 left-40 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

			{/* Layout */}
			<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full">
				{/* Left side hero */}
				<div className="hidden lg:flex flex-col justify-between p-10">
					<div className="flex items-center gap-4 backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl">
						<img
							src="/logo.png"
							alt="GBG - Glimora Beauty Glow"
							className="h-20 w-auto drop-shadow-lg"
						/>
						<span className="text-white tracking-wide font-bold text-lg drop-shadow-md">
							GBG • Glimora Beauty Glow
						</span>
					</div>

					<div className="flex-1 flex items-center">
						<div className="max-w-xl space-y-6 backdrop-blur-md bg-white/5 p-8 rounded-3xl border border-white/20">
							<h1 className="text-6xl font-bold leading-tight text-white drop-shadow-lg">
								Your Glow. <span className="text-yellow-300 animate-pulse">Our Passion.</span>
							</h1>
							<p className="text-white/95 text-xl font-medium drop-shadow">
								Sign in to explore exclusive offers, track your orders, and save
								your favorite beauty picks. ✨ Beautiful shopping.
							</p>
							<div className="flex gap-2">
								<div className="h-2 w-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
								<div className="h-2 w-20 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full animate-pulse animation-delay-1000" />
								<div className="h-2 w-20 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full animate-pulse animation-delay-2000" />
							</div>
						</div>
					</div>

					<p className="text-white/90 text-sm font-semibold backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/20">
						© {new Date().getFullYear()} GBG – Glimora Beauty Glow. All rights
						reserved. 
					</p>
				</div>

				{/* Right side form */}
				<div className="flex items-center justify-center p-6 sm:p-10">
					<div className="w-full max-w-md">
						<div className="rounded-3xl backdrop-blur-xl bg-white/95 border-2 border-white/40 shadow-2xl p-8 sm:p-10 transform hover:scale-[1.02] transition-transform duration-300">
							<div className="mb-8 flex flex-col items-center text-center">
								<div className="relative mb-4">
									<div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full blur-xl opacity-60 animate-pulse"></div>
									<img
										src="/logo.png"
										alt="GBG Logo"
										className="h-24 w-auto relative z-10 drop-shadow-2xl"
									/>
								</div>
								<h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-2">
									Welcome Back! ✨
								</h2>
								<p className="text-gray-600 text-sm font-medium">
									Log in to continue your beauty journey and checkout faster. 
								</p>
							</div>

							<div className="space-y-5">
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-bold text-gray-700 flex items-center gap-2"
									>
										<span className="text-purple-600"></span> Email address
									</label>
									<input
										id="email"
										type="email"
										placeholder="e.g., you@example.com"
										autoComplete="email"
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-purple-200 focus:ring-purple-500 focus:from-purple-100 focus:to-pink-100 transition-all font-medium"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="password"
										className="text-sm font-bold text-gray-700 flex items-center gap-2"
									>
										<span className="text-pink-600"></span> Password
									</label>
									<input
										id="password"
										type="password"
										placeholder="Enter your password"
										autoComplete="current-password"
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-pink-200 focus:ring-pink-500 focus:from-pink-100 focus:to-orange-100 transition-all font-medium"
									/>
								</div>

								<div className="flex items-center justify-end text-sm">
									<Link
										to="/forget-password"
										className="text-purple-600 hover:text-pink-600 font-bold hover:underline underline-offset-4 transition-colors"
									>
										Forgot password? 
									</Link>
								</div>

								<button
									onClick={login}
									className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-bold text-lg shadow-xl shadow-purple-300/50 hover:shadow-2xl hover:shadow-pink-400/50 hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										Login <span className="group-hover:translate-x-1 transition-transform"></span>
									</span>
									<div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
								</button>
								
								<div className="relative text-center">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t-2 border-gradient-to-r from-purple-300 via-pink-300 to-orange-300"></span>
									</div>
									<span className="relative bg-white px-4 text-sm text-gray-500 font-semibold">or</span>
								</div>
								
								<button
									onClick={googleLogin}
									className="w-full h-12 rounded-xl bg-white text-gray-700 font-bold text-lg shadow-lg border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group"
								>
									<svg className="w-5 h-5" viewBox="0 0 24 24">
										<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
										<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
										<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
										<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
									</svg>
									<span className="group-hover:text-purple-600 transition-colors">Continue with Google</span>
								</button>
							</div>

							<div className="mt-8 text-center text-sm">
								<span className="text-gray-600 font-medium">New to GBG? </span>
								<Link
									to="/register"
									className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold hover:from-pink-600 hover:to-orange-600 transition-all"
								>
									Create your account 
								</Link>
							</div>
						</div>

						{/* Small footer for mobile */}
						<p className="mt-6 text-center text-white/95 text-xs lg:hidden font-semibold backdrop-blur-sm bg-white/10 rounded-xl p-3 border border-white/20">
							© {new Date().getFullYear()} GBG – Glimora Beauty Glow 
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
