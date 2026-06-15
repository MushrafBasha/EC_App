import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, Menu, User, LogOut, Package, Globe, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../AppContext";

function Navbar() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { lang, setLang, loct, requestLocation, t } = useContext(AppContext);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/`);
    }
  };

  return (
    <>
      <nav className="dark-glass sticky top-0 z-50 text-white shadow-2xl shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 lg:gap-8">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl group-hover:scale-105 transition-transform">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 hidden sm:block tracking-tight">
                AuraShop
              </span>
            </Link>

            {/* Search Bar & Location */}
            <div className="flex-1 max-w-3xl hidden md:flex items-center gap-4">
              <button onClick={requestLocation} className="hidden lg:flex items-center gap-1 text-sm font-medium hover:text-indigo-400 group flex-shrink-0">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <div className="text-left leading-tight hidden xl:block">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{t("location")}</p>
                  <p className="font-bold truncate max-w-[120px]">{loct}</p>
                </div>
              </button>
              <form onSubmit={handleSearch} className="relative w-full group">
                <input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 text-white px-5 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder-gray-400 pr-14"
                />
                <button type="submit" className="absolute right-1 top-1 bottom-1 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-colors flex items-center justify-center">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-6">

              {/* Language Selector */}
              <button
                onClick={() => {
                  const langs = ['en', 'ta', 'ml', 'hi', 'te'];
                  const currentIndex = langs.indexOf(lang);
                  setLang(langs[(currentIndex + 1) % langs.length]);
                }}
                className="hidden lg:flex items-center gap-1 text-sm font-bold hover:text-indigo-400 cursor-pointer transition-colors"
                title="Change Language"
              >
                <Globe className="w-5 h-5" /> {lang.toUpperCase()}
              </button>

              {/* Help & Queries link removed */}

              {/* Account Dropdown */}
              {userId ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-3 hover:text-indigo-400 transition-colors py-2 group">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30 group-hover:border-indigo-400 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left leading-tight hidden xl:block">
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{t("welcome")}</p>
                      <p className="text-sm font-bold truncate max-w-[120px]">{userId.split('@')[0]}</p>
                    </div>
                  </button>
                  {/* Dropdown */}
                  <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-800 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right scale-95 group-hover:scale-100 flex flex-col overflow-hidden">
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-indigo-500/10 transition-colors text-left w-full font-bold border-b border-gray-800"
                    >
                      <Package className="w-4 h-4 text-indigo-400" />
                      My Orders
                    </Link>
                    <Link
                      to="/admin"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-indigo-400 hover:bg-indigo-500/10 transition-colors text-left w-full font-bold border-b border-gray-800"
                    >
                      <User className="w-4 h-4" />
                      {t("admin")}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left w-full font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      {t("signOut")}
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:flex items-center gap-3 hover:text-indigo-400 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 group-hover:border-indigo-400 group-hover:text-indigo-400 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Sign In</p>
                    <p className="text-sm font-semibold">Account & Lists</p>
                  </div>
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="flex items-center gap-2 hover:text-indigo-400 transition-colors relative p-2 group">
                <div className="relative group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white shadow shadow-indigo-500/50 w-3 h-3 rounded-full flex items-center justify-center border-2 border-[rgb(21,25,35)]"></span>
                </div>
                <span className="font-bold hidden sm:inline ml-1">{t("cart")}</span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 text-gray-300 hover:text-white ml-2 rounded-lg bg-gray-800/50"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 pb-4 pt-2 md:hidden">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/80 border border-gray-700 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 text-sm pl-11"
            />
            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed inset-x-0 top-[138px] sm:top-[74px] z-40 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl overflow-hidden shadow-black/50"
          >
            <div className="flex flex-col p-6 space-y-5">
              {/* Feedback & Queries mobile link removed */}
              {!userId ? (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-200 hover:text-white font-medium flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                    <User className="w-5 h-5 text-indigo-400" /> Sign In securely
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-gray-200 hover:text-white font-medium flex items-center gap-3 p-3">
                    New user? Create an account
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/my-orders" onClick={() => setIsMenuOpen(false)} className="text-gray-200 hover:text-white font-medium flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl">
                    <Package className="w-5 h-5 text-indigo-400" /> My Orders
                  </Link>
                  <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-gray-200 hover:text-white font-medium flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                    <User className="w-5 h-5 text-indigo-400" /> Admin Panel
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-400 hover:text-red-300 font-medium flex items-center gap-3 p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-left">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;