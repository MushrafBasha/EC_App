import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { Package, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    API.post("/auth/login", { email, password })
      .then(res => {
        setIsLoading(false);
        if (res.data === "Login successful") {
          localStorage.setItem("user", email);
          navigate("/");
          window.location.reload();
        } else {
          setError(res.data || "Invalid credentials");
        }
      })
      .catch(err => {
        setIsLoading(false);
        setError("Network error. Please try again.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px] border border-gray-100">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
          <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-gray-900 flex items-center gap-2 text-sm font-medium transition-colors">
            ← Back to Store
          </Link>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left mt-8 lg:mt-0">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6 mx-auto lg:mx-0">
                <Package className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome back</h2>
              <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 border border-red-100 flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {error}
              </motion.div>
            )}

            <form onSubmit={login} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium placeholder-gray-400"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                  <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-900 font-medium placeholder-gray-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium">
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Branding */}
        <div className="hidden lg:block w-1/2 bg-indigo-600 relative overflow-hidden">
          {/* Abstract pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 to-purple-800/90 mix-blend-multiply"></div>

          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1974&auto=format&fit=crop"
            alt="Shopping Context"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />

          <div className="relative h-full flex flex-col justify-between p-16 text-white text-opacity-90">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
              <Package className="w-6 h-6" /> AuraShop
            </div>

            <div>
              <div className="flex gap-1 mb-6 text-yellow-400">
                {[...Array(5)].map((_, i) => <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>)}
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-4 leading-tight">
                "The premier destination for high-end tech and lifestyle gear."
              </h3>
              <p className="text-indigo-100 font-medium">Join 50,000+ satisfied customers today.</p>

              <div className="mt-8 flex items-center gap-2 text-sm text-indigo-200 font-medium bg-white/10 w-max px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                <ShieldCheck className="w-4 h-4 text-green-400" />
                Enterprise-grade security
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;