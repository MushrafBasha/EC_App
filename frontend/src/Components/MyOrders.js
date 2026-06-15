import React, { useEffect, useState } from "react";
import API from "../api";
import { motion } from "framer-motion";
import { Package, Truck, CheckCircle, Info, Box, Calendar, MapPin, Search, CreditCard } from "lucide-react";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState({});
    const userId = localStorage.getItem("user");

    useEffect(() => {
        if (!userId) return;

        // Fetch Products to map details
        API.get("/products").then(res => {
            const prodMap = {};
            res.data.forEach(p => prodMap[p.id] = p);
            setProducts(prodMap);
            return API.get(`/orders/${userId}`);
        }).then(res => {
            setOrders(res.data.reverse()); // Latest orders first
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [userId]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4">
            <div className="max-w-5xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-black text-gray-900 mb-4">Track Your Orders</h1>
                <p className="text-gray-500 font-medium">Monitor your deliveries and view order history in one place.</p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <Package className="w-20 h-20 text-indigo-100 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h2>
                        <p className="text-gray-500 mb-8">You haven't placed any orders yet. Start shopping to see them here!</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* Top Header */}
                            <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-wrap gap-6 justify-between items-center">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Placed</p>
                                        <p className="font-bold text-gray-700 text-sm flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> 17 Apr 2026
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="font-bold text-indigo-600 text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order #</p>
                                        <p className="font-bold text-gray-700 text-sm uppercase">{order.id.slice(-8)}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">

                                {/* Left: Product Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Box className="w-5 h-5 text-indigo-600" /> Items in this Order
                                    </h3>
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => {
                                            const pd = products[item.productId];
                                            return (
                                                <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                                    <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                        <img src={pd?.imageUrl || "https://via.placeholder.com/50"} className="w-full h-full object-contain p-2" alt={pd?.name} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{pd?.name || "Loading..."}</h4>
                                                        <p className="text-xs text-gray-500 font-medium">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="pt-4 space-y-3">
                                        <p className="text-sm font-medium text-gray-600 flex items-start gap-2">
                                            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span><strong>Delivery Address:</strong> {order.deliveryAddress}</span>
                                        </p>
                                        <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            <span><strong>Paid via:</strong> {order.paymentMethod}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Right: Tracking Progress */}
                                <div className="bg-indigo-50/30 rounded-3xl p-8 border border-indigo-100/50">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Truck className="w-6 h-6 text-indigo-600" /> Live Tracking
                                    </h3>

                                    <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-indigo-100">
                                        <div className="p-3 bg-indigo-600 rounded-xl">
                                            <Search className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Tracking ID</p>
                                            <p className="font-black text-gray-900 text-sm uppercase">{order.trackingId || "PENDING..."}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8 relative">
                                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-indigo-200"></div>

                                        <div className="flex items-center gap-6 relative">
                                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center z-10 text-white shadow-lg shadow-green-100">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">Order Confirmed</p>
                                                <p className="text-xs text-gray-500 font-medium">Your order has been received</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 relative">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 text-white shadow-lg ${order.status !== 'PLACED' ? 'bg-green-500' : 'bg-indigo-600'
                                                }`}>
                                                {order.status !== 'PLACED' ? <CheckCircle className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">Shipped</p>
                                                <p className="text-xs text-gray-500 font-medium">Estimated arrival in {order.estimatedDelivery}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 relative opacity-50">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center z-10 text-white">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 leading-none mb-1">Out for Delivery</p>
                                                <p className="text-xs text-gray-500 font-medium">Coming to your doorstep soon</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-indigo-100/50">
                                        <div className="flex items-center gap-2 text-indigo-600">
                                            <Info className="w-4 h-4" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Method: {order.shippingMethod}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

export default MyOrders;
