import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { addToCart, getTotal, loadCart } from "../utils/cart";
import { BiTrash } from "react-icons/bi";
import {  useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {

	const [cart, setCart] = useState(loadCart())

	return (
		<div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-br from-primary via-white to-primary/50 py-12 px-6">
			<div className="max-w-4xl mx-auto">
				{/* Page Header */}
				<div className="mb-10">
					<div className="flex items-center gap-4 mb-4">
						<div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center">
							<svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
						</div>
						<div>
							<h1 className="text-4xl font-bold text-secondary">Shopping Cart</h1>
							<p className="text-secondary/60">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart</p>
						</div>
					</div>
					<div className="w-24 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
				</div>

				{/* Cart Items */}
				<div className="flex flex-col gap-4">
					{cart.length > 0 ? (
						<>
							{cart.map((item, index) => {
								return (
									<div key={index} className="group bg-white rounded-3xl shadow-lg hover:shadow-xl border border-accent/10 overflow-hidden transition-all duration-300">
										<div className="flex flex-col lg:flex-row items-center p-4 lg:p-6 gap-4">
											{/* Product Image */}
											<div className="w-full lg:w-auto">
												<img 
													className="h-32 lg:h-28 w-full lg:w-28 object-cover rounded-2xl ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all" 
													src={item.image}
													alt={item.name}
												/>
											</div>

											{/* Product Info */}
											<div className="flex-1 text-center lg:text-left px-4">
												<h2 className="font-bold text-xl text-secondary mb-1">{item.name}</h2>
												<span className="text-sm text-secondary/60 font-mono">{item.productID}</span>
											</div>

											{/* Quantity Controls */}
											<div className="flex flex-row lg:flex-col items-center gap-2 bg-accent/5 rounded-2xl p-3">
												<button 
													onClick={() => {
														addToCart(item, 1);
														setCart(loadCart());
													}}
													className="w-10 h-10 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-all hover:scale-110 flex items-center justify-center"
												>
													<CiCircleChevUp className="text-2xl" />
												</button>
												<span className="font-bold text-2xl text-secondary min-w-[50px] text-center">{item.quantity}</span>
												<button 
													onClick={() => {
														addToCart(item, -1);
														setCart(loadCart());
													}}
													className="w-10 h-10 rounded-xl bg-accent/10 hover:bg-accent/20 text-accent transition-all hover:scale-110 flex items-center justify-center"
												>
													<CiCircleChevDown className="text-2xl" />
												</button>
											</div>

											{/* Price */}
											<div className="flex flex-col items-center lg:items-end gap-1 min-w-[140px] pr-0 lg:pr-2">
												{item.labelledPrice > item.price && (
													<span className="text-secondary/50 line-through text-sm">
														LKR {item.labelledPrice.toFixed(2)}
													</span>
												)}
												<span className="font-bold text-2xl text-accent">
													LKR {(item.price * item.quantity).toFixed(2)}
												</span>
												<span className="text-xs text-secondary/60">
													LKR {item.price.toFixed(2)} each
												</span>
											</div>

											{/* Delete Button */}
											<button 
												className="text-red-500 hover:bg-red-50 rounded-full p-3 transition-all duration-300 hover:scale-110 flex-shrink-0"
												onClick={() => {
													addToCart(item, -item.quantity);
													setCart(loadCart());
												}}
												title="Remove from cart"
											>
												<BiTrash className="text-2xl" />
											</button>
										</div>
									</div>
								);
							})}

							{/* Cart Summary */}
							<div className="bg-gradient-to-br from-accent/10 to-white rounded-3xl shadow-xl border border-accent/20 p-6 lg:p-8 mt-4">
								<div className="flex flex-col lg:flex-row justify-between items-center gap-6">
									<div className="flex-1 text-center lg:text-left">
										<p className="text-secondary/70 mb-2">Cart Total</p>
										<p className="text-4xl font-bold text-accent">LKR {getTotal().toFixed(2)}</p>
									</div>
									<Link 
										state={cart} 
										to="/checkout" 
										className="w-full lg:w-auto px-8 py-4 bg-accent text-white rounded-2xl font-semibold text-lg hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
									>
										<span>Proceed to Checkout</span>
										<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
										</svg>
									</Link>
								</div>
							</div>
						</>
					) : (
						/* Empty Cart */
						<div className="bg-white rounded-3xl shadow-xl border border-accent/10 p-12 text-center">
							<svg className="w-32 h-32 text-secondary/20 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
							</svg>
							<h2 className="text-3xl font-bold text-secondary mb-4">Your cart is empty</h2>
							<p className="text-secondary/60 mb-8">Add some beautiful products to get started!</p>
							<Link 
								to="/products" 
								className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-semibold hover:bg-accent/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
								</svg>
								<span>Continue Shopping</span>
							</Link>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
