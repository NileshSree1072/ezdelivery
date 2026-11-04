import {createContext, useEffect, useState} from "react";

export const CartContext = createContext({});

const STORAGE_KEY = 'cart';

// Reads the saved cart, ignoring anything that isn't a list of product ids.
function readSavedCart(ls) {
  try {
    const saved = JSON.parse(ls?.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter(id => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function CartContextProvider({children}) {
  const ls = typeof window !== "undefined" ? window.localStorage : null;
  const [cartProducts,setCartProducts] = useState([]);
  const [loaded,setLoaded] = useState(false);
  // Save every change once the saved cart has been loaded, including an empty cart.
  useEffect(() => {
    if (loaded) {
      ls?.setItem(STORAGE_KEY, JSON.stringify(cartProducts));
    }
  }, [cartProducts, loaded]);
  useEffect(() => {
    const saved = readSavedCart(ls);
    if (saved.length > 0) {
      setCartProducts(saved);
    }
    setLoaded(true);
  }, []);
  function addProduct(productId) {
    setCartProducts(prev => [...prev,productId]);
  }
  function removeProduct(productId) {
    setCartProducts(prev => {
      const pos = prev.indexOf(productId);
      if (pos !== -1) {
        return prev.filter((value,index) => index !== pos);
      }
      return prev;
    });
  }
  function clearCart() {
    // Also clear storage right away: the cart page can call this before the saved cart
    // is loaded (child effects run first), and the load must not bring the items back.
    ls?.removeItem(STORAGE_KEY);
    setCartProducts([]);
  }
  return (
    <CartContext.Provider value={{cartProducts,setCartProducts,addProduct,removeProduct,clearCart}}>
      {children}
    </CartContext.Provider>
  );
}
