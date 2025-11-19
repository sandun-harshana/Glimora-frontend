import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit, FaUser } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import { MdOutlineAdminPanelSettings, MdVerified } from "react-icons/md";
import { BiMessageDetail } from "react-icons/bi";

function UserBlockConfirm(props) {
	const email = props.user.email;
	const close = props.close;
	const refresh = props.refresh;
	function blockUser() {
		const token = localStorage.getItem("token");
		axios
			.put(import.meta.env.VITE_API_URL + "/api/users/block/" + email,{
                isBlock: !props.user.isBlock
            },{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}).then((response) => {
				console.log(response.data);
				close();
				toast.success("User block status changed successfully");
				refresh();
			}).catch(() => {
				toast.error("Failed to change user block status");
			})
	}

	return (
		<div className="fixed left-0 top-0 w-full h-screen bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative p-8 border border-accent/20">
				<button 
					onClick={close} 
					className="absolute right-4 top-4 w-10 h-10 bg-accent/10 rounded-full text-accent flex justify-center items-center font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				
				<div className="flex flex-col items-center gap-6">
					<div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					
					<div className="text-center">
						<h3 className="text-2xl font-bold text-secondary mb-2">
							{props.user.isBlock ? "Unblock" : "Block"} User?
						</h3>
						<p className="text-secondary/70">
							Are you sure you want to {props.user.isBlock ? "unblock" : "block"} the user: 
							<span className="font-semibold text-accent block mt-2">{email}</span>
						</p>
					</div>
					
					<div className="flex gap-4 w-full mt-2">
						<button 
							onClick={close} 
							className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-secondary/20"
						>
							Cancel
						</button>
						<button 
							onClick={blockUser} 
							className="flex-1 bg-accent hover:bg-accent/90 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							{props.user.isBlock ? "Unblock" : "Block"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function MessageUserModal({ user, close, refresh }) {
	const [formData, setFormData] = useState({
		category: "general",
		subject: "",
		message: ""
	});
	const [isSending, setIsSending] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!formData.subject.trim() || !formData.message.trim()) {
			toast.error("Subject and message are required");
			return;
		}

		setIsSending(true);
		const token = localStorage.getItem("token");

		try {
			await axios.post(
				import.meta.env.VITE_API_URL + "/api/messages/admin/send",
				{
					recipientEmail: user.email,
					recipientName: `${user.firstName} ${user.lastName}`,
					category: formData.category,
					subject: formData.subject,
					message: formData.message
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			
			toast.success("Message sent successfully");
			close();
			if (refresh) refresh();
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error(error.response?.data?.message || "Failed to send message");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<div className="fixed left-0 top-0 w-full h-screen bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
			<div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl relative p-8 border border-accent/20 max-h-[90vh] overflow-y-auto">
				<button 
					onClick={close} 
					className="absolute right-4 top-4 w-10 h-10 bg-accent/10 rounded-full text-accent flex justify-center items-center font-bold hover:bg-accent hover:text-white transition-all duration-300 shadow-md hover:shadow-lg z-10"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
							<BiMessageDetail className="text-white text-2xl" />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-secondary">Send Message</h3>
							<p className="text-secondary/70">
								To: <span className="font-semibold text-accent">{user.firstName} {user.lastName}</span>
								<span className="text-sm ml-2">({user.email})</span>
							</p>
						</div>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						{/* Category */}
						<div>
							<label className="block text-sm font-semibold text-secondary mb-2">
								Category
							</label>
							<select
								value={formData.category}
								onChange={(e) => setFormData({ ...formData, category: e.target.value })}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
							>
								<option value="general">General</option>
								<option value="support">Support</option>
								<option value="order">Order</option>
								<option value="account">Account</option>
								<option value="other">Other</option>
							</select>
						</div>

						{/* Subject */}
						<div>
							<label className="block text-sm font-semibold text-secondary mb-2">
								Subject <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								value={formData.subject}
								onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
								placeholder="Enter message subject"
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
								required
							/>
						</div>

						{/* Message */}
						<div>
							<label className="block text-sm font-semibold text-secondary mb-2">
								Message <span className="text-red-500">*</span>
							</label>
							<textarea
								value={formData.message}
								onChange={(e) => setFormData({ ...formData, message: e.target.value })}
								placeholder="Enter your message"
								rows={6}
								className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
								required
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-4 mt-2">
							<button 
								type="button"
								onClick={close} 
								className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-secondary/20"
								disabled={isSending}
							>
								Cancel
							</button>
							<button 
								type="submit"
								className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
								disabled={isSending}
							>
								{isSending ? "Sending..." : "Send Message"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [isBlockConfirmVisible, setIsBlockConfirmVisible] = useState(false);
	const [userToBlock, setUserToBlock] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);
	const [userToMessage, setUserToMessage] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		if (isLoading) {
			const token = localStorage.getItem("token");
			if (token == null) {
				toast.error("Please login to access admin panel");
				navigate("/login");
				return;
			}
			axios
				.get(import.meta.env.VITE_API_URL + "/api/users/all-users", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					console.log(response.data);
					setUsers(response.data);
					setIsLoading(false);
				});
		}
	}, [isLoading, navigate]);

	return (
		<div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
			{isBlockConfirmVisible && (
				<UserBlockConfirm
					refresh={() => {
						setIsLoading(true);
					}}
					user={userToBlock}
					close={() => {
						setIsBlockConfirmVisible(false);
					}}
				/>
			)}
			
			{isMessageModalVisible && userToMessage && (
				<MessageUserModal
					user={userToMessage}
					close={() => {
						setIsMessageModalVisible(false);
						setUserToMessage(null);
					}}
					refresh={() => {
						// Optional: refresh messages list if needed
					}}
				/>
			)}
			
			{/* Page container */}
			<div className="h-full overflow-y-auto">
				<div className="mx-auto max-w-7xl p-6 space-y-6">
					{/* Page Header */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
									<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								</div>
								<div>
									<h1 className="text-2xl font-bold text-gray-900">User Management</h1>
									<p className="text-sm text-gray-600">Manage user accounts and permissions</p>
								</div>
							</div>
							<div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
								<span className="text-sm font-semibold text-gray-700">Total Users:</span>
								<span className="text-lg font-bold text-purple-600">{users.length}</span>
							</div>
						</div>
					</div>

					{/* Table Card */}
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
						{/* Table wrapper for responsive scrolling */}
						<div className="overflow-x-auto">
							{isLoading ? (
								<div className="p-12">
									<Loader />
								</div>
							) : (
								<table className="w-full min-w-[900px] text-left">
									<thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
										<tr>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
												Profile
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
												Email
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
												First Name
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
												Last Name
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">
												Role
											</th>
											<th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
												Actions
											</th>
										</tr>
									</thead>

									<tbody className="divide-y divide-gray-100">
									{users.map((user) => {
										return (
											<tr
												key={user.email}
												className="group hover:bg-gray-50 transition-colors duration-150"
											>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														{user.image && user.image !== "/user.png" ? (
															<img
																src={user.image}
																referrerPolicy="no-referrer"
																alt={user.firstName}
																className={`w-10 h-10 rounded-full object-cover border-2 ${
																	user.isBlock ? "border-red-400" : "border-purple-400"
																}`}
																onError={(e) => {
																	e.target.onerror = null;
																	e.target.style.display = 'none';
																	e.target.nextSibling.style.display = 'flex';
																}}
															/>
														) : null}
														<div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
															user.isBlock ? "border-red-400 bg-red-50" : "border-purple-400 bg-purple-50"
														} ${user.image && user.image !== "/user.png" ? "hidden" : ""}`}>
															<FaUser className={`text-sm ${user.isBlock ? "text-red-600" : "text-purple-600"}`} />
														</div>
														{user.isBlock && (
															<span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-200">
																Blocked
															</span>
														)}
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2">
														<span className="text-sm text-gray-700 font-medium">
															{user.email}
														</span>
														{user.isEmailVerified && (
															<MdVerified className="text-blue-500" size={16} />
														)}
													</div>
												</td>
												<td className="px-6 py-4 text-sm font-medium text-gray-900">
													{user.firstName}
												</td>
												<td className="px-6 py-4 text-sm text-gray-700">
													{user.lastName}
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2">
														{user.role === "admin" && (
															<MdOutlineAdminPanelSettings className="text-purple-600" size={18} />
														)}
														<span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
															user.role === "admin" 
																? "bg-purple-100 text-purple-700 border border-purple-200" 
																: "bg-blue-100 text-blue-700 border border-blue-200"
														}`}>
															{user.role.toUpperCase()}
														</span>
													</div>
												</td>

												<td className="px-6 py-4">
													<div className="flex items-center justify-center gap-2">
														<button
															onClick={() => {
																setUserToMessage(user);
																setIsMessageModalVisible(true);
															}}
															className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm flex items-center gap-2"
															title="Send message to user"
														>
															<BiMessageDetail size={16} />
															Message
														</button>
														<button
															onClick={()=>{
																setUserToBlock(user)
																setIsBlockConfirmVisible(true)
															}}
															className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
																user.isBlock
																	? "bg-green-500 hover:bg-green-600 text-white shadow-sm"
																	: "bg-red-500 hover:bg-red-600 text-white shadow-sm"
															}`}
														>
															{user.isBlock ? "Unblock" : "Block"}
														</button>
													</div>
												</td>
											</tr>
										);
									})}
									{users.length === 0 && (
										<tr>
											<td
												className="px-6 py-16 text-center text-gray-500"
												colSpan={6}
											>
												<div className="flex flex-col items-center gap-3">
													<svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
													</svg>
													<p className="text-base font-semibold text-gray-700">No users found</p>
													<p className="text-sm text-gray-500">Users will appear here once they register</p>
												</div>
											</td>
										</tr>
									)}
								</tbody>
							</table>
						)}
					</div>
				</div>
				</div>
			</div>
		</div>
	);
}