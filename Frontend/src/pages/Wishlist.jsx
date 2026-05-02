import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../Context/WishlistContext";
import { useCart } from "../Context/CartContext";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to cart");
  };

  return (
    <div className="container mt-5 pt-4 mb-5">
      <h2 className="text-center mb-4 mt-5 text-warning fw-bold">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center mt-5">
          <i className="fa-regular fa-heart display-1 text-muted mb-3"></i>
          <h4>Your wishlist is currently empty.</h4>
          <p className="text-muted">Explore our products and find your favorites!</p>
          <Link to="/" className="btn btn-warning text-white px-4 py-2 mt-3">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {wishlistItems.map((product) => (
            <div className="col-12 col-md-6 col-lg-3" key={product._id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card hover-effect">
                <Link to={`/productdetail/${product._id}`} className="text-decoration-none text-dark">
                  <div className="position-relative">
                    <img
                      src={`${import.meta.env.VITE_API_IMAGE}/${product.image}`}
                      alt={product.name}
                      className="card-img-top p-3 img-fluid"
                      style={{ height: "250px", objectFit: "contain" }}
                      onError={(e) => { e.target.src = "/placeholder.png"; }}
                    />
                     {product.discountpercentage > 0 && (
                      <span className="badge bg-danger position-absolute top-0 start-0 m-2 rounded-pill px-2 py-1">
                        {product.discountpercentage}% OFF
                      </span>
                     )}
                  </div>
                </Link>
                
                <div className="card-body d-flex flex-column text-center">
                  <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                  <div className="d-flex justify-content-center align-items-center gap-2 my-2">
                    <span className="fw-bold fs-5 text-dark">₹{product.discountprice}</span>
                    <span className="text-muted text-decoration-line-through small">₹{product.price}</span>
                  </div>
                  
                  <div className="mt-auto d-flex justify-content-between align-items-center gap-2">
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="btn btn-warning text-white w-100 rounded-pill fw-medium"
                    >
                      <i className="fa-solid fa-cart-shopping me-2"></i> Add to Cart
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="btn btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                      title="Remove from Wishlist"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
