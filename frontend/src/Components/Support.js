import React, { useState, useEffect, useCallback } from "react";
import API from "../api";
import { MessageSquare, Send, ShieldCheck, Clock, CheckCircle, MessageCircle } from "lucide-react";

function Support() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const userId = localStorage.getItem("user");
    const [tickets, setTickets] = useState([]);

    const fetchTickets = useCallback(() => {
        if (!userId) return;
        API.get(`/support/user/${userId}`)
            .then(res => setTickets(res.data))
            .catch(err => console.error(err));
    }, [userId]);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!userId) return alert("Please Login to Contact Support");

        API.post("/support", {
            userEmail: userId,
            subject,
            message
        }).then(() => {
            setSuccess(true);
            setSubject("");
            setMessage("");
            fetchTickets();
        }).catch(() => alert("Error sending message"));
    };

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] py-12 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-indigo-600 p-8 text-white flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold">Feedback & Customer Queries</h1>
                        <p className="text-indigo-100 font-medium">Have a question or feedback? We'd love to hear from you.</p>
                    </div>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Query Received!</h2>
                            <p className="text-gray-500">We have received your message and will review it shortly.</p>
                            <button onClick={() => setSuccess(false)} className="mt-6 text-indigo-600 font-bold hover:text-indigo-500">
                                Submit another feedback/query
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <select
                                    className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="Order Tracking">Order Tracking</option>
                                    <option value="Returns & Refunds">Returns & Refunds</option>
                                    <option value="Payment Issue">Payment Issue</option>
                                    <option value="General Query">General Query</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full border border-gray-200 rounded-xl p-4 bg-gray-50 focus:ring-2 focus:ring-indigo-500 font-medium"
                                    placeholder="How can we assist you today?"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                                <Send className="w-5 h-5" /> Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {tickets.length > 0 && (
                <div className="max-w-3xl mx-auto mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-indigo-600" /> My Past Queries
                    </h2>
                    <div className="space-y-4">
                        {tickets.slice().reverse().map((ticket, idx) => (
                            <div key={idx} className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-gray-900 text-lg">{ticket.subject}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {ticket.status === 'RESOLVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {ticket.status}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{ticket.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Support;
