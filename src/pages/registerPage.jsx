import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const[firstName, setFirstName] = useState("");
    const[lastName, setLastName] = useState("");
    const[confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate()

	async function register() {
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
		try {
			await axios.post(
				import.meta.env.VITE_API_URL + "/api/users/",
				{ 
                    email : email,
                    password : password, 
                    firstName : firstName,
                    lastName : lastName
                }
			);
            
            toast.success("Registration successful! Please login.");
            navigate("/login");

		} catch (e) {
			console.error("Login failed:", e);
            //alert("Login failed. Please check your credentials.");
            toast.error("Login failed. Please check your credentials.");
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
								Join Us. <span className="text-yellow-300 animate-pulse">Glow Together.</span>
							</h1>
							<p className="text-white/95 text-xl font-medium drop-shadow">
								Create your account to unlock exclusive beauty deals, personalized
								recommendations, and seamless shopping. ✨ Your beauty journey starts here.
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
									Create Account ✨
								</h2>
								<p className="text-gray-600 text-sm font-medium">
									Join GBG and start your beautiful journey today! 
								</p>
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<label
											htmlFor="firstName"
											className="text-sm font-bold text-gray-700 flex items-center gap-2"
										>
											<span className="text-purple-600"></span> First Name
										</label>
										<input
											id="firstName"
											type="text"
											placeholder="e.g., John"
											autoComplete="given-name"
											onChange={(e) => setFirstName(e.target.value)}
											className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-purple-200 focus:ring-purple-500 focus:from-purple-100 focus:to-pink-100 transition-all font-medium"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="lastName"
											className="text-sm font-bold text-gray-700 flex items-center gap-2"
										>
											<span className="text-pink-600"></span> Last Name
										</label>
										<input
											id="lastName"
											type="text"
											placeholder="e.g., Doe"
											autoComplete="family-name"
											onChange={(e) => setLastName(e.target.value)}
											className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-50 to-orange-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-pink-200 focus:ring-pink-500 focus:from-pink-100 focus:to-orange-100 transition-all font-medium"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-bold text-gray-700 flex items-center gap-2"
									>
										<span className="text-orange-600"></span> Email address
									</label>
									<input
										id="email"
										type="email"
										placeholder="e.g., you@example.com"
										autoComplete="email"
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-11 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-orange-200 focus:ring-orange-500 focus:from-orange-100 focus:to-yellow-100 transition-all font-medium"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="password"
										className="text-sm font-bold text-gray-700 flex items-center gap-2"
									>
										<span className="text-green-600"></span> Password
									</label>
									<input
										id="password"
										type="password"
										placeholder="Create a strong password"
										autoComplete="new-password"
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-11 rounded-xl bg-gradient-to-r from-green-50 to-cyan-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-green-200 focus:ring-green-500 focus:from-green-100 focus:to-cyan-100 transition-all font-medium"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="confirmPassword"
										className="text-sm font-bold text-gray-700 flex items-center gap-2"
									>
										<span className="text-cyan-600"></span> Confirm Password
									</label>
									<input
										id="confirmPassword"										
										type="password"
										placeholder="Re-enter your password"
										autoComplete="new-password"
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="w-full h-11 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 text-gray-800 placeholder-gray-400 px-4 outline-none ring-2 ring-cyan-200 focus:ring-cyan-500 focus:from-cyan-100 focus:to-blue-100 transition-all font-medium"
									/>
								</div>

								<button
									onClick={register}
									className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white font-bold text-lg shadow-xl shadow-purple-300/50 hover:shadow-2xl hover:shadow-pink-400/50 hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden group"
								>
									<span className="relative z-10 flex items-center justify-center gap-2">
										Create Account <span className="group-hover:translate-x-1 transition-transform"></span>
									</span>
									<div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
								</button>
							</div>

							<div className="mt-8 text-center text-sm">
								<span className="text-gray-600 font-medium">Already have an account? </span>
								<Link
									to="/login"
									className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold hover:from-pink-600 hover:to-orange-600 transition-all"
								>
									Login here 
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