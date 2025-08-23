"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AlertCircle, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""); // Remove trailing slash if any
const COLORS = ["#A3E635", "#4D7C0F"];

const UserDataDisplay = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [revenueData, setRevenueData] = useState([]);
  const [profitMargin, setProfitMargin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchUserData = useCallback(async (userId) => {
    if (!API_URL) {
      console.error("API_URL is not defined.");
      setFetchError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError(false);
    try {
      const response = await fetch(`${API_URL}/predictRevenue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId }),
      });
      if (!response.ok) {
        console.error("Server Error:", await response.text());
        setFetchError(true);
        return;
      }
      const responseData = await response.json();
      if (!responseData) {
        setFetchError(true);
        return;
      }
      setRevenueData(responseData.revenue
        ? Object.keys(responseData.revenue).map((year) => ({
            year: Number(year),
            revenue: responseData.revenue[year],
          }))
        : []);
      setProfitMargin(responseData.profit_margin ?? null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchUserData(user.id);
    }
  }, [isLoaded, user?.id]);

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white flex flex-col items-center">
       <div className="self-start text-gray-400 text-sm mb-4 flex items-center space-x-1">
        <Link href="/Dashboard" className="hover:text-lime-400 transition">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-lime-400">Profile</span>
      </div>
      <h2 className="text-3xl font-bold mb-8 text-center">Business Insights</h2>
      {fetchError && (
        <div className="bg-red-600 text-white p-4 rounded-lg flex items-center gap-2 w-full max-w-md mb-6">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to fetch data. Please try again later.</span>
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center w-full h-80">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-white"></div>
        </div>
      ) : (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Revenue Prediction</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A3E635" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#A3E635" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="year" tick={{ fill: "#ccc" }} />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip contentStyle={{ backgroundColor: "#222", borderRadius: "5px", color: "#fff" }} />
                <Area type="monotone" dataKey="revenue" stroke="#A3E635" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Profit Chart */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Profit Margin</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={[
                    { name: `Profit (${Math.round(profitMargin * 100) / 100}%)`, value: Math.round(profitMargin * 100) / 100 },
                    { name: `Remaining (${Math.round((100 - profitMargin) * 100) / 100}%)`, value: Math.round((100 - profitMargin) * 100) / 100 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "5px", color: "#000" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDataDisplay;
