import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";

export default function UserSettings() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");

	const [currentPassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	
	const [user, setUser] = useState(null);
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [loadingPassword, setLoadingPassword] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/login";
			return;
		}
		axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
			headers: { Authorization: `Bearer ${token}` },
		}).then((res) => {
			setFirstName(res.data.firstName);
			setLastName(res.data.lastName);
			setPhone(res.data.phone || "");
			setAddress(res.data.address || "");
			setUser(res.data);
		}).catch(() => {
			localStorage.removeItem("token");
			window.location.href = "/login";
		});
	}, []);

	// Update user profile data
	async function updateUserData() {
		if (!firstName.trim() || !lastName.trim()) {
			toast.error("First name and last name are required");
			return;
		}

		setLoadingProfile(true);
		try {
			let imageUrl = user?.image || "";
			
			if (image != null) {
				setUploadingImage(true);
				toast.loading("Uploading image...");
				const link = await mediaUpload(image);
				imageUrl = link;
				toast.dismiss();
				setUploadingImage(false);
			}

			const data = {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				phone: phone.trim(),
				address: address.trim(),
				image: imageUrl
			};

			const response = await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me", 
				data,
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				}
			);
			
			// Update token if new one is returned
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
			}

			toast.success("Profile updated successfully!");
			setImage(null); // Clear the file input
			
			// Refresh user data
			const updatedUser = await axios.get(
				import.meta.env.VITE_API_URL + "/api/users/me",
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				}
			);
			setUser(updatedUser.data);
		} catch (err) {
			console.error("Error updating profile:", err);
			toast.error(err.response?.data?.message || "Failed to update profile");
		} finally {
			setLoadingProfile(false);
			setUploadingImage(false);
		}
	}

	// Update password
	async function updatePassword() {
		if (!currentPassword.trim()) {
			toast.error("Please enter your current password");
			return;
		}

		if (!password.trim()) {
			toast.error("Please enter a new password");
			return;
		}

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		setLoadingPassword(true);
		try {
			await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me/password", 
				{
					currentPassword: currentPassword,
					password: password,
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
				}
			);
			
			toast.success("Password updated successfully!");
			setCurrentPassword("");
			setPassword("");
			setConfirmPassword("");
		} catch (err) {
			console.error("Error updating password:", err);
			toast.error(err.response?.data?.message || "Failed to update password");
		} finally {
			setLoadingPassword(false);
		}
	}

	const imagePreview = useMemo(
		() => (image ? URL.createObjectURL(image) : ""),
		[image]
	);
	const pwdMismatch =
		password && confirmPassword && password !== confirmPassword;

	return (
		<div className="w-full min-h-screen bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row justify-center py-8">
			{/* Left: User Info */}
			<div className="w-full lg:w-[45%] backdrop-blur-2xl rounded-2xl m-4 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10 h-fit">
				<h1 className="text-2xl font-bold mb-6 text-center text-secondary">
					Profile Settings
				</h1>

				{/* Avatar + Uploader */}
				<div className="flex flex-col items-center gap-4 mb-6">
					<div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-accent/60 shrink-0 shadow-lg">
						{imagePreview ? (
							<img
								src={imagePreview}
								alt="Profile preview"
								className="w-full h-full object-cover"
							/>
						) : user?.image ? (
							<img
								src={user.image}
								alt="Current profile"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full grid place-items-center bg-secondary/10 text-secondary/60 text-lg font-semibold">
								{firstName.charAt(0)}{lastName.charAt(0)}
							</div>
						)}
					</div>

					<label className="inline-flex items-center gap-3 px-6 py-3 rounded-xl cursor-pointer bg-accent/90 hover:bg-accent text-white transition shadow-md">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
						<span className="text-sm font-semibold">
							{uploadingImage ? "Uploading..." : image ? "Change Photo" : "Upload Photo"}
						</span>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							disabled={uploadingImage}
							onChange={(e) => {
								const f =
									e.target.files && e.target.files[0]
										? e.target.files[0]
										: null;
								setImage(f);
							}}
						/>
					</label>
					{image && (
						<button
							onClick={() => setImage(null)}
							className="text-sm text-red-600 hover:text-red-700 underline"
						>
							Remove selected photo
						</button>
					)}
				</div>

				{/* Email (Read-only) */}
				<div className="flex flex-col mb-4">
					<label className="text-sm text-secondary/80 mb-1 font-medium">Email Address</label>
					<input
						value={user?.email || ""}
						readOnly
						className="px-4 py-2.5 rounded-xl bg-secondary/5 border border-secondary/20 outline-none text-secondary/60 cursor-not-allowed"
					/>
					<p className="text-xs text-secondary/60 mt-1">Email cannot be changed</p>
				</div>

				{/* Names */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1 font-medium">First name *</label>
						<input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Jane"
							className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1 font-medium">Last name *</label>
						<input
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition"
						/>
					</div>
				</div>

				{/* Phone */}
				<div className="flex flex-col mb-4">
					<label className="text-sm text-secondary/80 mb-1 font-medium">Phone Number (Optional)</label>
					<input
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder="+1 (555) 000-0000"
						className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition"
					/>
				</div>

				{/* Address */}
				<div className="flex flex-col mb-6">
					<label className="text-sm text-secondary/80 mb-1 font-medium">Address (Optional)</label>
					<textarea
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="123 Main Street, City, State, ZIP"
						rows={3}
						className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition resize-none"
					/>
				</div>

				{/* Save */}
				<div className="flex gap-3">
					<button
						onClick={updateUserData}
						disabled={loadingProfile || uploadingImage}
						className="flex-1 px-5 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loadingProfile ? "Saving..." : "Save Profile"}
					</button>
				</div>
			</div>

			{/* Right: Password */}
			<div className="w-full lg:w-[45%] backdrop-blur-2xl rounded-2xl m-4 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10 h-fit">
				<h2 className="text-2xl font-bold mb-6 text-center text-secondary">
					Change Password
				</h2>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1 font-medium">
							Current password *
						</label>
						<input
							type="password"
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder="••••••••"
							className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1 font-medium">
							New password *
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="px-4 py-2.5 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50 transition"
						/>
						<p className="text-xs text-secondary/60 mt-1">Minimum 6 characters</p>
					</div>

					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1 font-medium">
							Confirm new password *
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							className={`px-4 py-2.5 rounded-xl bg-white/80 border outline-none focus:ring-2 transition ${
								pwdMismatch 
									? "border-red-500 focus:ring-red-500/50" 
									: "border-secondary/10 focus:ring-accent/50"
							}`}
						/>
					</div>

					{pwdMismatch && (
						<div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							<p className="text-sm text-red-700 font-medium">Passwords do not match</p>
						</div>
					)}

					{password && password.length < 6 && (
						<div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
								<path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							<p className="text-sm text-yellow-700 font-medium">Password too short</p>
						</div>
					)}
				</div>

				<div className="mt-6">
					<button
						onClick={updatePassword}
						disabled={!currentPassword || !password || !confirmPassword || pwdMismatch || password.length < 6 || loadingPassword}
						className="w-full px-5 py-3 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loadingPassword ? "Updating..." : "Update Password"}
					</button>
				</div>

				{/* Security Tips */}
				<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
					<h3 className="text-sm font-bold text-blue-900 mb-2">Password Tips:</h3>
					<ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
						<li>Use at least 6 characters (longer is better)</li>
						<li>Mix uppercase and lowercase letters</li>
						<li>Include numbers and special characters</li>
						<li>Avoid common words or personal information</li>
					</ul>
				</div>
			</div>
		</div>
	);
}