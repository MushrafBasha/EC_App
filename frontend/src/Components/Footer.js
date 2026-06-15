import React from "react";
import { Link } from "react-router-dom";
import { Package, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          <div>
            <div className="flex items-center gap-2 font-bold text-2xl text-white mb-6">
              <Package className="w-8 h-8 text-indigo-500" /> AuraShop
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your premium destination for top-tier gadgets, laptops, mobiles, and exclusive accessories across the globe.
            </p>
            <div className="flex gap-4">
              <a href="#/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-white">𝕏</a>
              <a href="#/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-white">f</a>
              <a href="#/" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-indigo-600 transition-colors text-white">in</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home & Products</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">My Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-indigo-400 transition-colors">Orders & Tracking</Link></li>
              <li><Link to="/admin" className="hover:text-indigo-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Support section removed */}

          <div>
            <h3 className="font-bold text-white text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                <span>123 Tech Avenue,<br />Silicon Valley, CA 94025</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>+91 8248736007</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <span>support@aurashop.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 AuraShop eCommerce. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#/" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#/" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#/" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
