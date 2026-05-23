import { createContext, useContext, useState, useEffect } from "react";

// step 1: create cart context
const CartContext = createContext();

// step 2: create cart provider
export const CartProvider = ({ children }) => {
  // 🔹 Load cart from localStorage initially
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🔹 Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // add to cart function
  const addToCart = (product, qty = 1) => {
    setCartItems((prev) => {
      const alreadyExists = prev.find((item) => item._id === product._id);
      if (alreadyExists) return prev;
      return [...prev, { ...product, quantity: qty }];
    });
  };

  // increase quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id === id) {
          const maxStock = item.stock || 1;
          const newQty = item.quantity + 1 > maxStock ? maxStock : item.quantity + 1;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // decrease quantity
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // remove item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  // clear cart (optional: after checkout)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// step 3: hook to use cart
export const useCart = () => useContext(CartContext);
