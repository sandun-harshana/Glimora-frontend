import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
	FaComments,
	FaShoppingCart,
	FaChartLine,
	FaTags,
	FaReply,
	FaTimes,
	FaTrash,
	FaEnvelope,
	FaPaperPlane,
} from "react-icons/fa";
import { MdPending, MdCheckCircle, MdClose } from "react-icons/md";
import { Loader } from "../../components/loader";

export default function AdminMessagesPage() {
	const [messages, setMessages] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [showDetailModal, setShowDetailModal] = useState(false);

	// When opening a message detail, mark it as read for admin
	useEffect(() => {
		if (showDetailModal && selectedMessage) {
			(async () => {
				try {
					const token = localStorage.getItem("token");
					if (!token) return;
					await axios.post(import.meta.env.VITE_API_URL + `/api/messages/${selectedMessage._id}/mark-read`, {}, { headers: { Authorization: `Bearer ${token}` } });
					// refresh messages list and selected message
					fetchMessages();
					const res = await axios.get(import.meta.env.VITE_API_URL + `/api/messages/${selectedMessage._id}`, { headers: { Authorization: `Bearer ${token}` } });
					setSelectedMessage(res.data);
				} catch (err) {
					console.error("Error marking message as read:", err);
				}
			})();
		}
	}, [showDetailModal, selectedMessage]);
	const [showSendMessageModal, setShowSendMessageModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [replyText, setReplyText] = useState("");

	// Send message form state
	const [sendMessageForm, setSendMessageForm] = useState({
		recipientEmail: "",
		recipientName: "",
		category: "chat",
		subject: "",
		message: "",
	});

	const categories = [
		{ id: "all", name: "All Categories", icon: FaComments, color: "purple" },
		{ id: "chat", name: "Chat", icon: FaComments, color: "blue" },
		{ id: "orders", name: "Orders", icon: FaShoppingCart, color: "green" },
		{ id: "activity", name: "Activity", icon: FaChartLine, color: "orange" },
		{ id: "promo", name: "Promo", icon: FaTags, color: "pink" },
	];

	const statusFilters = [
		{ id: "all", name: "All Status", color: "gray" },
		{ id: "pending", name: "Pending", color: "orange" },
		{ id: "replied", name: "Replied", color: "blue" },
		{ id: "closed", name: "Closed", color: "gray" },
	];

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(res.data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching messages:", err);
			toast.error("Failed to load messages");
			setLoading(false);
		}
	};

	const handleReply = async (e) => {
		e.preventDefault();

		if (!replyText) {
			toast.error("Please enter a reply");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + `/api/messages/${selectedMessage._id}/reply`,
				{ message: replyText },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Reply sent successfully");
			setReplyText("");
			fetchMessages();
			// Refresh the selected message
			const res = await axios.get(
				import.meta.env.VITE_API_URL + `/api/messages/${selectedMessage._id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setSelectedMessage(res.data);
		} catch (err) {
			console.error("Error sending reply:", err);
			toast.error("Failed to send reply");
		}
	};

	const handleStatusChange = async (messageId, newStatus) => {
		try {
			const token = localStorage.getItem("token");
			await axios.put(
				import.meta.env.VITE_API_URL + `/api/messages/${messageId}/status`,
				{ status: newStatus },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Status updated successfully");
			fetchMessages();
			if (selectedMessage && selectedMessage._id === messageId) {
				setSelectedMessage({ ...selectedMessage, status: newStatus });
			}
		} catch (err) {
			console.error("Error updating status:", err);
			toast.error("Failed to update status");
		}
	};

	const handleDeleteMessage = async (messageId) => {
		if (!confirm("Are you sure you want to delete this message?")) {
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.delete(
				import.meta.env.VITE_API_URL + `/api/messages/${messageId}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Message deleted successfully");
			setShowDetailModal(false);
			fetchMessages();
		} catch (err) {
			console.error("Error deleting message:", err);
			toast.error("Failed to delete message");
		}
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();

		if (!sendMessageForm.recipientEmail || !sendMessageForm.recipientName || 
			!sendMessageForm.subject || !sendMessageForm.message) {
			toast.error("All fields are required");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + "/api/messages/admin/send",
				sendMessageForm,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Message sent to user successfully!");
			setShowSendMessageModal(false);
			setSendMessageForm({
				recipientEmail: "",
				recipientName: "",
				category: "chat",
				subject: "",
				message: "",
			});
			fetchMessages();
		} catch (err) {
			console.error("Error sending message:", err);
			toast.error(err.response?.data?.message || "Failed to send message");
		}
	};

	const filteredMessages = messages.filter((msg) => {
		const categoryMatch =
			selectedCategory === "all" || msg.category === selectedCategory;
		const statusMatch = selectedStatus === "all" || msg.status === selectedStatus;
		return categoryMatch && statusMatch;
	});

	const getCategoryColor = (category) => {
		const cat = categories.find((c) => c.id === category);
		return cat ? cat.color : "gray";
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: "bg-orange-100 text-orange-700 border-orange-300",
			replied: "bg-blue-100 text-blue-700 border-blue-300",
			closed: "bg-gray-100 text-gray-700 border-gray-300",
		};
		const icons = {
			pending: <MdPending />,
			replied: <MdCheckCircle />,
			closed: <MdClose />,
		};
		return (
			<span
				className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border-2 ${styles[status]}`}
			>
				{icons[status]}
				{status.toUpperCase()}
			</span>
		);
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-[1800px] mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
								<FaComments className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
									Message Center
								</h1>
								<p className="text-secondary/60 font-medium">
									Manage customer messages and support tickets
								</p>
					</div>
				</div>
				<div className="text-right flex gap-3 items-center">
					<button
						onClick={() => setShowSendMessageModal(true)}
						className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
					>
						<FaEnvelope className="text-lg" />
						Send Message to User
					</button>
					<div className="inline-flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl border border-accent/20">
						<span className="text-sm font-semibold text-secondary">
							Total Messages: {messages.length}
						</span>
					</div>
				</div>
			</div>
		</div>				<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
					{/* Sidebar Filters */}
					<div className="lg:col-span-1 space-y-6">
						{/* Category Filters */}
						<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
							<h2 className="font-bold text-lg text-secondary mb-4">Categories</h2>
							<div className="space-y-2">
								{categories.map((cat) => {
									const Icon = cat.icon;
									const isActive = selectedCategory === cat.id;
									const count =
										cat.id === "all"
											? messages.length
											: messages.filter((m) => m.category === cat.id).length;
									return (
										<button
											key={cat.id}
											onClick={() => setSelectedCategory(cat.id)}
											className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
												isActive
													? `bg-${cat.color}-100 border-${cat.color}-400 shadow-md`
													: "bg-white border-secondary/10 hover:border-secondary/30"
											}`}
										>
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3">
													<Icon
														className={`text-xl ${
															isActive
																? `text-${cat.color}-600`
																: "text-secondary/60"
														}`}
													/>
													<span
														className={`font-semibold text-sm ${
															isActive
																? `text-${cat.color}-700`
																: "text-secondary/70"
														}`}
													>
														{cat.name}
													</span>
												</div>
												<span
													className={`px-2 py-1 rounded-full text-xs font-bold ${
														isActive
															? `bg-${cat.color}-200 text-${cat.color}-800`
															: "bg-secondary/10 text-secondary/60"
													}`}
												>
													{count}
												</span>
											</div>
										</button>
									);
								})}
							</div>
						</div>

						{/* Status Filters */}
						<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
							<h2 className="font-bold text-lg text-secondary mb-4">Status</h2>
							<div className="space-y-2">
								{statusFilters.map((status) => {
									const isActive = selectedStatus === status.id;
									const count =
										status.id === "all"
											? messages.length
											: messages.filter((m) => m.status === status.id).length;
									return (
										<button
											key={status.id}
											onClick={() => setSelectedStatus(status.id)}
											className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
												isActive
													? `bg-${status.color}-100 border-${status.color}-400 shadow-md`
													: "bg-white border-secondary/10 hover:border-secondary/30"
											}`}
										>
											<div className="flex items-center justify-between">
												<span
													className={`font-semibold text-sm ${
														isActive
															? `text-${status.color}-700`
															: "text-secondary/70"
													}`}
												>
													{status.name}
												</span>
												<span
													className={`px-2 py-1 rounded-full text-xs font-bold ${
														isActive
															? `bg-${status.color}-200 text-${status.color}-800`
															: "bg-secondary/10 text-secondary/60"
													}`}
												>
													{count}
												</span>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* Messages List */}
					<div className="lg:col-span-3">
						<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
							{filteredMessages.length === 0 ? (
								<div className="text-center py-16">
									<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
										<FaComments className="text-5xl text-accent" />
									</div>
									<p className="text-secondary/80 font-bold text-lg mb-2">
										No messages found
									</p>
									<p className="text-secondary/50 text-sm">
										Try adjusting your filters
									</p>
								</div>
							) : (
								<div className="space-y-4">
									{filteredMessages.map((msg) => (
										<div
											key={msg._id}
											onClick={() => {
												setSelectedMessage(msg);
												setShowDetailModal(true);
											}}
											className="group p-6 rounded-2xl border-2 border-secondary/10 hover:border-accent/30 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-r from-white to-primary/5"
										>
											<div className="flex items-start justify-between">
												<div className="flex-1">
													<div className="flex items-center gap-3 mb-2">
														<span
															className={`px-3 py-1 rounded-lg text-xs font-bold bg-${getCategoryColor(
																msg.category
															)}-100 text-${getCategoryColor(
																msg.category
															)}-700 border border-${getCategoryColor(
																msg.category
															)}-300`}
														>
															{msg.category.toUpperCase()}
														</span>
														{getStatusBadge(msg.status)}
													</div>
													<h3 className="text-lg font-bold text-secondary mb-1 group-hover:text-accent transition-colors">
														{msg.subject}
													</h3>
													<p className="text-sm text-secondary/60 mb-2">
														From: <span className="font-semibold">{msg.senderName}</span> ({msg.senderEmail})
													</p>
													<p className="text-sm text-secondary/60 line-clamp-2 mb-2">
														{msg.message}
													</p>
													<div className="flex items-center gap-4 text-xs text-secondary/50">
														<span>
															{new Date(msg.createdAt).toLocaleDateString("en-US", {
																month: "short",
																day: "numeric",
																year: "numeric",
																hour: "2-digit",
																minute: "2-digit",
															})}
														</span>
														{msg.replies.length > 0 && (
															<span className="flex items-center gap-1">
																<FaReply />
																{msg.replies.length} replies
															</span>
														)}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Message Detail Modal */}
			{showDetailModal && selectedMessage && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<span
										className={`px-3 py-1 rounded-lg text-xs font-bold bg-${getCategoryColor(
											selectedMessage.category
										)}-100 text-${getCategoryColor(
											selectedMessage.category
										)}-700 border border-${getCategoryColor(
											selectedMessage.category
										)}-300`}
									>
										{selectedMessage.category.toUpperCase()}
									</span>
									{getStatusBadge(selectedMessage.status)}
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={() => handleDeleteMessage(selectedMessage._id)}
										className="w-10 h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
										title="Delete message"
									>
										<FaTrash />
									</button>
									<button
										onClick={() => setShowDetailModal(false)}
										className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
									>
										<FaTimes />
									</button>
								</div>
							</div>

							<h2 className="text-3xl font-bold text-secondary mb-4">
								{selectedMessage.subject}
							</h2>

							{/* Status Update */}
							<div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl p-4 mb-6 border-2 border-accent/20">
								<label className="block text-sm font-bold text-secondary/80 mb-2">
									Update Status
								</label>
								<select
									value={selectedMessage.status}
									onChange={(e) =>
										handleStatusChange(selectedMessage._id, e.target.value)
									}
									className="w-full px-4 py-2 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
								>
									<option value="pending">Pending</option>
									<option value="replied">Replied</option>
									<option value="closed">Closed</option>
								</select>
							</div>

							{/* Original Message */}
							<div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-6 border-2 border-primary/20">
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">
										{selectedMessage.senderName.charAt(0)}
									</div>
									<div>
										<p className="font-bold text-secondary">
											{selectedMessage.senderName}
										</p>
										<p className="text-xs text-secondary/60">
											{selectedMessage.senderEmail}
										</p>
										<p className="text-xs text-secondary/60">
											{new Date(selectedMessage.createdAt).toLocaleString()}
										</p>
									</div>
								</div>
								<p className="text-secondary/80">{selectedMessage.message}</p>
							</div>

							{/* Replies */}
							{selectedMessage.replies.length > 0 && (
								<div className="space-y-4 mb-6">
									<h3 className="font-bold text-secondary text-lg">Conversation</h3>
									{selectedMessage.replies.map((reply, index) => (
										<div
											key={index}
											className={`rounded-2xl p-6 border-2 ${
												reply.senderRole === "admin"
													? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
													: "bg-gray-50 border-gray-200"
											}`}
										>
											<div className="flex items-center gap-3 mb-3">
												<div
													className={`w-10 h-10 ${
														reply.senderRole === "admin"
															? "bg-blue-500"
															: "bg-accent"
													} rounded-full flex items-center justify-center text-white font-bold`}
												>
													{reply.senderName.charAt(0)}
												</div>
												<div>
													<p className="font-bold text-secondary">
														{reply.senderName}
														{reply.senderRole === "admin" && (
															<span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
																Admin
															</span>
														)}
													</p>
													<p className="text-xs text-secondary/60">
														{new Date(reply.createdAt).toLocaleString()}
													</p>
												</div>
											</div>
											<p className="text-secondary/80">{reply.message}</p>
										</div>
									))}
								</div>
							)}

							{/* Reply Form */}
							{selectedMessage.status !== "closed" && (
								<form onSubmit={handleReply} className="space-y-4">
									<div>
										<label className="block text-sm font-bold text-secondary/80 mb-2">
											Admin Reply
										</label>
										<textarea
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											placeholder="Type your reply here..."
											rows={4}
											className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
										></textarea>
									</div>
									<button
										type="submit"
										className="w-full px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
									>
										<FaReply />
										Send Reply
									</button>
								</form>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Send Message Modal */}
			{showSendMessageModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<div className="flex items-center gap-3">
									<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
										<FaEnvelope className="text-white text-xl" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-secondary">
											Send Message to User
										</h2>
										<p className="text-sm text-secondary/60">
											Compose and send a message directly to a customer
										</p>
									</div>
								</div>
								<button
									onClick={() => setShowSendMessageModal(false)}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							<form onSubmit={handleSendMessage} className="space-y-5">
								{/* Recipient Info */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-bold text-secondary/80 mb-2">
											Recipient Email *
										</label>
										<input
											type="email"
											value={sendMessageForm.recipientEmail}
											onChange={(e) =>
												setSendMessageForm({
													...sendMessageForm,
													recipientEmail: e.target.value,
												})
											}
											placeholder="customer@example.com"
											required
											className="w-full px-4 py-2.5 rounded-xl border-2 border-secondary/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
										/>
									</div>
									<div>
										<label className="block text-sm font-bold text-secondary/80 mb-2">
											Recipient Name *
										</label>
										<input
											type="text"
											value={sendMessageForm.recipientName}
											onChange={(e) =>
												setSendMessageForm({
													...sendMessageForm,
													recipientName: e.target.value,
												})
											}
											placeholder="John Doe"
											required
											className="w-full px-4 py-2.5 rounded-xl border-2 border-secondary/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
										/>
									</div>
								</div>

								{/* Category */}
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Category *
									</label>
									<select
										value={sendMessageForm.category}
										onChange={(e) =>
											setSendMessageForm({
												...sendMessageForm,
												category: e.target.value,
											})
										}
										className="w-full px-4 py-2.5 rounded-xl border-2 border-secondary/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
									>
										<option value="chat">Chat</option>
										<option value="orders">Orders</option>
										<option value="activity">Activity</option>
										<option value="promo">Promo</option>
									</select>
								</div>

								{/* Subject */}
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Subject *
									</label>
									<input
										type="text"
										value={sendMessageForm.subject}
										onChange={(e) =>
											setSendMessageForm({
												...sendMessageForm,
												subject: e.target.value,
											})
										}
										placeholder="Message subject"
										required
										className="w-full px-4 py-2.5 rounded-xl border-2 border-secondary/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
									/>
								</div>

								{/* Message */}
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Message *
									</label>
									<textarea
										value={sendMessageForm.message}
										onChange={(e) =>
											setSendMessageForm({
												...sendMessageForm,
												message: e.target.value,
											})
										}
										placeholder="Type your message here..."
										rows={6}
										required
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
									></textarea>
								</div>

								{/* Action Buttons */}
								<div className="flex gap-3">
									<button
										type="button"
										onClick={() => setShowSendMessageModal(false)}
										className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
									>
										<FaPaperPlane />
										Send Message
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
