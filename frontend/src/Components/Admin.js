import React, { useState, useEffect } from "react";
import API from "../api";
import { Package, ListOrdered, Plus, Edit, Trash2, CheckCircle, XCircle, Clock, RefreshCcw } from "lucide-react";

function Admin() {
    const [activeTab, setActiveTab] = useState("orders");
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    // Product Form state
    const [editingId, setEditingId] = useState(null);
    const [productForm, setProductForm] = useState({ name: "", price: "", description: "", imageUrl: "", imageUrl2: "", imageUrl3: "", category: "Mobile & Accessories", trending: false, offer: false, festivalOffer: false, newArrival: false });

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = () => {
        API.get("/orders/all").then(res => setOrders(res.data)).catch(err => console.log(err));
    };

    // fetchTickets removed

    const fetchProducts = () => {
        API.get("/products").then(res => setProducts(res.data)).catch(err => console.log(err));
    };

    const updateOrderStatus = (orderId, newStatus) => {
        API.put(`/orders/${encodeURIComponent(orderId)}/status?status=${encodeURIComponent(newStatus)}`)
            .then(() => {
                alert("Order status updated to " + newStatus);
                fetchOrders();
            })
            .catch(err => alert("Error updating status"));
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            API.put(`/products/${editingId}`, productForm)
                .then(() => {
                    alert("Product updated!");
                    setEditingId(null);
                    setProductForm({ name: "", price: "", description: "", imageUrl: "", imageUrl2: "", imageUrl3: "", category: "Mobile & Accessories", trending: false, offer: false, festivalOffer: false, newArrival: false });
                    fetchProducts();
                }).catch(err => { console.error(err); alert("Error updating product"); });
        } else {
            API.post("/products", productForm)
                .then(() => {
                    alert("Product created!");
                    setProductForm({ name: "", price: "", description: "", imageUrl: "", imageUrl2: "", imageUrl3: "", category: "Mobile & Accessories", trending: false, offer: false, festivalOffer: false, newArrival: false });
                    fetchProducts();
                }).catch(err => { console.error(err); alert("Error creating product"); });
        }
    };

    const editProduct = (p) => {
        setEditingId(p.id);
        setProductForm({ 
            name: p.name, 
            price: p.price, 
            description: p.description, 
            imageUrl: p.imageUrl || "", 
            imageUrl2: p.imageUrl2 || "", 
            imageUrl3: p.imageUrl3 || "", 
            category: p.category || "Mobile & Accessories", 
            trending: p.trending || false, 
            offer: p.offer || false,
            festivalOffer: p.festivalOffer || false,
            newArrival: p.newArrival || false
        });
    };

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure?")) {
            API.delete(`/products/${id}`).then(() => fetchProducts()).catch(err => console.error(err));
        }
    };

    // handleResolveTicket removed

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

                <div className="flex gap-4 mb-8 border-b pb-4">
                    <button
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'orders' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        <ListOrdered className="w-5 h-5" /> Orders & Returns
                    </button>
                    <button
                        className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600'}`}
                        onClick={() => setActiveTab('products')}
                    >
                        <Package className="w-5 h-5" /> Manage Products
                    </button>
                    {/* Tickets tab removed */}
                </div>

                {activeTab === 'orders' && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h2 className="text-xl font-bold mb-6">Recent Orders & Returns</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                                    <tr>
                                        <th className="p-4 rounded-tl-xl">Order ID</th>
                                        <th className="p-4">Customer</th>
                                        <th className="p-4">Total Amount</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 rounded-tr-xl">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-mono text-xs">{order.id}</td>
                                            <td className="p-4 font-medium">{order.userId}</td>
                                            <td className="p-4 font-bold">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-max items-center gap-1
                          ${order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                        order.status === 'RETURNED' ? 'bg-orange-100 text-orange-700' :
                                                            order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {order.status === 'CANCELLED' ? <XCircle className="w-3 h-3" /> :
                                                        order.status === 'RETURNED' ? <RefreshCcw className="w-3 h-3" /> :
                                                            order.status === 'COMPLETED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                    {order.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select
                                                    className="border p-2 rounded-lg text-sm bg-gray-50 font-bold"
                                                    value={order.status || "PENDING"}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="SHIPPED">Shipped</option>
                                                    <option value="COMPLETED">Completed</option>
                                                    <option value="RETURN_REQUESTED">Return Requested</option>
                                                    <option value="RETURNED">Returned</option>
                                                    <option value="CANCELLED">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-max">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-indigo-600" />
                                {editingId ? "Edit Product" : "Add Product"}
                            </h2>
                            <form onSubmit={handleProductSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Name</label>
                                    <input required className="w-full border p-3 rounded-lg bg-gray-50" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Price (₹)</label>
                                    <input required type="number" className="w-full border p-3 rounded-lg bg-gray-50" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Category</label>
                                    <select className="w-full border p-3 rounded-lg bg-gray-50" value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                        <option value="Mobile & Accessories">Mobile & Accessories</option>
                                        <option value="Laptop & Accessories">Laptop & Accessories</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home">Home</option>
                                        <option value="Appliances">Appliances</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Beauty">Beauty</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Primary Image URL</label>
                                    <input className="w-full border p-3 rounded-lg bg-gray-50 mb-2" placeholder="Main Image HTTPS link..." value={productForm.imageUrl} onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                                    <input className="w-full border p-3 rounded-lg bg-gray-50 mb-2" placeholder="Image 2 URL (Optional)" value={productForm.imageUrl2} onChange={e => setProductForm({ ...productForm, imageUrl2: e.target.value })} />
                                    <input className="w-full border p-3 rounded-lg bg-gray-50" placeholder="Image 3 URL (Optional)" value={productForm.imageUrl3} onChange={e => setProductForm({ ...productForm, imageUrl3: e.target.value })} />

                                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                                        {productForm.imageUrl && <img src={productForm.imageUrl} className="h-16 w-16 rounded object-cover shadow-sm bg-white" alt="preview1" />}
                                        {productForm.imageUrl2 && <img src={productForm.imageUrl2} className="h-16 w-16 rounded object-cover shadow-sm bg-white" alt="preview2" />}
                                        {productForm.imageUrl3 && <img src={productForm.imageUrl3} className="h-16 w-16 rounded object-cover shadow-sm bg-white" alt="preview3" />}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pb-2">
                                    <label className="flex items-center gap-2 font-bold text-xs cursor-pointer border p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={productForm.trending} onChange={e => setProductForm({ ...productForm, trending: e.target.checked })} className="w-4 h-4 accent-indigo-600 rounded" />
                                        🔥 Trending
                                    </label>
                                    <label className="flex items-center gap-2 font-bold text-xs cursor-pointer border p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={productForm.offer} onChange={e => setProductForm({ ...productForm, offer: e.target.checked })} className="w-4 h-4 accent-pink-600 rounded" />
                                        💸 Live Offer
                                    </label>
                                    <label className="flex items-center gap-2 font-bold text-xs cursor-pointer border p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={productForm.festivalOffer} onChange={e => setProductForm({ ...productForm, festivalOffer: e.target.checked })} className="w-4 h-4 accent-orange-600 rounded" />
                                        ✨ Festival
                                    </label>
                                    <label className="flex items-center gap-2 font-bold text-xs cursor-pointer border p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                        <input type="checkbox" checked={productForm.newArrival} onChange={e => setProductForm({ ...productForm, newArrival: e.target.checked })} className="w-4 h-4 accent-green-600 rounded" />
                                        🆕 New Arrival
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Description</label>
                                    <textarea className="w-full border p-3 rounded-lg bg-gray-50" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white font-bold p-3 rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-transform active:scale-95">
                                    {editingId ? "Update Product" : "Save Product"}
                                </button>
                                {editingId && (
                                    <button type="button" onClick={() => { setEditingId(null); setProductForm({ name: "", price: "", description: "", imageUrl: "", imageUrl2: "", imageUrl3: "", category: "Mobile & Accessories", trending: false, offer: false, festivalOffer: false, newArrival: false }) }} className="w-full bg-gray-200 text-gray-800 font-bold p-3 rounded-lg mt-2 hover:bg-gray-300">
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-h-[800px] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-6">Product Catalog</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {products.map(p => (
                                    <div key={p.id} className="border p-4 rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow relative">
                                        <span className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-[10px] uppercase font-bold px-2 py-1 rounded-sm">{p.category || 'Uncategorized'}</span>
                                        <img src={p.imageUrl || "https://via.placeholder.com/80"} className="w-20 h-20 rounded-lg object-contain bg-gray-50" alt={p.name} />
                                        <div className="flex-1 mt-4">
                                            <h4 className="font-bold pr-16 line-clamp-2 leading-tight">{p.name}</h4>
                                            <p className="text-indigo-600 font-bold mt-1 flex items-center gap-2">
                                                ₹{p.price.toLocaleString('en-IN')}
                                                {p.trending && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded uppercase tracking-wider">Hot</span>}
                                                {p.offer && <span className="text-[10px] bg-pink-100 text-pink-600 px-1 rounded uppercase tracking-wider">Offer</span>}
                                                {p.festivalOffer && <span className="text-[10px] bg-orange-100 text-orange-600 px-1 rounded uppercase tracking-wider">Festive</span>}
                                                {p.newArrival && <span className="text-[10px] bg-green-100 text-green-600 px-1 rounded uppercase tracking-wider">New</span>}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <button onClick={() => editProduct(p)} className="p-2 bg-gray-100 rounded hover:bg-indigo-100 hover:text-indigo-600"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => deleteProduct(p.id)} className="p-2 bg-red-50 text-red-500 rounded hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tickets tab content removed */}
            </div>
        </div>
    );
}

export default Admin;
