import React, { useEffect, useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, CreditCard, ShieldCheck, Wallet } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const userId = localStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // Fetch Products to map prices
    API.get("/products").then(res => {
      const prodMap = {};
      res.data.forEach(p => prodMap[p.id] = p);
      setProducts(prodMap);

      // Fetch Cart
      API.get(`/cart/${userId}`)
        .then(res => {
          setCart(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });

  }, [userId]);

  const checkout = () => {
    if (!userId) {
      alert("Please login first to checkout");
      navigate("/login");
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    navigate("/checkout");
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(20);
      alert("Coupon applied! 20% discount added.");
    } else {
      alert("Invalid coupon code.");
    }
  };

  const removeItem = (productId) => {
    if (!userId) return;

    API.delete(`/cart/remove?userId=${userId}&productId=${productId}`)
      .then(() => {
        setCart(prev => {
          if (!prev) return null;
          return { ...prev, items: prev.items.filter(item => item.productId !== productId) };
        });
      })
      .catch(() => alert("Error removing item"));
  };

  if (!userId) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in to view your cart</h2>
          <p className="text-gray-500 mb-8">Access your saved items, checkout faster, and track your orders.</p>
          <Link to="/login" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold transition-colors shadow-lg shadow-indigo-200">
            Sign In Securely
          </Link>
        </div>
      </div>
    );
  }

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    const subtotal = cart.items.reduce((acc, item) => {
      const pd = products[item.productId];
      const itemPrice = pd ? pd.price : 0;
      return acc + (itemPrice * item.quantity);
    }, 0);
    return subtotal - (subtotal * (discount / 100));
  };

  const calculateSubtotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => {
      const pd = products[item.productId];
      const itemPrice = pd ? pd.price : 0;
      return acc + (itemPrice * item.quantity);
    }, 0);
  };

  const total = calculateTotal();
  const subtotal = calculateSubtotal();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

        {loading ? (
          <div className="flex justify-center py-20 pb-40">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (!cart || !cart.items || cart.items.length === 0) ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto mt-10">
            <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-48 mx-auto mb-6 opacity-70" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold transition-colors">
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Cart Items */}
            <div className="w-full lg:w-2/3 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">Items ({cart.items.length})</h2>
                <span className="text-gray-500 text-sm font-medium">Price</span>
              </div>

              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {cart.items.map((item) => {
                    const pd = products[item.productId];
                    // handle case where product may be deleted from DB but remains in cart
                    if (!pd) return null;

                    return (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 flex flex-col sm:flex-row gap-6 relative group"
                      >
                        <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 p-4 relative overflow-hidden">
                          <img
                            src={pd.imageUrl || `https://via.placeholder.com/150?text=${pd.name}`}
                            alt={pd.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                            onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image" }}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-10">{pd.name}</h3>
                            <span className="text-xl font-bold text-gray-900">₹{(pd.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>

                          <p className="text-sm text-green-600 font-medium mb-4 flex items-center gap-1">In Stock</p>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-1">
                              <span className="text-sm font-medium px-4 text-gray-600">Qty: {item.quantity}</span>
                            </div>

                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3 space-y-6 sticky top-[100px]">

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" /> Have a Coupon?
                </h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. SAVE20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-gray-900 text-white px-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 text-sm text-gray-600 mb-6 font-medium border-b border-gray-100 pb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({discount}%)</span>
                      <span>-₹{(subtotal * (discount / 100)).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="text-gray-900 font-bold text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-gray-900 block">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={checkout}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  Secure checkout
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;