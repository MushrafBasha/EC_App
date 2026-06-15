import React, { useEffect, useState } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Zap, ShieldCheck, Truck, ArrowRight, MessageSquare, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const validImages = images.filter(Boolean);

  useEffect(() => {
    let interval;
    if (isHovered && validImages.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % validImages.length);
      }, 1500);
    } else {
      setIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, validImages.length]);

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        <motion.img
          key={index}
          initial={{ opacity: 0.5, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0.5, x: -20 }}
          transition={{ duration: 0.4 }}
          src={validImages[index] || "https://via.placeholder.com/300"}
          alt="product slide"
          className="w-full h-full object-contain mix-blend-multiply absolute top-0 left-0"
          onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=No+Image" }}
        />
      </AnimatePresence>
      {validImages.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-white/50 backdrop-blur px-2 py-1 rounded-full">
          {validImages.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-indigo-600' : 'bg-gray-400'}`} />
          ))}
        </div>
      )}
    </div>
  );
};

const AdCarousel = () => {
  const navigate = useNavigate();
  const ads = [
    { title: "Grand Festival Sale", sub: "Up to 50% Off on Electronics", path: "/festival", img: "/ads/festival.png" },
    { title: "Daily Deals", sub: "Best Prices Guaranteed", path: "/offers", img: "/ads/offers.png" },
    { title: "Trending 2026", sub: "Stay Ahead of the Curve", path: "/trending", img: "/ads/trending.png" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[200px] sm:h-[300px] mb-12 rounded-3xl overflow-hidden shadow-2xl group border border-white/10">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.8, ease: "anticipate" }}
          className="absolute inset-0 cursor-pointer"
          onClick={() => navigate(ads[currentIndex].path)}
        >
          <img 
            src={ads[currentIndex].img} 
            alt={ads[currentIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-indigo-600 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest w-max mb-4 shadow-lg shadow-indigo-600/50"
            >
              Exclusive Advertisement
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-5xl font-black text-white mb-2 sm:mb-4 tracking-tighter"
            >
              {ads[currentIndex].title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-xl text-gray-300 font-medium max-w-md"
            >
              {ads[currentIndex].sub}
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-white text-black px-6 py-2 rounded-xl font-bold text-sm w-max hover:bg-gray-200 transition-colors shadow-xl"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Dots */}
      <div className="absolute bottom-6 right-12 flex gap-2 z-20">
        {ads.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-500 ${currentIndex === i ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

function Products({ filterType }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // For Reviews Modal
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  const userId = localStorage.getItem("user");
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data)).catch(err => console.log(err));
  }, []);

  const openReviews = (product) => {
    setSelectedProduct(product);
    fetchReviews(product.id);
  };

  const fetchReviews = (productId) => {
    API.get(`/reviews/product/${productId}`).then(res => setReviews(res.data)).catch(err => console.log(err));
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!userId) return alert("Please login to leave a review.");
    API.post("/reviews", {
      productId: selectedProduct.id,
      userId: userId,
      rating: newReview.rating,
      comment: newReview.comment
    }).then(() => {
      alert("Review submitted!");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews(selectedProduct.id);
    }).catch(err => {
      console.error(err);
      alert("Error submitting review. Please try again.");
    });
  };

  const addToCart = (productId) => {
    if (!userId) {
      alert("Please login first to add items to your cart.");
      return;
    }

    if (!productId) {
      console.error("Missing Product ID");
      return;
    }

    API.post(`/cart/add?userId=${encodeURIComponent(userId)}&productId=${encodeURIComponent(productId)}&quantity=1`)
      .then(() => alert("Added to cart successfully! 🎉"))
      .catch(err => {
        console.error("Add to cart failed:", err);
        alert("Error adding to cart. Please try again.");
      });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative bg-black text-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-indigo-900 opacity-90"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">

          {/* Advertisement Carousel */}
          <AdCarousel />

          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 border border-indigo-500/30">
                  New Arrival 2026
                </span>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  Level Up Your <br /><span className="text-indigo-400">Setup.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg font-light leading-relaxed">
                  Discover our premium collection of top-tier gadgets and accessories.
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/30">
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {!filterType && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-7xl mx-auto px-4 pb-12">
              {[
                { title: "Special Offers", desc: "Up to 50% Off", path: "/offers", icon: <Zap className="w-6 h-6" />, color: "from-pink-500 to-rose-600" },
                { title: "Trending Now", desc: "Most Popular Picks", path: "/trending", icon: <Star className="w-6 h-6" />, color: "from-indigo-500 to-blue-600" },
                { title: "Festival Sale", desc: "Seasonal Discounts", path: "/festival", icon: <ShieldCheck className="w-6 h-6" />, color: "from-orange-500 to-amber-600" }
              ].map((item, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(item.path)}
                  className={`relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br ${item.color} text-white text-left shadow-xl group`}
                >
                  <div className="relative z-10">
                    <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-white/80 text-sm font-medium">{item.desc}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-125 transition-transform">
                    {item.icon}
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-20 -mt-8 mx-4 md:mx-auto max-w-6xl rounded-2xl p-6 md:p-8 flex flex-wrap md:flex-nowrap justify-between gap-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Truck className="w-6 h-6" /></div>
          <div><h4 className="font-bold text-gray-900">Free Delivery</h4><p className="text-sm text-gray-500">Orders over ₹500</p></div>
        </div>
        <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><ShieldCheck className="w-6 h-6" /></div>
          <div><h4 className="font-bold text-gray-900">Secure Payment</h4><p className="text-sm text-gray-500">100% Secure Checkout</p></div>
        </div>
        <div className="w-px h-12 bg-gray-200 hidden md:block"></div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600"><Zap className="w-6 h-6" /></div>
          <div><h4 className="font-bold text-gray-900">Fast Shipping</h4><p className="text-sm text-gray-500">Same day dispatch</p></div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16 mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              {filterType === "offers" ? "Special Offers" : 
               filterType === "trending" ? "Trending Collection" :
               filterType === "festival" ? "Festival Sale Specials" :
               searchQuery.toLowerCase() === "special offers" ? "Exclusive Offers & Trending" : 
               searchQuery ? `Results for "${searchQuery}"` : "New Arrivals"}
            </h2>
            <p className="text-gray-500 mt-2 font-medium">
              {filterType === "offers" ? "Grab the best deals before they're gone" : 
               filterType === "trending" ? "Explore what's hot and popular right now" :
               filterType === "festival" ? "Celebrate with our exclusive festive discounts" :
               searchQuery.toLowerCase() === "special offers" ? "Our most popular deals and handpicked favorites" : 
               "Handpicked products just for you"}
            </p>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["All", "Mobile & Accessories", "Laptop & Accessories", "Audio", "Fashion", "Home", "Appliances", "Furniture", "Beauty", "Sports", "Other"].map(cat => (
            <button
              key={cat}
              onClick={() => {
                if (cat === "All") navigate("/");
                else navigate(`/?search=${encodeURIComponent(cat)}`);
              }}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-colors border ${(searchQuery.toLowerCase() === cat.toLowerCase() || (searchQuery === "" && cat === "All"))
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Loading premium products...</p>
            <p className="text-sm mt-2">If none appear, please add some via the Admin Dashboard.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products
              .filter(p => {
                if (filterType === "offers") return p.offer;
                if (filterType === "trending") return p.trending;
                if (filterType === "festival") return p.festivalOffer;

                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                if (query === "offers" || query === "special offers") return p.offer || p.trending;
                if (query === "trending") return p.trending;
                return (
                  p.name.toLowerCase().includes(query) ||
                  (p.description && p.description.toLowerCase().includes(query)) ||
                  (p.category && p.category.toLowerCase().includes(query))
                );
              })
              .map((p, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] bg-white flex items-center justify-center p-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>

                    <ImageSlider images={[p.imageUrl, p.imageUrl2, p.imageUrl3]} />

                    {/* Highlights & Badges */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
                      {p.trending && <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Zap className="w-3 h-3" /> Trending</span>}
                      {p.offer && <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1"><Star className="w-3 h-3" /> Special Offer</span>}
                    </div>

                    {/* Reviews Button Overlay */}
                    <button onClick={() => openReviews(p)} className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0" title="View Reviews">
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight mb-2">{p.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>

                    <div className="flex items-center mb-4 gap-1 cursor-pointer" onClick={() => openReviews(p)}>
                      <div className="flex text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 fill-current" />
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-xs text-indigo-600 font-semibold ml-1 hover:underline">Reviews</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-2xl font-black text-gray-900 tracking-tight">₹{p.price.toLocaleString('en-IN')}</div>
                      <button
                        className="bg-gray-900 hover:bg-indigo-600 text-white p-3 rounded-xl transition-colors shadow-lg shadow-gray-200 hover:shadow-indigo-200"
                        onClick={() => addToCart(p.id)}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Reviews Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></motion.div>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:bg-gray-100 p-2 rounded-full transition-colors"><X className="w-6 h-6" /></button>

              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <img src={selectedProduct.imageUrl || "https://via.placeholder.com/100"} alt="product" className="w-20 h-20 object-contain mix-blend-multiply bg-gray-50 rounded-xl" />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h2>
                  <p className="text-indigo-600 font-bold text-xl mt-1">₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {/* Existing Reviews */}
              <div className="mb-8">
                <h3 className="font-bold text-lg mb-4">Customer Reviews</h3>
                {reviews.length === 0 ? (
                  <p className="text-gray-500 italic bg-gray-50 p-4 rounded-xl text-center">No reviews yet. Be the first!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={i} className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-900">{r.userId}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} className={`w-4 h-4 ${idx < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="bg-gray-900 p-6 rounded-2xl text-white">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Write a Review</h3>
                {userId ? (
                  <form onSubmit={submitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">Rating (1-5)</label>
                      <select className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500" value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}>
                        <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                        <option value="4">⭐⭐⭐⭐ (4/5)</option>
                        <option value="3">⭐⭐⭐ (3/5)</option>
                        <option value="2">⭐⭐ (2/5)</option>
                        <option value="1">⭐ (1/5)</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">Your Feedback</label>
                      <textarea required className="w-full bg-gray-800 border-gray-700 rounded-lg p-3 text-white focus:ring-indigo-500 min-h-[100px]" placeholder="What do you think about this product?" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })}></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-3 rounded-lg transition-colors">Submit Review</button>
                  </form>
                ) : (
                  <div className="text-center p-4 bg-gray-800 rounded-xl">
                    <p className="text-gray-400 mb-2">You must be logged in to leave feedback.</p>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Products;