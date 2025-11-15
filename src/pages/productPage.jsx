import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage(){

    const[products, setProducts] = useState([]);
    const[isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if(isLoading){
            axios.get(import.meta.env.VITE_API_URL + "/api/products").then(
                (response)=>{
                    setProducts(response.data);
                    setIsLoading(false);
                }
            ).catch((error)=>{
                console.error("Error fetching products:", error);
                setIsLoading(false);
                toast.error("Failed to load products");
            });
        }
    },[isLoading])

    return(
        <div className="w-full min-h-[calc(100vh-100px)] bg-gradient-to-br from-primary via-white to-primary/50 py-12 px-6">
            {
                isLoading? <Loader/>
                :
                <div className="max-w-7xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-12 text-center">
                        <div className="inline-block px-6 py-3 bg-accent/10 rounded-full mb-6">
                            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Collection</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-secondary mb-6">All Products</h1>
                        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto rounded-full mb-8"></div>
                        <p className="text-xl text-secondary/80 max-w-2xl mx-auto">
                            Discover our premium beauty collection crafted with care for your glowing skin
                        </p>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {
                            products.map((item)=>{
                                return(
                                    <ProductCard key={item.productID} product={item}/>
                                )
                            })
                        }
                    </div>
                    
                    {products.length === 0 && (
                        <div className="text-center py-20">
                            <svg className="w-24 h-24 text-secondary/30 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <p className="text-2xl font-semibold text-secondary/70">No products available</p>
                            <p className="text-secondary/60 mt-2">Check back soon for new arrivals!</p>
                        </div>
                    )}
                </div>  
            }
        </div>
    )
}