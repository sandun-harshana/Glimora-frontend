import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

const formatLKR = (n) =>
	new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR" }).format(
		n ?? 0
	);

const statusBadgeClass = (status) => {
	const base =
		"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
	switch ((status || "").toLowerCase()) {
		case "paid":
		case "completed":
			return `${base} bg-green-500/10 text-green-600`;
		case "shipped":
		case "processing":
			return `${base} bg-blue-500/10 text-blue-600`;
		case "cancelled":
		case "canceled":
			return `${base} bg-red-500/10 text-red-600`;
		default:
			return `${base} bg-accent/10 text-accent`;
	}
};

export default function OrderModal({
	isModalOpen,
	selectedOrder,
	closeModal,
	refresh,
}) {
    const [status,setStatus] = useState(selectedOrder?.status);
	const [rejectReason, setRejectReason] = useState("");
	const [showRejectForm, setShowRejectForm] = useState(false);
	
	if (!isModalOpen || !selectedOrder) return null;

	const handleApprovePayment = () => {
		const token = localStorage.getItem("token");
		axios.post(
			`${import.meta.env.VITE_API_URL}/api/orders/${selectedOrder.orderID}/approve-payment`,
			{},
			{ headers: { Authorization: `Bearer ${token}` } }
		)
		.then(() => {
			toast.success("Payment approved successfully");
			closeModal();
			refresh();
		})
		.catch((err) => {
			console.error(err);
			toast.error(err.response?.data?.message || "Failed to approve payment");
		});
	};

	const handleRejectPayment = () => {
		const token = localStorage.getItem("token");
		axios.post(
			`${import.meta.env.VITE_API_URL}/api/orders/${selectedOrder.orderID}/reject-payment`,
			{ reason: rejectReason },
			{ headers: { Authorization: `Bearer ${token}` } }
		)
		.then(() => {
			toast.success("Payment rejected");
			setShowRejectForm(false);
			setRejectReason("");
			closeModal();
			refresh();
		})
		.catch((err) => {
			console.error(err);
			toast.error(err.response?.data?.message || "Failed to reject payment");
		});
	};

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
			onClick={closeModal}
		>
			<div
				className="relative w-[92vw] max-w-3xl rounded-2xl border border-secondary/10 bg-primary shadow-xl"
				onClick={(e) => e.stopPropagation()}
				role="dialog"
				aria-modal="true"
			>
				{/* Header */}
				<div className="flex items-start justify-between gap-4 border-b border-secondary/10 px-6 py-4">
					<div className="space-y-1">
						<h2 className="text-lg font-semibold text-secondary">
							Order #{selectedOrder.orderID}
						</h2>
						<div className="flex items-center gap-2 text-xs text-secondary/60">
							<span className={statusBadgeClass(selectedOrder.status)}>
								{selectedOrder.status}
							</span>
							<span>•</span>
							<span>
								{new Date(selectedOrder.date).toLocaleString(undefined, {
									year: "numeric",
									month: "short",
									day: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
						</div>
					</div>

					<button
						onClick={closeModal}
						className="rounded-xl border border-secondary/10 px-2.5 py-1.5 text-secondary/70 hover:bg-accent/10 hover:text-secondary transition"
						aria-label="Close"
					>
						✕
					</button>
				</div>

				{/* Body */}
				<div className="max-h-[70vh] overflow-y-auto px-6 py-5">
					{/* Summary */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-secondary/5">
							<h3 className="mb-3 text-sm font-semibold text-secondary">
								Customer
							</h3>
							<dl className="space-y-2 text-sm">
								<div className="flex justify-between">
									<dt className="text-secondary/60">Name</dt>
									<dd className="font-medium text-secondary">
										{selectedOrder.customerName}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-secondary/60">Email</dt>
									<dd className="font-medium text-secondary">
										{selectedOrder.email}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-secondary/60">Phone</dt>
									<dd className="font-medium text-secondary">
										{selectedOrder.phone}
									</dd>
								</div>
								<div className="flex items-start justify-between">
									<dt className="text-secondary/60">Address</dt>
									<dd className="max-w-[60%] text-right font-medium text-secondary">
										{selectedOrder.address}
									</dd>
								</div>
							</dl>
						</div>

						<div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-secondary/5">
							<h3 className="mb-3 text-sm font-semibold text-secondary">
								Payment
							</h3>
							<dl className="space-y-2 text-sm">
								<div className="flex justify-between">
									<dt className="text-secondary/60">Method</dt>
									<dd className="font-medium text-secondary capitalize">
										{selectedOrder.paymentMethod?.replace(/-/g, ' ') || "N/A"}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-secondary/60">Status</dt>
									<dd className={statusBadgeClass(selectedOrder.paymentStatus)}>
										{selectedOrder.paymentStatus?.toUpperCase() || "UNPAID"}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-secondary/60">Items</dt>
									<dd className="font-medium text-secondary">
										{selectedOrder.items?.length ?? 0}
									</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-secondary/60">Total</dt>
									<dd className="font-semibold text-secondary">
										{formatLKR(selectedOrder.total)}
									</dd>
								</div>
							</dl>
						</div>
					</div>

					{/* Payment Details - Show when payment method is not cash-on-delivery */}
					{selectedOrder.paymentMethod && selectedOrder.paymentMethod !== "cash-on-delivery" && (
						<div className="mt-5 rounded-xl bg-white shadow-sm ring-1 ring-secondary/5 p-4">
							<h3 className="text-sm font-semibold text-secondary mb-3">
								Payment Details
							</h3>
							<dl className="space-y-2 text-sm">
								{selectedOrder.paymentDetails?.transactionId && (
									<div className="flex justify-between">
										<dt className="text-secondary/60">Transaction ID</dt>
										<dd className="font-mono text-xs font-medium text-secondary">
											{selectedOrder.paymentDetails.transactionId}
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.bankName && (
									<div className="flex justify-between">
										<dt className="text-secondary/60">Bank</dt>
										<dd className="font-medium text-secondary">
											{selectedOrder.paymentDetails.bankName}
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.accountNumber && (
									<div className="flex justify-between">
										<dt className="text-secondary/60">Account Number</dt>
										<dd className="font-mono text-xs font-medium text-secondary">
											{selectedOrder.paymentDetails.accountNumber}
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.paidAmount > 0 && (
									<div className="flex justify-between">
										<dt className="text-secondary/60">Paid Amount</dt>
										<dd className="font-semibold text-secondary">
											{formatLKR(selectedOrder.paymentDetails.paidAmount)}
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.paymentDate && (
									<div className="flex justify-between">
										<dt className="text-secondary/60">Payment Date</dt>
										<dd className="font-medium text-secondary">
											{new Date(selectedOrder.paymentDetails.paymentDate).toLocaleString()}
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.paymentProof && (
									<div className="flex flex-col gap-2 mt-3">
										<dt className="text-secondary/60 font-semibold">Payment Proof</dt>
										<dd>
											<a 
												href={selectedOrder.paymentDetails.paymentProof}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-medium text-accent hover:bg-accent/20 transition"
											>
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
												</svg>
												View Payment Proof
											</a>
										</dd>
									</div>
								)}
								{selectedOrder.paymentDetails?.rejectionReason && (
									<div className="flex flex-col gap-1 mt-3 p-3 bg-red-50 rounded-lg">
										<dt className="text-red-600 font-semibold text-xs">Rejection Reason</dt>
										<dd className="text-red-700 text-sm">
											{selectedOrder.paymentDetails.rejectionReason}
										</dd>
									</div>
								)}
							</dl>

							{/* Payment Approval Actions */}
							{selectedOrder.paymentStatus === "pending" && (
								<div className="mt-4 pt-4 border-t border-secondary/10">
									{!showRejectForm ? (
										<div className="flex gap-3">
											<button
												onClick={handleApprovePayment}
												className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 transition"
											>
												✓ Approve Payment
											</button>
											<button
												onClick={() => setShowRejectForm(true)}
												className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition"
											>
												✗ Reject Payment
											</button>
										</div>
									) : (
										<div className="space-y-3">
											<div>
												<label className="block text-xs font-medium text-secondary/70 mb-1">
													Rejection Reason
												</label>
												<textarea
													value={rejectReason}
													onChange={(e) => setRejectReason(e.target.value)}
													placeholder="Enter reason for rejection..."
													className="w-full rounded-lg border border-secondary/20 bg-white px-3 py-2 text-sm text-secondary focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition resize-none"
													rows={3}
												/>
											</div>
											<div className="flex gap-2">
												<button
													onClick={handleRejectPayment}
													disabled={!rejectReason.trim()}
													className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
												>
													Confirm Rejection
												</button>
												<button
													onClick={() => {
														setShowRejectForm(false);
														setRejectReason("");
													}}
													className="flex-1 rounded-xl bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary shadow-sm hover:bg-secondary/20 transition"
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					)}

					{/* Items */}
					<div className="mt-5 rounded-xl bg-white shadow-sm ring-1 ring-secondary/5">
						<div className="border-b border-secondary/10 px-4 py-3 text-sm font-semibold text-secondary">
							Line Items
						</div>
						<ul className="divide-y divide-secondary/10">
							{selectedOrder.items?.map((it) => {
								const lineTotal = (it.quantity ?? 0) * (it.price ?? 0);
								return (
									<li
										key={it.productID}
										className="flex items-center gap-4 px-4 py-3"
									>
										<img
											src={it.image}
											alt={it.name}
											className="h-14 w-14 flex-none rounded-xl object-cover ring-1 ring-secondary/10"
										/>
										<div className="min-w-0 flex-1">
											<div className="flex items-baseline justify-between gap-4">
												<p className="truncate font-medium text-secondary">
													{it.name}
												</p>
												<p className="text-sm text-secondary/70">
													{formatLKR(it.price)}
												</p>
											</div>
											<div className="mt-1 flex items-center justify-between text-xs text-secondary/60">
												<span className="font-mono">PID: {it.productID}</span>
												<span>Qty: {it.quantity}</span>
												<span className="font-semibold text-secondary">
													{formatLKR(lineTotal)}
												</span>
											</div>
										</div>
									</li>
								);
							})}
							{!selectedOrder.items?.length && (
								<li className="px-4 py-6 text-center text-sm text-secondary/60">
									No items.
								</li>
							)}
						</ul>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-between gap-3 border-t border-secondary/10 px-6 py-4">
					<span className="text-sm text-secondary/60">
						{selectedOrder.items?.length ?? 0} items •{" "}
						{formatLKR(selectedOrder.total)}
					</span>
					<select
						defaultValue={selectedOrder.status}
                        onChange={(e)=>setStatus(e.target.value)}
						className="
    w-full rounded-xl border border-secondary/20 bg-white 
    px-3 py-2 text-sm text-secondary shadow-sm
    focus:border-accent focus:ring-2 focus:ring-accent/20 
    transition
  "
					>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
						<option value="refunded">Refunded</option>
						<option value="pending">Pending</option>
					</select>

					<div className="flex items-center gap-2">
						<button
                            onClick={()=>{
                                const token = localStorage.getItem("token");
                                axios.put(
                                    `${import.meta.env.VITE_API_URL}/api/orders/status/${selectedOrder.orderID}`,
                                    { status : status },
                                    { headers: { Authorization: `Bearer ${token}` } }
                                )
                                .then(() => {
                                    toast.success("Order status updated");
                                    closeModal();
                                    refresh();
                                })
                                .catch((err) => {
                                    console.error(err);
                                    toast.error("Failed to update order status");
                                });
                            }}
							disabled={status == selectedOrder.status}
							className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
						>
							Update
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
