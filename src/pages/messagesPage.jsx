import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaComments, FaShoppingCart, FaChartLine, FaTags, FaPaperPlane, FaTimes, FaReply } from "react-icons/fa";
import { MdPending, MdCheckCircle, MdClose } from "react-icons/md";

export default function MessagesPage() {
	const [messages, setMessages] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [showNewMessageModal, setShowNewMessageModal] = useState(false);
	const [showMessageDetailModal, setShowMessageDetailModal] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [loading, setLoading] = useState(true);

	// New message form
	const [newMessage, setNewMessage] = useState({
		category: "chat",
		subject: "",
		message: "",
	});

	// Reply form
	const [replyText, setReplyText] = useState("");

	const categories = [
		{ id: "all", name: "All Messages", icon: FaComments, color: "purple" },
		{ id: "chat", name: "Chat", icon: FaComments, color: "blue" },
		{ id: "orders", name: "Orders", icon: FaShoppingCart, color: "green" },
		{ id: "activity", name: "Activity", icon: FaChartLine, color: "orange" },
		{ id: "promo", name: "Promo", icon: FaTags, color: "pink" },
	];

	useEffect(() => {
		fetchMessages();
	}, []);

	const fetchMessages = async () => {
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(
				import.meta.env.VITE_API_URL + "/api/messages/my-messages",
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			setMessages(res.data);
			setLoading(false);
		} catch (err) {
			console.error("Error fetching messages:", err);
			toast.error("Failed to load messages");
			setLoading(false);
		}
	};

	const handleCreateMessage = async (e) => {
		e.preventDefault();
		
		if (!newMessage.subject || !newMessage.message) {
			toast.error("Please fill all fields");
			return;
		}

		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + "/api/messages",
				newMessage,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Message sent successfully");
			setShowNewMessageModal(false);
			setNewMessage({ category: "chat", subject: "", message: "" });
			fetchMessages();
		} catch (err) {
			console.error("Error sending message:", err);
			toast.error("Failed to send message");
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

	const filteredMessages =
		selectedCategory === "all"
			? messages
			: messages.filter((msg) => msg.category === selectedCategory);

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
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
			</div>
		);
	}

	return (
		<div className="w-full min-h-screen bg-gradient-to-br from-primary/30 via-white to-primary/20 p-8">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-accent/20">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
								<FaComments className="text-white text-2xl" />
							</div>
							<div>
								<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-purple-600 bg-clip-text text-transparent">
									My Messages
								</h1>
								<p className="text-secondary/60 font-medium">
									View and manage your conversations
								</p>
							</div>
						</div>
						<button
							onClick={() => setShowNewMessageModal(true)}
							className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105"
						>
							<FaPaperPlane />
							New Message
						</button>
					</div>
				</div>

				{/* Category Filters */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
					{categories.map((cat) => {
						const Icon = cat.icon;
						const isActive = selectedCategory === cat.id;
						return (
							<button
								key={cat.id}
								onClick={() => setSelectedCategory(cat.id)}
								className={`group p-6 rounded-2xl border-2 transition-all ${
									isActive
										? `bg-${cat.color}-100 border-${cat.color}-400 shadow-lg scale-105`
										: "bg-white border-secondary/10 hover:border-secondary/30 hover:shadow-md"
								}`}
							>
								<div className="flex flex-col items-center gap-2">
									<Icon
										className={`text-3xl ${
											isActive ? `text-${cat.color}-600` : "text-secondary/60"
										}`}
									/>
									<span
										className={`font-semibold text-sm ${
											isActive ? `text-${cat.color}-700` : "text-secondary/70"
										}`}
									>
										{cat.name}
									</span>
									<span
										className={`text-xs px-3 py-1 rounded-full ${
											isActive
												? `bg-${cat.color}-200 text-${cat.color}-800`
												: "bg-secondary/10 text-secondary/60"
										}`}
									>
										{cat.id === "all"
											? messages.length
											: messages.filter((m) => m.category === cat.id).length}
									</span>
								</div>
							</button>
						);
					})}
				</div>

				{/* Messages List */}
				<div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-accent/20">
					{filteredMessages.length === 0 ? (
						<div className="text-center py-16">
							<div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
								<FaComments className="text-5xl text-accent" />
							</div>
							<p className="text-secondary/80 font-bold text-lg mb-2">
								No messages yet
							</p>
							<p className="text-secondary/50 text-sm">
								Start a conversation by creating a new message
							</p>
						</div>
					) : (
						<div className="space-y-4">
							{filteredMessages.map((msg) => (
								<div
									key={msg._id}
									onClick={() => {
										setSelectedMessage(msg);
										setShowMessageDetailModal(true);
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

			{/* New Message Modal */}
			{showNewMessageModal && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
						<div className="p-8">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-3xl font-bold text-secondary">New Message</h2>
								<button
									onClick={() => setShowNewMessageModal(false)}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							<form onSubmit={handleCreateMessage} className="space-y-6">
								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Category
									</label>
									<select
										value={newMessage.category}
										onChange={(e) =>
											setNewMessage({ ...newMessage, category: e.target.value })
										}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									>
										<option value="chat">Chat</option>
										<option value="orders">Orders</option>
										<option value="activity">Activity</option>
										<option value="promo">Promo</option>
									</select>
								</div>

								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Subject
									</label>
									<input
										type="text"
										value={newMessage.subject}
										onChange={(e) =>
											setNewMessage({ ...newMessage, subject: e.target.value })
										}
										placeholder="Enter message subject"
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
									/>
								</div>

								<div>
									<label className="block text-sm font-bold text-secondary/80 mb-2">
										Message
									</label>
									<textarea
										value={newMessage.message}
										onChange={(e) =>
											setNewMessage({ ...newMessage, message: e.target.value })
										}
										placeholder="Enter your message"
										rows={6}
										className="w-full px-4 py-3 rounded-xl border-2 border-secondary/10 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
									></textarea>
								</div>

								<div className="flex gap-4">
									<button
										type="submit"
										className="flex-1 px-6 py-3 bg-accent hover:bg-accent/90 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
									>
										Send Message
									</button>
									<button
										type="button"
										onClick={() => setShowNewMessageModal(false)}
										className="px-6 py-3 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-xl font-semibold transition-all"
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/* Message Detail Modal */}
			{showMessageDetailModal && selectedMessage && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
								<button
									onClick={() => setShowMessageDetailModal(false)}
									className="w-10 h-10 rounded-full bg-secondary/10 hover:bg-secondary/20 flex items-center justify-center transition-colors"
								>
									<FaTimes />
								</button>
							</div>

							<h2 className="text-3xl font-bold text-secondary mb-4">
								{selectedMessage.subject}
							</h2>

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
											{new Date(selectedMessage.createdAt).toLocaleString()}
										</p>
									</div>
								</div>
								<p className="text-secondary/80">{selectedMessage.message}</p>
							</div>

							{/* Replies */}
							{selectedMessage.replies.length > 0 && (
								<div className="space-y-4 mb-6">
									<h3 className="font-bold text-secondary text-lg">Replies</h3>
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
											Your Reply
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
		</div>
	);
}
