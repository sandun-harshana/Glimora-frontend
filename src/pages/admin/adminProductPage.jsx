import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";

function ProductDeleteConfirm(props){	
	const productID = props.productID;
	const close = props.close;
	const refresh = props.refresh
	function deleteProduct(){
		const token = localStorage.getItem("token");
		axios
			.delete(import.meta.env.VITE_API_URL + "/api/products/" + productID,{
				headers: {
					Authorization: `Bearer ${token}`
				}
			})
			.then((response) => {
				console.log(response.data);
				close();
				toast.success("Product deleted successfully");
				refresh();
			}).catch(() => {
				toast.error("Failed to delete product");
			})
	}

	return (
		<div className="fixed left-0 top-0 w-full h-screen bg-black/60 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
			<div className="w-full max-w-md bg-white rounded-3xl shadow-2xl relative p-8 border border-red-200">
				<button 
					onClick={close} 
					className="absolute right-4 top-4 w-10 h-10 bg-red-100 rounded-full text-red-600 flex justify-center items-center font-bold hover:bg-red-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
				>
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
				
				<div className="flex flex-col items-center gap-6">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
						</svg>
					</div>
					
					<div className="text-center">
						<h3 className="text-2xl font-bold text-secondary mb-2">Delete Product?</h3>
						<p className="text-secondary/70">
							Are you sure you want to delete the product with ID: 
							<span className="font-mono font-semibold text-accent block mt-1">{productID}</span>
						</p>
						<p className="text-sm text-red-600 mt-3 font-semibold">This action cannot be undone.</p>
					</div>
					
					<div className="flex gap-4 w-full mt-2">
						<button 
							onClick={close} 
							className="flex-1 bg-secondary/5 hover:bg-secondary/10 text-secondary py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-secondary/20"
						>
							Cancel
						</button>
						<button 
							onClick={deleteProduct} 
							className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default function AdminProductPage() {
	const [products, setProducts] = useState([]);
	const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
	const [productToDelete, setProductToDelete]= useState(null);
	const [isLoading, setIsLoading] = useState(true)

	const navigate = useNavigate()

	useEffect(() => {
		if(isLoading){
			axios
			.get(import.meta.env.VITE_API_URL + "/api/products")
			.then((response) => {
				console.log(response.data);
				setProducts(response.data);
				setIsLoading(false);
			});
		}		
	}, [isLoading]);

	
	
	return (
		<div className="w-full min-h-full bg-gradient-to-br from-primary/30 via-white to-primary/20">
			{
				isDeleteConfirmVisible && <ProductDeleteConfirm refresh={()=>{setIsLoading(true)}} productID={productToDelete}  close={()=>{setIsDeleteConfirmVisible(false)}} />
			}
			<Link to="/admin/add-product"  className="group fixed right-[50px] bottom-[50px] z-50">
                <div className="relative">
					<div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
					<CiCirclePlus className="relative text-5xl text-accent hover:text-accent/80 hover:scale-110 transition-all duration-300 drop-shadow-lg" />
				</div>
            </Link>
            {/* Page container */}
			<div className="mx-auto max-w-7xl p-8">
				{/* Page Header */}
				<div className="mb-8">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
							<svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
							</svg>
						</div>
						<div>
							<h1 className="text-3xl font-bold text-secondary">Product Management</h1>
							<p className="text-secondary/60 text-sm">Manage your product inventory</p>
						</div>
					</div>
					<div className="w-24 h-1 bg-gradient-to-r from-accent to-transparent rounded-full"></div>
				</div>
				{/* Card */}
				<div className="rounded-3xl border border-accent/20 bg-white shadow-2xl overflow-hidden">
					{/* Header bar */}
					<div className="flex items-center justify-between gap-4 bg-gradient-to-r from-accent/5 to-transparent px-8 py-5 border-b border-accent/20">
						<div className="flex items-center gap-3">
							<div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
							<h2 className="text-xl font-bold text-secondary">All Products</h2>
						</div>
						<div className="flex items-center gap-3">
							<span className="rounded-full bg-accent/10 px-4 py-2 text-sm font-semibold text-accent border border-accent/20">
								{products.length} items
							</span>
							<Link to="/admin/add-product" className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-300 text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl">
								<CiCirclePlus className="text-lg" />
								Add New
							</Link>
						</div>
					</div>

					{/* Table wrapper for responsive scrolling */}
					<div className="overflow-x-auto">
						{isLoading?<Loader/>:
						<table className="w-full min-w-[880px] text-left">
							<thead className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary text-white">
								<tr>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Image
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Product ID
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Product Name
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Price
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Original Price
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Stock
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider">
										Category
									</th>
									<th className="sticky top-0 z-10 px-6 py-4 text-xs font-bold uppercase tracking-wider text-center">
										Actions
									</th>
								</tr>
							</thead>

							<tbody className="divide-y divide-secondary/10">
								{products.map((item) => {
									return (
										<tr
											key={item.productID}
											className="group odd:bg-white even:bg-primary/30 hover:bg-accent/5 transition-all duration-300"
										>
											<td className="px-6 py-4">
												<img
													src={item.images?.[0]}
													alt={item.name}
													className="h-20 w-20 rounded-xl object-cover ring-2 ring-accent/20 group-hover:ring-accent/40 transition-all shadow-lg group-hover:scale-105"
												/>
											</td>
											<td className="px-6 py-4 font-mono text-sm text-secondary/70 group-hover:text-secondary">
												{item.productID}
											</td>
											<td className="px-6 py-4 font-semibold text-secondary group-hover:text-accent transition-colors">
												{item.name}
											</td>
											<td className="px-6 py-4 text-secondary/90">
												<span className="rounded-lg bg-green-50 px-3 py-1.5 text-sm font-bold text-green-700 border border-green-200">
													LKR {item.price}
												</span>
											</td>
											<td className="px-6 py-4 text-secondary/70">
												<span className="text-sm line-through opacity-60">
													LKR {item.labelledPrice}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold ${item.stock > 10 ? 'bg-green-50 text-green-700 border border-green-200' : item.stock > 0 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
													<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
														<circle cx="10" cy="10" r="10" />
													</svg>
													{item.stock}
												</span>
											</td>
											<td className="px-6 py-4">
												<span className="rounded-full bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent border border-accent/30">
													{item.category}
												</span>
											</td>
											<td className="px-6 py-4">
												<div className="flex items-center justify-center gap-2">
													<button
														className="group/btn cursor-pointer rounded-xl p-2.5 text-secondary/60 bg-white border border-secondary/20 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-sm hover:shadow-md"
														title="Delete"
														aria-label="Delete product"
														onClick={()=>{
															setProductToDelete(item.productID);
															setIsDeleteConfirmVisible(true)
														}}
													>
														<FaRegTrashCan size={18} />
													</button>
													<button
														className="group/btn cursor-pointer rounded-xl p-2.5 text-secondary/60 bg-white border border-secondary/20 hover:border-accent hover:bg-accent/10 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-md"
														title="Edit"
														aria-label="Edit product"
														onClick={()=>{
															navigate("/admin/update-product" , {
																state : item
															})
														}}
													>
														<FaRegEdit size={18} />
													</button>
												</div>
											</td>
										</tr>
									);
								})}
								{products.length === 0 && (
									<tr>
										<td
											className="px-6 py-16 text-center text-secondary/60"
											colSpan={8}
										>
											<div className="flex flex-col items-center gap-3">
												<svg className="w-16 h-16 text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
												</svg>
												<p className="text-lg font-semibold">No products to display</p>
												<p className="text-sm">Add your first product to get started</p>
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
