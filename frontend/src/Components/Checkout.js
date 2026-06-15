import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../AppContext";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Truck, CheckCircle2, ArrowLeft, ShieldCheck, Wallet } from "lucide-react";

function Checkout() {
    const userId = localStorage.getItem("user");
    const navigate = useNavigate();
    const { loct, requestLocation } = useContext(AppContext);

    const [formData, setFormData] = useState({
        fullName: "",
        email: userId || "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        phone: ""
    });
    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [shippingMethod, setShippingMethod] = useState("Standard Shipping");
    const [cart, setCart] = useState(null);
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        // Fetch products and cart
        API.get("/products").then(res => {
            const prodMap = {};
            res.data.forEach(p => prodMap[p.id] = p);
            setProducts(prodMap);
            return API.get(`/cart/${userId}`);
        }).then(res => {
            setCart(res.data);
            if (!res.data || !res.data.items || res.data.items.length === 0) {
                navigate("/cart");
            }
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [userId, navigate]);

    // Auto-fill effect when location is detected
    useEffect(() => {
        if (loct && loct.includes(",") && !loct.includes("Detecting")) {
            const parts = loct.split(",");
            setFormData(prev => ({
                ...prev,
                city: prev.city || parts[0].trim(),
                country: prev.country === "India" ? (parts[1].trim() || "India") : prev.country
            }));
        }
    }, [loct]);

    const handlePlaceOrder = () => {
        const { fullName, email, street, city, state, pincode, country, phone } = formData;

        if (!fullName || !email || !street || !city || !state || !pincode || !country || !phone) {
            alert("Please provide all delivery information.");
            return;
        }

        const fullAddress = `${fullName} | ${email} | ${street}, ${city}, ${state}, ${country} - ${pincode} | Phone: ${phone}`;

        API.post(`/orders/checkout/${userId}`, {
            address: fullAddress,
            paymentMethod,
            shippingMethod
        })
            .then(() => {
                alert(`Order successful! Redirecting to your orders...`);
                navigate("/my-orders");
            })
            .catch(() => alert("Checkout error. Please try again."));
    };

    const calculateTotal = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((acc, item) => {
            const pd = products[item.productId];
            const itemPrice = pd ? pd.price : 0;
            return acc + (itemPrice * item.quantity);
        }, 0);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    const total = calculateTotal();

    return (
        <div className="bg-gray-50 min-h-screen py-12">
            <div className="max-w-6xl mx-auto px-4">
                <button
                    onClick={() => navigate("/cart")}
                    className="flex items-center gap-2 text-gray-600 font-bold mb-8 hover:text-indigo-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Cart
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Side: Forms */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Delivery Information */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-indigo-600" /> Delivery Information
                                </h2>
                                <button 
                                    onClick={() => requestLocation()}
                                    className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                >
                                    <MapPin className="w-3 h-3" /> Detect Live Location
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email (Gmail)</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="example@gmail.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="+91-XXXXXXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Street Address</label>
                                    <textarea
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium resize-none"
                                        rows="2"
                                        placeholder="House No, Street, Landmark..."
                                        value={formData.street}
                                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="Your City"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="Your State"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="6-digit code"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Country</label>
                                    <input
                                        className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                        placeholder="Country"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Shipping Method */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Truck className="w-6 h-6 text-indigo-600" /> Shipping Method
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { name: "Standard Shipping", price: "Free", time: "5-7 Days" },
                                    { name: "Express Delivery", price: "₹99", time: "1-2 Days" }
                                ].map(m => (
                                    <label key={m.name} className={`relative flex flex-col p-5 border rounded-2xl cursor-pointer transition-all ${shippingMethod === m.name ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="shipping"
                                            className="absolute top-4 right-4 text-indigo-600"
                                            checked={shippingMethod === m.name}
                                            onChange={() => setShippingMethod(m.name)}
                                        />
                                        <span className="font-bold text-gray-900">{m.name}</span>
                                        <span className="text-sm text-gray-500">{m.time} • <span className="text-green-600 font-bold">{m.price}</span></span>
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* Payment Method */}
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-indigo-600" /> Payment Method
                            </h2>
                            <div className="space-y-3">
                                {["Credit Card / Debit Card", "UPI Payment", "PayPal", "Cash on Delivery"].map(m => (
                                    <label key={m} className={`flex items-center gap-4 p-5 border rounded-2xl cursor-pointer transition-all ${paymentMethod === m ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === m}
                                            onChange={() => setPaymentMethod(m)}
                                        />
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Wallet className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <span className="font-bold text-gray-900">{m}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sticky top-[100px]">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Final Summary</h2>
                            <div className="space-y-4 mb-8">
                                {cart.items.map(item => {
                                    const pd = products[item.productId];
                                    if (!pd) return null;
                                    return (
                                        <div key={item.productId} className="flex justify-between items-center text-sm">
                                            <span className="text-gray-600">{pd.name} x {item.quantity}</span>
                                            <span className="font-bold text-gray-900">₹{(pd.price * item.quantity).toLocaleString('en-IN')}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="border-t border-gray-100 pt-6 space-y-3 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Subtotal</span>
                                    <span className="font-bold text-gray-900">₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="font-bold text-green-600">{shippingMethod === "Express Delivery" ? "₹99" : "Free"}</span>
                                </div>
                                <div className="flex justify-between text-lg pt-2">
                                    <span className="font-bold text-gray-900">Total</span>
                                    <span className="font-black text-indigo-600 text-2xl">
                                        ₹{(total + (shippingMethod === "Express Delivery" ? 99 : 0)).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-transform transform active:scale-95"
                            >
                                Place Order <CheckCircle2 className="w-5 h-5" />
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-green-500" /> SSL SECURED CHECKOUT
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Checkout;
