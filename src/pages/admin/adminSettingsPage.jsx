import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaCog, FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSave, FaUser, FaLock } from "react-icons/fa";

export default function AdminSettingsPage() {
	const [activeTab, setActiveTab] = useState("store");
	const [saving, setSaving] = useState(false);
	const [adminInfo, setAdminInfo] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		image: "",
	});

	const [storeSettings, setStoreSettings] = useState({
		storeName: "Glimora Beauty Glow",
		storeEmail: "support@gbg.com",
		storePhone: "+94 77 123 4567",
		storeAddress: "123 Beauty Street, Colombo, Sri Lanka",
		currency: "LKR",
		taxRate: "0",
	});

	const [passwordForm, setPasswordForm] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	useEffect(() => {
		fetchAdminInfo();
	}, []);

	const fetchAdminInfo = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setAdminInfo({
				firstName: res.data.firstName || "",
				lastName: res.data.lastName || "",
				email: res.data.email || "",
				phone: res.data.phone || "",
				image: res.data.image || "",
			});
		} catch (err) {
			console.error("Error fetching admin info:", err);
		}
	};

	const handleSaveStoreSettings = () => {
		setSaving(true);
		// Store settings would typically be saved to backend
		// For now, we'll just save to localStorage as a demo
		localStorage.setItem("storeSettings", JSON.stringify(storeSettings));
		setTimeout(() => {
			setSaving(false);
			toast.success("Store settings saved successfully!");
		}, 500);
	};

	const handleUpdateProfile = async () => {
		try {
			setSaving(true);
			const token = localStorage.getItem("token");
			const res = await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me",
				{
					firstName: adminInfo.firstName,
					lastName: adminInfo.lastName,
					phone: adminInfo.phone,
					image: adminInfo.image,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			
			// Update token if returned
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

	const handleChangePassword = async () => {
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

	const tabs = [
		{ id: "store", label: "Store Settings", icon: FaStore },
		{ id: "profile", label: "Admin Profile", icon: FaUser },
		{ id: "security", label: "Security", icon: FaLock },
	];

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1400px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
							<FaCog className="text-white text-2xl animate-spin-slow" />
						</div>
						<div>
							<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
								Settings
							</h1>
							<p className="text-secondary/60 font-medium">
								Manage your store and account settings
							</p>
						</div>
					</div>
				</div>

				{/* Tabs */}
				<div className="bg-white rounded-3xl shadow-xl border-2 border-accent/20 mb-8 overflow-hidden">
					<div className="flex border-b-2 border-secondary/10">
						{tabs.map((tab) => {
							const Icon = tab.icon;
							return (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 font-semibold transition-all ${
										activeTab === tab.id
											? "bg-accent text-white"
											: "text-secondary/70 hover:bg-secondary/5"
									}`}
								>
									<Icon className="text-lg" />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>

				{/* Store Settings Tab */}
				{activeTab === "store" && (
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="text-2xl font-bold text-secondary mb-6">Store Information</h2>
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										<FaStore className="inline mr-2" />
										Store Name
									</label>
									<input
										type="text"
										value={storeSettings.storeName}
										onChange={(e) =>
											setStoreSettings({ ...storeSettings, storeName: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										<FaEnvelope className="inline mr-2" />
										Store Email
									</label>
									<input
										type="email"
										value={storeSettings.storeEmail}
										onChange={(e) =>
											setStoreSettings({ ...storeSettings, storeEmail: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										<FaPhone className="inline mr-2" />
										Store Phone
									</label>
									<input
										type="tel"
										value={storeSettings.storePhone}
										onChange={(e) =>
											setStoreSettings({ ...storeSettings, storePhone: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Currency
									</label>
									<select
										value={storeSettings.currency}
										onChange={(e) =>
											setStoreSettings({ ...storeSettings, currency: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									>
										<option value="LKR">LKR - Sri Lankan Rupee</option>
										<option value="USD">USD - US Dollar</option>
										<option value="EUR">EUR - Euro</option>
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									<FaMapMarkerAlt className="inline mr-2" />
									Store Address
								</label>
								<textarea
									value={storeSettings.storeAddress}
									onChange={(e) =>
										setStoreSettings({ ...storeSettings, storeAddress: e.target.value })
									}
									rows={3}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
								></textarea>
							</div>

							<button
								onClick={handleSaveStoreSettings}
								disabled={saving}
								className="w-full px-6 py-4 bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
							>
								<FaSave />
								{saving ? "Saving..." : "Save Store Settings"}
							</button>
						</div>
					</div>
				)}

				{/* Admin Profile Tab */}
				{activeTab === "profile" && (
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="text-2xl font-bold text-secondary mb-6">Admin Profile</h2>
						<div className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										First Name
									</label>
									<input
										type="text"
										value={adminInfo.firstName}
										onChange={(e) =>
											setAdminInfo({ ...adminInfo, firstName: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Last Name
									</label>
									<input
										type="text"
										value={adminInfo.lastName}
										onChange={(e) =>
											setAdminInfo({ ...adminInfo, lastName: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Email (Read-only)
									</label>
									<input
										type="email"
										value={adminInfo.email}
										disabled
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 bg-secondary/5 text-secondary/60 outline-none"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Phone
									</label>
									<input
										type="tel"
										value={adminInfo.phone}
										onChange={(e) =>
											setAdminInfo({ ...adminInfo, phone: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>
							</div>

							<button
								onClick={handleUpdateProfile}
								disabled={saving}
								className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
							>
								<FaSave />
								{saving ? "Updating..." : "Update Profile"}
							</button>
						</div>
					</div>
				)}

				{/* Security Tab */}
				{activeTab === "security" && (
					<div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-accent/20">
						<h2 className="text-2xl font-bold text-secondary mb-6">Change Password</h2>
						<div className="space-y-6 max-w-2xl">
							<div>
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									Current Password
								</label>
								<input
									type="password"
									value={passwordForm.currentPassword}
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
									}
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
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, newPassword: e.target.value })
									}
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
									onChange={(e) =>
										setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
									}
									className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
								/>
							</div>

							<button
								onClick={handleChangePassword}
								disabled={saving}
								className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
							>
								<FaLock />
								{saving ? "Changing..." : "Change Password"}
							</button>
						</div>
					</div>
				)}
			</div>

			<style jsx>{`
				@keyframes spin-slow {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(360deg);
					}
				}
				.animate-spin-slow {
					animation: spin-slow 3s linear infinite;
				}
			`}</style>
		</div>
	);
}
