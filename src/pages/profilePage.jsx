import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSave, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import mediaUpload from "../utils/mediaUpload";

export default function ProfilePage() {
	const [isLoading, setIsLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const [orderCount, setOrderCount] = useState(0);
	const [points, setPoints] = useState(0);
	
	const [profileData, setProfileData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		image: "",
		address: "",
		city: "",
		postalCode: "",
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		fetchUserData();
		fetchOrderCount();
	}, []);

	const fetchUserData = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) {
				toast.error("Please login first");
				window.location.href = "/login";
				return;
			}

			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});

			setProfileData({
				firstName: res.data.firstName || "",
				lastName: res.data.lastName || "",
				email: res.data.email || "",
				phone: res.data.phone || "",
				image: res.data.image || "",
				address: res.data.address || "",
				city: res.data.city || "",
				postalCode: res.data.postalCode || "",
			});
			setPoints(res.data.points || 0);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching user data:", err);
			toast.error("Failed to load profile");
			setIsLoading(false);
		}
	};

	const fetchOrderCount = async () => {
		try {
			const token = localStorage.getItem("token");
			if (!token) return;

			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
				headers: { Authorization: `Bearer ${token}` },
			});
			
			if (Array.isArray(res.data)) {
				setOrderCount(res.data.length);
			}
		} catch (err) {
			console.error("Error fetching order count:", err);
		}
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			toast.error("Please select an image file");
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size should be less than 5MB");
			return;
		}

		try {
			setUploadingImage(true);
			toast.loading("Uploading image...", { id: "upload" });

			const imageUrl = await mediaUpload(file);
			
			// Update profile with new image
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me",
				{ image: imageUrl },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setProfileData({ ...profileData, image: imageUrl });
			toast.success("Profile picture updated!", { id: "upload" });
		} catch (err) {
			console.error("Error uploading image:", err);
			toast.error("Failed to upload image", { id: "upload" });
		} finally {
			setUploadingImage(false);
		}
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		try {
			setSaving(true);
			const token = localStorage.getItem("token");
			const res = await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me",
				{
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					phone: profileData.phone,
					image: profileData.image,
					address: profileData.address,
					city: profileData.city,
					postalCode: profileData.postalCode,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.data.token) {
				localStorage.setItem("token", res.data.token);
			}

			setSaving(false);
			toast.success("Profile updated successfully!");
		} catch (err) {
			console.error("Error updating profile:", err);
			setSaving(false);
			toast.error("Failed to update profile");
		}
	};

	const handleChangePassword = async (e) => {
		e.preventDefault();

		if (!passwordForm.currentPassword || !passwordForm.newPassword) {
			toast.error("Please fill in all password fields");
			return;
		}

		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			toast.error("New passwords do not match");
			return;
		}

		if (passwordForm.newPassword.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		try {
			setSaving(true);
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me/password",
				{
					currentPassword: passwordForm.currentPassword,
					password: passwordForm.newPassword,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setSaving(false);
			setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
			toast.success("Password changed successfully!");
		} catch (err) {
			console.error("Error changing password:", err);
			setSaving(false);
			toast.error(err.response?.data?.message || "Failed to change password");
		}
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 py-12 px-4">
			<div className="max-w-[1200px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4 mb-6">
						<div className="relative group">
							<div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
								{profileData.image ? (
									<img src={profileData.image} alt="Profile" className="w-full h-full object-cover" />
								) : (
									<FaUser className="text-white text-3xl" />
								)}
							</div>
							{/* Upload overlay */}
							<label 
								htmlFor="profile-image-upload" 
								className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
							>
								<FaCamera className="text-white text-2xl" />
							</label>
							<input
								id="profile-image-upload"
								type="file"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
								disabled={uploadingImage}
							/>
						</div>
						<div className="flex-1">
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
								{profileData.firstName} {profileData.lastName}
							</h1>
							<p className="text-secondary/60 font-medium">{profileData.email}</p>
						</div>
					</div>
					
					{/* Account Stats */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-secondary/10">
						<div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center border-2 border-blue-200">
							<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
								<FaUser className="text-white text-xl" />
							</div>
							<p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Total Orders</p>
							<p className="text-2xl font-bold text-blue-700">{orderCount}</p>
						</div>
						
						<div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center border-2 border-purple-200">
							<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
								<svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
							</div>
							<p className="text-xs text-purple-600 font-bold uppercase tracking-wide mb-1">Reward Points</p>
							<p className="text-2xl font-bold text-purple-700">{points}</p>
						</div>
						
						<div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center border-2 border-green-200">
							<div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
								<FaEnvelope className="text-white text-xl" />
							</div>
							<p className="text-xs text-green-600 font-bold uppercase tracking-wide mb-1">Account Status</p>
							<p className="text-sm font-bold text-green-700">Active</p>
						</div>
						
						<div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center border-2 border-orange-200">
							<div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
								<FaPhone className="text-white text-xl" />
							</div>
							<p className="text-xs text-orange-600 font-bold uppercase tracking-wide mb-1">Contact</p>
							<p className="text-sm font-bold text-orange-700">{profileData.phone || "Not set"}</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-3xl shadow-xl border-2 border-accent/20 mb-8 overflow-hidden">
					<div className="flex border-b-2 border-secondary/10">
						<button
							onClick={() => setActiveTab("profile")}
							className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
								activeTab === "profile"
									? "bg-accent text-white"
									: "text-secondary/70 hover:bg-secondary/5"
							}`}
						>
							<FaUser className="text-lg" />
							Profile Information
						</button>
						<button
							onClick={() => setActiveTab("security")}
							className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
								activeTab === "security"
									? "bg-accent text-white"
									: "text-secondary/70 hover:bg-secondary/5"
							}`}
						>
							<FaLock className="text-lg" />
							Security
						</button>
					</div>
				</div>

				{/* Profile Tab */}
				{activeTab === "profile" && (
					<form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="text-2xl font-bold text-secondary mb-6">Personal Information</h2>
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										First Name
									</label>
									<input
										type="text"
										value={profileData.firstName}
										onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
										required
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Last Name
									</label>
									<input
										type="text"
										value={profileData.lastName}
										onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
										required
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										<FaEnvelope className="inline mr-2" />
										Email (Read-only)
									</label>
									<input
										type="email"
										value={profileData.email}
										disabled
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 bg-secondary/5 text-secondary/60 outline-none"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										<FaPhone className="inline mr-2" />
										Phone Number
									</label>
									<input
										type="tel"
										value={profileData.phone}
										onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									<FaMapMarkerAlt className="inline mr-2" />
									Address
								</label>
								<input
									type="text"
									value={profileData.address}
									onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									placeholder="Street address"
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										City
									</label>
									<input
										type="text"
										value={profileData.city}
										onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
										placeholder="City"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Postal Code
									</label>
									<input
										type="text"
										value={profileData.postalCode}
										onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
										placeholder="Postal code"
									/>
								</div>
							</div>

							<button
								type="submit"
								disabled={saving}
								className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
							>
								<FaSave />
								{saving ? "Saving..." : "Save Changes"}
							</button>
						</div>
					</form>
				)}

				{/* Security Tab */}
				{activeTab === "security" && (
					<form onSubmit={handleChangePassword} className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="text-2xl font-bold text-secondary mb-6">Change Password</h2>
						<div className="space-y-6 max-w-2xl">
							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									Current Password
								</label>
								<input
									type="password"
									value={passwordForm.currentPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									New Password
								</label>
								<input
									type="password"
									value={passwordForm.newPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
								/>
								<p className="text-xs text-secondary/60 mt-1">
									Password must be at least 6 characters long
								</p>
							</div>

							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									Confirm New Password
								</label>
								<input
									type="password"
									value={passwordForm.confirmPassword}
									onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
								/>
							</div>

							<button
								type="submit"
								disabled={saving}
								className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
							>
								<FaLock />
								{saving ? "Changing..." : "Change Password"}
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}
