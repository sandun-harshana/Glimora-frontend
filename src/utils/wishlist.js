import axios from "axios";
import toast from "react-hot-toast";

export const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        // If not logged in, use localStorage
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const exists = wishlist.find(item => item._id === product._id);
        
        if (exists) {
            toast.error("Already in wishlist");
            return false;
        }
        
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        window.dispatchEvent(new Event('wishlist-updated'));
        toast.success("Added to wishlist!");
        return true;
    }

    try {
        await axios.post(
            import.meta.env.VITE_API_URL + "/api/wishlist",
            { productId: product._id },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        window.dispatchEvent(new Event('wishlist-updated'));
        toast.success("Added to wishlist!");
        return true;
    } catch (error) {
        if (error.response?.status === 400) {
            toast.error("Already in wishlist");
        } else {
            toast.error("Failed to add to wishlist");
        }
        return false;
    }
};

export const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        // If not logged in, use localStorage
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const updated = wishlist.filter(item => item._id !== productId);
        localStorage.setItem("wishlist", JSON.stringify(updated));
        window.dispatchEvent(new Event('wishlist-updated'));
        toast.success("Removed from wishlist");
        return true;
    }

    try {
        await axios.delete(
            import.meta.env.VITE_API_URL + `/api/wishlist/${productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        window.dispatchEvent(new Event('wishlist-updated'));
        toast.success("Removed from wishlist");
        return true;
    } catch (error) {
        toast.error("Failed to remove from wishlist");
        return false;
    }
};

export const isInWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        // If not logged in, check localStorage
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        return wishlist.some(item => item._id === productId);
    }

    try {
        const res = await axios.get(
            import.meta.env.VITE_API_URL + "/api/wishlist",
            { headers: { Authorization: `Bearer ${token}` } }
        );
        
        return res.data.wishlist.some(item => item.productId._id === productId);
    } catch (error) {
        return false;
    }
};
