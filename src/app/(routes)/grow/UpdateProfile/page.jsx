"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, History, Save, ChevronRight, TrendingUp, DollarSign, Wallet, PiggyBank } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpdatePage = () => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;

    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/userData`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.id }),
        });

        if (!response.ok) throw new Error("Failed to fetch user data");
        const data = await response.json();
        const financialData = data.message.filter((item) => item.annual_revenue !== undefined);

        if (financialData.length > 0) {
          setUserData(financialData[financialData.length - 1]);
          setHistory(financialData.slice(0, -1).reverse());
        }
      } catch (error) {
        setAlert({ message: "Failed to fetch user data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user?.id]);

  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!userData || !user?.id) {
      setAlert({ message: "User data is incomplete or missing.", type: "error" });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...userData, uid: user.id, industry: "" }),
      });

      if (!response.ok) throw new Error("Failed to update user data");
      setAlert({ message: "Data updated successfully!", type: "success" });
      setHistory((prev) => [userData, ...prev]);
    } catch {
      setAlert({ message: "Error updating data. Please try again.", type: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-primary-1500 to-primary-1400">
        <div className="flex flex-col items-center">
          <Loader2 className="animate-spin w-12 h-12 text-brand-400 mb-4" />
          <p className="text-primary-300">Loading your financial data...</p>
        </div>
      </div>
    );

  // Icon mapping for each financial field
  const fieldIcons = {
    annual_revenue: <DollarSign className="w-5 h-5" />,
    monthly_budget: <Wallet className="w-5 h-5" />,
    recurring_expenses: <TrendingUp className="w-5 h-5" />,
    savings: <PiggyBank className="w-5 h-5" />
  };

  // Field labels
  const fieldLabels = {
    annual_revenue: "Annual Revenue",
    monthly_budget: "Monthly Budget",
    recurring_expenses: "Recurring Expenses",
    savings: "Savings"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-1500 to-primary-1400 p-6 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="text-primary-300 text-sm mb-6 flex items-center space-x-1">
          <Link href="/grow/dashboard" className="hover:text-brand-400 transition">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-brand-400">Profile</span>
        </div>

        {/* Alert Message */}
        {alert.message && (
          <div
            className={`fixed top-5 right-5 px-4 py-3 rounded-xl shadow-lg text-white flex items-center z-50 ${
              alert.type === "success" 
                ? "bg-emerald-500/90 backdrop-blur-sm border border-emerald-400/30" 
                : "bg-red-500/90 backdrop-blur-sm border border-red-400/30"
            } transition-all duration-300 animate-fade-in`}
          >
            {alert.type === "success" ? 
              <CheckCircle className="mr-2 w-5 h-5" /> : 
              <XCircle className="mr-2 w-5 h-5" />
            }
            {alert.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-300 to-brand-400 bg-clip-text text-transparent">
            Financial Profile
          </h1>
          <p className="text-primary-300">Update your financial information to get personalized insights</p>
        </div>

        {/* Financial Input Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {["annual_revenue", "monthly_budget", "recurring_expenses", "savings"].map((name, index) => (
            <div
              key={index}
              className="bg-primary-1300/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-1100/30 hover:border-primary-1000/50 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-xl bg-brand-500/10 mr-3 text-brand-400">
                  {fieldIcons[name]}
                </div>
                <h2 className="text-primary-300 font-medium text-sm">{fieldLabels[name]}</h2>
              </div>
              
              <div className="flex items-center">
                <span className="text-primary-400 mr-2">₹</span>
                <input
                  type="number"
                  name={name}
                  value={userData?.[name] || ""}
                  onChange={handleChange}
                  className="w-full bg-primary-1200/30 border border-primary-1100/30 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all"
                  placeholder="Enter amount"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Update Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-brand-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Profile
              </>
            )}
          </button>
        </div>

        {/* Update History */}
        {history.length > 0 && (
          <div className="bg-primary-1300/50 backdrop-blur-sm rounded-2xl border border-primary-1100/30 p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
              <History className="w-5 h-5 mr-2 text-brand-400" />
              Update History
            </h3>
            <div className="space-y-4">
              {history.map((entry, index) => (
                <div key={index} className="bg-primary-1200/30 p-4 rounded-xl border border-primary-1100/20">
                  <p className="text-primary-400 text-sm mb-3">
                    Updated on: {new Date(entry.timestamp || Date.now()).toLocaleString()}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["annual_revenue", "monthly_budget", "recurring_expenses", "savings"].map((key) => (
                      <div key={key} className="text-center">
                        <p className="text-primary-300 text-xs mb-1">{fieldLabels[key]}</p>
                        <p className="text-white font-semibold">₹{entry[key]?.toLocaleString() || "0"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {history.length === 0 && (
          <div className="text-center py-12 text-primary-300">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No update history yet. Make your first update to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdatePage;