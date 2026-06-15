import React, { useState, useEffect, useRef } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I am AuraShop AI. How can I resolve your doubts today?", sender: "ai" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");

    // Simple AI heuristic logic for doubts
    setTimeout(() => {
      let aiReply = "I'm sorry, I'm having trouble analyzing that. Please contact support!";
      const lower = userMessage.toLowerCase();
      
      if (lower.includes("price") || lower.includes("cost") || lower.includes("expensive")) {
        aiReply = "Our products are dynamically priced to give you the best market value! Check out the 'Trending Items' section for our latest deals.";
      } else if (lower.includes("return") || lower.includes("cancel") || lower.includes("refund")) {
        aiReply = "You can easily request a return or cancellation directly from your **Orders Panel** in the Admin/User dashboard. We offer a 30-day money back guarantee.";
      } else if (lower.includes("laptop") || lower.includes("phone") || lower.includes("mobile")) {
        aiReply = "We have an excellent collection of Laptops and Mobile Accessories! You can use the category buttons on the Home Page to filter exactly what you need.";
      } else if (lower.includes("payment") || lower.includes("cod") || lower.includes("upi")) {
        aiReply = "We support 100% secure checkouts using Credit Cards, UPI, PayPal, and Cash on Delivery. You can select your preference in the Cart.";
      } else if (lower.includes("hello") || lower.includes("hi")) {
        aiReply = "Hi there! How can I help you navigate the store or resolve your doubts today?";
      }

      setMessages(prev => [...prev, { text: aiReply, sender: "ai" }]);
    }, 1000);
  };

  return (
    <>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center shadow-indigo-500/50"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 bg-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col h-96"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-800/80 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                Aura AI Support
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-200 bg-gray-900/50 flex flex-col justify-end">
              <div className="flex flex-col space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-indigo-600 text-white rounded-br-sm' 
                          : 'bg-gray-800 border border-gray-700 rounded-bl-sm'
                      }`}
                      dangerouslySetInnerHTML={{__html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}
                    />
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-800 bg-gray-900 flex-shrink-0">
              <form onSubmit={handleSend} className="relative">
                <input 
                  type="text" 
                  placeholder="Ask a doubt..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="absolute right-2 top-2 bottom-2 bg-indigo-600 disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4"/>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AiAssistant;
