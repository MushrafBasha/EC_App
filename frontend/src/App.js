import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Admin from "./Components/Admin";
// Support import removed
import AiAssistant from "./Components/AiAssistant";
import Checkout from "./Components/Checkout";
import MyOrders from "./Components/MyOrders";
import Footer from "./Components/Footer";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/offers" element={<Products filterType="offers" />} />
          <Route path="/trending" element={<Products filterType="trending" />} />
          <Route path="/festival" element={<Products filterType="festival" />} />
          {/* Support route removed */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
        <Footer />
        <AiAssistant />
      </Router>
    </AppProvider>
  );
}

export default App;