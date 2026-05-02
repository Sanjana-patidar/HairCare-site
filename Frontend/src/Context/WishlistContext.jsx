import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// step 1: create wishlist context
const WishlistContext = createContext();

// step 2: create wishlist provider
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch wishlist from backend on load
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // If not logged in, don't fetch

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setWishlistItems(response.data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []); // Run once on mount

  // add to wishlist
  const addToWishlist = async (product) => {
    const token = localStorage.getItem("token");
    if (!token) {
        toast.warning("Please login to add items to your wishlist");
        return;
    }
    
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/wishlist`, 
        { productId: product._id },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems(response.data.wishlist || []);
        toast.success("Added to wishlist");
    } catch (error) {
        console.error("Error adding to wishlist", error);
        toast.error("Failed to add to wishlist");
    }
  };

  // remove from wishlist
  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await axios.delete(`${import.meta.env.VITE_API_URL}/users/wishlist/${productId}`, 
        { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlistItems(response.data.wishlist || []);
        toast.success("Removed from wishlist");
    } catch (error) {
        console.error("Error removing from wishlist", error);
        toast.error("Failed to remove from wishlist");
    }
  };

  // clear wishlist (e.g. on logout)
  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// step 3: hook 
export const useWishlist = () => useContext(WishlistContext);
