import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
	FaComments,
	FaPaperPlane,
	FaTimes,
	FaInbox,
	FaUserCircle,
	FaEnvelope,
	FaReply,
} from "react-icons/fa";
import { MdPending, MdCheckCircle, MdClose } from "react-icons/md";

export default function QuickReply() {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [selectedMessage, setSelectedMessage] = useState(null);
	const [replyText, setReplyText] = useState("");
	const [loading, setLoading] = useState(false);
	const [unreadCount, setUnreadCount] = useState(0);
	const [view, setView] = useState("list"); // 'list' or 'detail'

	useEffect(() => {
		if (isOpen) {
			fetchMessages();
		}
	}, [isOpen]);

	const fetchMessages = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("token");
			const res = await axios.get(import.meta.env.VITE_API_URL + "/api/messages", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessages(res.data);
			
			// Count unread/pending messages
			const pendingCount = res.data.filter(
				(msg) => msg.status === "pending"
			).length;
			setUnreadCount(pendingCount);
			
			setLoading(false);
		} catch (err) {
			console.error("Error fetching messages:", err);
			toast.error("Failed to load messages");
			setLoading(false);
		}
	};

	const handleQuickReply = async (messageId, quickReplyText) => {
		try {
			const token = localStorage.getItem("token");
			await axios.post(
				import.meta.env.VITE_API_URL + `/api/messages/${messageId}/reply`,
				{ message: quickReplyText },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			toast.success("Quick reply sent!");
			fetchMessages();
			
			// If viewing detail, refresh the selected message
			if (selectedMessage && selectedMessage._id === messageId) {
				const res = await axios.get(
					import.meta.env.VITE_API_URL + `/api/messages/${messageId}`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setSelectedMessage(res.data);
			}
		} catch (err) {
			console.error("Error sending quick reply:", err);
			toast.error("Failed to send reply");
		}
	};

	const handleCustomReply = async (e) => {
		e.preventDefault();

		if (!replyText.trim()) {
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
			toast.success("Reply sent successfully!");
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
			toast.success(`Status updated to ${newStatus}`);
			fetchMessages();
			
			if (selectedMessage && selectedMessage._id === messageId) {
				setSelectedMessage({ ...selectedMessage, status: newStatus });
			}
		} catch (err) {
			console.error("Error updating status:", err);
			toast.error("Failed to update status");
		}
	};

	const viewMessageDetail = (message) => {
		setSelectedMessage(message);
		setView("detail");
	};

	const backToList = () => {
		setView("list");
		setSelectedMessage(null);
		setReplyText("");
	};

	const getStatusBadge = (status) => {
		const styles = {
			pending: "bg-orange-100 text-orange-700",
			replied: "bg-blue-100 text-blue-700",
			closed: "bg-gray-100 text-gray-700",
		};
		const icons = {
			pending: <MdPending />,
			replied: <MdCheckCircle />,
			closed: <MdClose />,
		};
		return (
			<span
				className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${styles[status]}`}
			>
				{icons[status]}
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		);
	};

	const quickReplyTemplates = [
		"Thank you for your message. We'll get back to you soon!",
		"We're looking into this issue and will update you shortly.",
		"Your order has been processed and will ship within 24 hours.",
		"Thanks for contacting us! How else can I help you?",
	];

	return (
		<>
			{/* Quick Reply Button - Fixed Position */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 flex items-center justify-center z-50 hover:scale-110 transition-all"
				title="Quick Reply Messages"
			>
				<FaComments className="text-2xl" />
				{unreadCount > 0 && (
					<span className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse shadow-lg">
						{unreadCount}
					</span>
				)}
			</button>

			{/* Quick Reply Panel */}
			{isOpen && (
				<div className="fixed bottom-24 right-6 w-[480px] h-[650px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-purple-200">
					{/* Header */}
					<div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<FaComments className="text-white text-2xl" />
							<div>
								<h3 className="text-white font-bold text-lg">Quick Reply</h3>
								<p className="text-white/80 text-xs">
									{view === "list" ? "Recent Messages" : "Message Details"}
								</p>
							</div>
						</div>
						<button
							onClick={() => setIsOpen(false)}
							className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
						>
							<FaTimes className="text-white" />
						</button>
					</div>

					{/* Content */}
					<div className="flex-1 overflow-y-auto">
						{loading ? (
							<div className="flex items-center justify-center h-full">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
							</div>
						) : view === "list" ? (
							/* Message List View */
							<div className="p-4 space-y-3">
								{messages.length === 0 ? (
									<div className="text-center py-12">
										<FaInbox className="text-5xl text-gray-300 mx-auto mb-4" />
										<p className="text-gray-500 font-semibold">No messages yet</p>
										<p className="text-gray-400 text-sm">
											Customer messages will appear here
										</p>
									</div>
								) : (
									messages.map((msg) => (
										<div
											key={msg._id}
											onClick={() => viewMessageDetail(msg)}
											className="p-4 rounded-2xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-white to-purple-50/30"
										>
											<div className="flex items-start justify-between mb-2">
												<div className="flex items-center gap-2">
													<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
														<FaUserCircle className="text-purple-600" />
													</div>
													<div>
														<p className="font-bold text-sm text-gray-800">
															{msg.senderName}
														</p>
														<p className="text-xs text-gray-500 flex items-center gap-1">
															<FaEnvelope className="text-[10px]" />
															{msg.senderEmail}
														</p>
													</div>
												</div>
												{getStatusBadge(msg.status)}
											</div>
											<p className="font-semibold text-gray-700 text-sm mb-1">
												{msg.subject}
											</p>
											<p className="text-xs text-gray-600 line-clamp-2 mb-2">
												{msg.message}
											</p>
											<div className="flex items-center justify-between text-xs text-gray-400">
												<span className="flex items-center gap-1">
													<span className="w-2 h-2 rounded-full bg-purple-400"></span>
													{msg.category}
												</span>
												<span>
													{new Date(msg.createdAt).toLocaleDateString("en-US", {
														month: "short",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>
									))
								)}
							</div>
						) : (
							/* Message Detail View */
							<div className="p-4 space-y-4">
								{/* Back Button */}
								<button
									onClick={backToList}
									className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm"
								>
									← Back to Messages
								</button>

								{/* Message Details */}
								<div className="bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-2xl p-4 border-2 border-purple-200">
									<div className="flex items-start justify-between mb-3">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
												{selectedMessage.senderName.charAt(0)}
											</div>
											<div>
												<p className="font-bold text-gray-800">
													{selectedMessage.senderName}
												</p>
												<p className="text-xs text-gray-600">
													{selectedMessage.senderEmail}
												</p>
											</div>
										</div>
										{getStatusBadge(selectedMessage.status)}
									</div>
									<h4 className="font-bold text-gray-800 mb-2">
										{selectedMessage.subject}
									</h4>
									<p className="text-sm text-gray-700 mb-2">
										{selectedMessage.message}
									</p>
									<div className="flex items-center gap-3 text-xs text-gray-500">
										<span className="px-2 py-1 bg-purple-200 text-purple-700 rounded-full font-semibold">
											{selectedMessage.category}
										</span>
										<span>
											{new Date(selectedMessage.createdAt).toLocaleString()}
										</span>
									</div>
								</div>

								{/* Status Update */}
								<div className="bg-gray-50 rounded-2xl p-3 border border-gray-200">
									<label className="block text-xs font-bold text-gray-700 mb-2">
										Update Status
									</label>
									<select
										value={selectedMessage.status}
										onChange={(e) =>
											handleStatusChange(selectedMessage._id, e.target.value)
										}
										className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all"
									>
										<option value="pending">Pending</option>
										<option value="replied">Replied</option>
										<option value="closed">Closed</option>
									</select>
								</div>

								{/* Conversation History */}
								{selectedMessage.replies.length > 0 && (
									<div className="space-y-2">
										<h4 className="font-bold text-sm text-gray-700 flex items-center gap-2">
											<FaReply className="text-purple-500" />
											Conversation ({selectedMessage.replies.length})
										</h4>
										<div className="space-y-2 max-h-48 overflow-y-auto">
											{selectedMessage.replies.map((reply, index) => (
												<div
													key={index}
													className={`p-3 rounded-xl border ${
														reply.senderRole === "admin"
															? "bg-blue-50 border-blue-200"
															: "bg-gray-50 border-gray-200"
													}`}
												>
													<div className="flex items-center gap-2 mb-1">
														<p className="font-bold text-xs text-gray-700">
															{reply.senderName}
															{reply.senderRole === "admin" && (
																<span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-[10px] rounded-full">
																	Admin
																</span>
															)}
														</p>
													</div>
													<p className="text-xs text-gray-600">{reply.message}</p>
													<p className="text-[10px] text-gray-400 mt-1">
														{new Date(reply.createdAt).toLocaleString()}
													</p>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Quick Reply Templates */}
								{selectedMessage.status !== "closed" && (
									<div className="space-y-2">
										<h4 className="font-bold text-sm text-gray-700">
											Quick Reply Templates
										</h4>
										<div className="grid grid-cols-1 gap-2">
											{quickReplyTemplates.map((template, index) => (
												<button
													key={index}
													onClick={() => handleQuickReply(selectedMessage._id, template)}
													className="text-left p-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs text-gray-700 transition-colors"
												>
													"{template}"
												</button>
											))}
										</div>
									</div>
								)}

								{/* Custom Reply Form */}
								{selectedMessage.status !== "closed" && (
									<form onSubmit={handleCustomReply} className="space-y-2">
										<label className="block text-xs font-bold text-gray-700">
											Custom Reply
										</label>
										<textarea
											value={replyText}
											onChange={(e) => setReplyText(e.target.value)}
											placeholder="Type your custom reply..."
											rows={3}
											className="w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none text-sm resize-none transition-all"
										></textarea>
										<button
											type="submit"
											disabled={!replyText.trim()}
											className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<FaPaperPlane />
											Send Custom Reply
										</button>
									</form>
								)}
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="bg-gray-50 p-3 border-t border-gray-200">
						<p className="text-xs text-gray-500 text-center">
							{messages.length} total messages • {unreadCount} pending
						</p>
					</div>
				</div>
			)}
		</>
	);
}
