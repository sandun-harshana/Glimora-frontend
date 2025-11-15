import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaBox, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import { MdPendingActions, MdCheckCircle, MdLocalShipping } from "react-icons/md";
import { Loader } from "../../components/loader";
import OrderModal from "../../components/orderInfoModal";



export default function AdminOrdersPage() {
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
	const [expandedOrderId, setExpandedOrderId] = useState(null);

	const navigate = useNavigate()

	useEffect(() => {
		if(isLoading){
            const token = localStorage.getItem("token");
            if (token == null) {
                navigate("/login");
                return;
            }
			axios
			.get(import.meta.env.VITE_API_URL + "/api/orders",{
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })
			.then((response) => {
				console.log(response.data);
				setOrders(response.data);
				setIsLoading(false);
			});
		}		
	}, [isLoading]);

	
	return (
		<div className="w-full min-h-full bg-gradient-to-br from-primary/30 via-white to-primary/20">
            <OrderModal isModalOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} selectedOrder={selectedOrder} refresh={()=>{setIsLoading(true)}}/>
		
            {/* Page container */}
			<div className="mx-auto max-w-[1800px] p-8">
				{/* Enhanced Page Header */}
				<div className="mb-8 relative">
					<div className="bg-white rounded-3xl shadow-2xl p-8 border border-accent/20 overflow-hidden">
						<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
						<div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
						<div className="relative flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
									<FaShoppingCart className="text-white text-2xl" />
								</div>
								<div>
									<h1 className="text-4xl font-bold mb-1 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
										Order Management
									</h1>
									<p className="text-secondary/60 font-medium">Track and manage all customer orders</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl px-6 py-4 border border-accent/20 shadow-lg">
									<div className="flex items-center gap-3">
										<FaBox className="text-accent text-xl" />
										<div>
											<p className="text-xs text-secondary/60 uppercase tracking-wide font-semibold">Total Orders</p>
											<p className="text-2xl font-bold text-secondary">{orders.length}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Enhanced Card */}
				<div className="rounded-3xl border-2 border-accent/20 bg-white shadow-2xl overflow-hidden">
					{/* Enhanced Header bar */}
					<div className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary px-8 py-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
									<FaShoppingCart className="text-white text-xl" />
								</div>
								<div>
									<h2 className="text-2xl font-bold text-white flex items-center gap-3">
										All Orders
										<span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
											Live
										</span>
									</h2>
									<p className="text-white/70 text-sm mt-1">Complete order history and details</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
									<p className="text-white/70 text-xs uppercase tracking-wide font-semibold mb-1">Total Orders</p>
									<p className="text-2xl font-bold text-white">{orders.length}</p>
								</div>
							</div>
						</div>
					</div>

					{/* Table wrapper for responsive scrolling */}
					<div className="overflow-x-auto">
						{isLoading?<Loader/>:
						<table className="w-full min-w-[1200px] text-left">
							<thead className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary text-white">
								<tr>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
											</svg>
											Order ID
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<FaBox className="w-4 h-4" />
											Items
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
											Customer
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<FaEnvelope className="w-4 h-4" />
											Email
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<FaPhone className="w-4 h-4" />
											Phone
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<FaMapMarkerAlt className="w-4 h-4" />
											Address
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider">
										<div className="flex items-center gap-2">
											<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											Total (LKR)
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider text-center">
										<div className="flex items-center justify-center gap-2">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
											Payment
										</div>
									</th>
									<th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider text-center">
										<div className="flex items-center justify-center gap-2">
											<MdLocalShipping className="w-4 h-4" />
											Status
										</div>
									</th>
                                    <th className="sticky top-0 z-10 px-3 py-3 text-xs font-bold uppercase tracking-wider text-center">
										<div className="flex items-center justify-center gap-2">
											<FaCalendar className="w-4 h-4" />
											Date
										</div>
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-secondary/10">
								{orders.map((item, index) => {
									return (
										<tr
											key={item.orderID}
											className="group odd:bg-white even:bg-primary/30 hover:bg-gradient-to-r hover:from-accent/5 hover:to-transparent transition-all duration-300 cursor-pointer hover:shadow-lg"
                                            onClick={()=>{
                                                setSelectedOrder(item);
                                                setIsModalOpen(true);
                                            }}
										>
											
											<td className="px-3 py-3">
												<div className="flex items-center gap-2 bg-secondary/5 px-3 py-2 rounded-lg border border-secondary/10">
													<div 
														className="w-8 h-8 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center font-bold text-white text-xs shadow-sm group-hover:scale-105 transition-all cursor-pointer hover:rotate-6"
														onClick={(e) => {
															e.stopPropagation();
															setExpandedOrderId(expandedOrderId === item.orderID ? null : item.orderID);
														}}
														title={expandedOrderId === item.orderID ? "Click to hide ID" : "Click to show full ID"}
													>
														#{index + 1}
													</div>
													{expandedOrderId === item.orderID && (
														<span className="font-mono text-xs text-secondary/70 group-hover:text-secondary font-semibold">
															{item.orderID}
														</span>
													)}
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold bg-accent/10 text-accent border border-accent/30">
													<FaBox className="w-3 h-3" />
													{item.items.length}
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-2 bg-accent/5 px-3 py-2 rounded-lg border border-accent/10">
													<div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
														<svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
														</svg>
													</div>
													<span className="text-xs font-semibold text-secondary group-hover:text-accent transition-colors">
														{item.customerName || "N/A"}
													</span>
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-2 bg-secondary/5 px-3 py-2 rounded-lg border border-secondary/10">
													<FaEnvelope className="w-3 h-3 text-accent flex-shrink-0" />
													<span className="text-xs text-secondary/80 truncate max-w-[150px]">{item.email}</span>
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-2 bg-secondary/5 px-3 py-2 rounded-lg border border-secondary/10">
													<FaPhone className="w-3 h-3 text-accent flex-shrink-0" />
													<span className="text-xs text-secondary/70">{item.phone || "N/A"}</span>
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="flex items-center gap-2 bg-secondary/5 px-3 py-2 rounded-lg border border-secondary/10">
													<FaMapMarkerAlt className="w-3 h-3 text-accent flex-shrink-0" />
													<span className="text-xs text-secondary/70 truncate max-w-[120px]">{item.address}</span>
												</div>
											</td>
											<td className="px-3 py-3">
												<div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700 border border-green-300">
													<span>LKR</span>
													{item.total.toFixed(2)}
												</div>
											</td>
											<td className="px-3 py-3 text-center">
												{item.paymentStatus === "paid" ? (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 border border-green-300">
														<MdCheckCircle className="w-3 h-3" />
														PAID
													</div>
												) : item.paymentStatus === "pending" ? (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-orange-50 text-orange-700 border border-orange-300 animate-pulse">
														<MdPendingActions className="w-3 h-3" />
														PENDING
													</div>
												) : (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-red-50 text-red-700 border border-red-300">
														<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
														</svg>
														UNPAID
													</div>
												)}
											</td>
                                            <td className="px-3 py-3 text-center">
												{item.status === "delivered" ? (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 border border-green-300">
														<MdCheckCircle className="w-3 h-3" />
														DELIVERED
													</div>
												) : item.status === "pending" ? (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-orange-50 text-orange-700 border border-orange-300">
														<MdPendingActions className="w-3 h-3" />
														PENDING
													</div>
												) : (
													<div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-300">
														<MdLocalShipping className="w-3 h-3" />
														{item.status.toUpperCase()}
													</div>
												)}
                                            </td>
                                            <td className="px-3 py-3 text-center">
												<div className="inline-flex items-center gap-2 text-secondary/70 bg-secondary/5 px-3 py-1.5 rounded-lg border border-secondary/10">
													<FaCalendar className="w-3 h-3 text-accent" />
													<span className="text-xs font-medium">
                                                		{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
													</span>
												</div>
                                            </td>
										</tr>
									);
								})}
								{orders.length === 0 && (
									<tr>
										<td
											className="px-6 py-20 text-center text-secondary/60"
											colSpan={10}
										>
											<div className="flex flex-col items-center gap-4">
												<div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-accent/5 rounded-3xl flex items-center justify-center">
													<FaShoppingCart className="w-12 h-12 text-accent" />
												</div>
												<div>
													<p className="text-xl font-bold text-secondary mb-2">No orders yet</p>
													<p className="text-sm text-secondary/50">Orders will appear here once customers make purchases</p>
												</div>
												<div className="flex items-center gap-2 mt-2">
													<div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
													<span className="text-xs text-accent font-semibold uppercase tracking-wide">Waiting for orders...</span>
												</div>
											</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>}
					</div>
				</div>
			</div>
		</div>
	);
}
