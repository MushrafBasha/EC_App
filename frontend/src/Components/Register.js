import React, { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { Package, Mail, Lock, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";
import { motion } from "framer-motion";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    API.post("/auth/register", {
      email: email,
      password: password
    })
      .then(res => {
        setIsLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      })
      .catch(err => {
        setIsLoading(false);
        setError("Network error or user already exists.");
      });
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-2xl flex overflow-hidden min-h-[600px] border border-gray-100 flex-row-reverse">

        {/* Right Side - Form (Reversed layout compared to login) */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative bg-white z-10 rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          <Link to="/" className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 flex items-center gap-2 text-sm font-medium transition-colors">
            Back to Store →
          </Link>

          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left mt-8 lg:mt-0">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-6 mx-auto lg:mx-0">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-500 font-medium">Join us to experience the best shopping journey.</p>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 text-green-700 p-4 rounded-xl text-sm font-bold mb-6 border border-green-200 flex flex-col items-center gap-2 text-center"
              >
                <ShieldCheck className="w-8 h-8 text-green-500 mb-1" />
                Account Created Successfully!
                <span className="text-green-600 font-normal mt-1">Redirecting to login...</span>
              </motion.div>
            )}

            {!success && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 font-medium placeholder-gray-400"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Create Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type="password"
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-gray-900 font-medium placeholder-gray-400"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-400 font-medium flex items-center justify-between">
                    <span>Must be at least 8 characters.</span>
                    {password.length > 0 && (
                      <span className={password.length >= 8 ? "text-green-500" : "text-yellow-500"}>
                        {password.length >= 8 ? "Strong" : "Too short"}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-start mt-4">
                  <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" required />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-gray-600">
                      I agree to the <span className="text-purple-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-purple-600 hover:underline cursor-pointer">Privacy Policy</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || success}
                  className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-200 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Create Account <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 font-medium">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-purple-600 hover:text-purple-500 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Left Side - Image/Branding */}
        <div className="hidden lg:block w-1/2 bg-purple-900 relative overflow-hidden">
          {/* Abstract pattern */}
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 to-blue-900/90 mix-blend-multiply"></div>

          <img
            src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop"
            alt="Shopping Context"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
          />

          <div className="relative h-full flex flex-col justify-between p-16 text-white text-opacity-90 z-20">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
              <Package className="w-6 h-6" /> AuraShop
            </div>

            <div>
              <div className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur text-purple-200 text-sm font-semibold mb-6 border border-white/20">
                Exclusive Benefits
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-6 leading-tight">
                Unlock a world of premium products and exclusive offers.
              </h3>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-purple-100 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">✓</div>
                  Early access to new tech drops
                </li>
                <li className="flex items-center gap-3 text-purple-100 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">✓</div>
                  Free express shipping on all orders
                </li>
                <li className="flex items-center gap-3 text-purple-100 font-medium">
                  <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">✓</div>
                  Extended 60-day return policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;