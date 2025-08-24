"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { AlertCircle, ChevronRight, TrendingUp, DollarSign, PieChart as PieChartIcon, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, ""); // Remove trailing slash if any
const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const UserDataDisplay = () => {
  const { user, isLoaded } = useUser();
  const [revenueData, setRevenueData] = useState([]);
  const [profitMargin, setProfitMargin] = useState(null);
  const [expenseData, setExpenseData] = useState([]);
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
      
      // Process revenue data
      setRevenueData(responseData.revenue
        ? Object.keys(responseData.revenue).map((year) => ({
            year: Number(year),
            revenue: responseData.revenue[year],
          }))
        : []);
      
      // Process profit margin
      setProfitMargin(responseData.profit_margin ?? null);
      
      // Generate sample expense data (in a real app, this would come from the API)
      setExpenseData([
        { category: "Operations", amount: 42000, trend: "up" },
        { category: "Marketing", amount: 28000, trend: "down" },
        { category: "R&D", amount: 35000, trend: "up" },
        { category: "Administration", amount: 22000, trend: "stable" },
        { category: "Other", amount: 15000, trend: "up" },
      ]);
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
  }, [isLoaded, user?.id, fetchUserData]);

  // Calculate growth percentage for the revenue chart
  const calculateGrowth = () => {
    if (revenueData.length < 2) return 0;
    const firstYear = revenueData[0].revenue;
    const lastYear = revenueData[revenueData.length - 1].revenue;
    return ((lastYear - firstYear) / firstYear) * 100;
  };

  const growthPercentage = calculateGrowth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-1500 to-primary-1400 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="self-start text-primary-300 text-sm mb-6 flex items-center space-x-1">
          <Link href="/Dashboard" className="hover:text-brand-400 transition">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-brand-400">Analytics</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Business Insights</h1>
          <p className="text-primary-300">Analyze your financial performance and growth trends</p>
        </div>

        {fetchError && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-4 rounded-xl flex items-center gap-3 w-full mb-6 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span>Failed to fetch data. Please try again later.</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center w-full h-80">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-primary-1300/50 backdrop-blur-sm p-5 rounded-2xl border border-primary-1100/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${growthPercentage >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {growthPercentage >= 0 ? <ArrowUp className="w-3 h-3 inline mr-1" /> : <ArrowDown className="w-3 h-3 inline mr-1" />}
                    {Math.abs(growthPercentage).toFixed(1)}%
                  </span>
                </div>
                <h3 className="text-primary-300 text-sm mb-1">Revenue Growth</h3>
                <p className="text-2xl font-bold text-white">
                  ₹{revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue.toLocaleString() : '0'}
                </p>
              </div>

              <div className="bg-primary-1300/50 backdrop-blur-sm p-5 rounded-2xl border border-primary-1100/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-purple-500/10">
                    <PieChartIcon className="w-5 h-5 text-purple-400" />
                  </div>
                </div>
                <h3 className="text-primary-300 text-sm mb-1">Profit Margin</h3>
                <p className="text-2xl font-bold text-white">
                  {profitMargin ? `${profitMargin.toFixed(1)}%` : 'N/A'}
                </p>
              </div>

              <div className="bg-primary-1300/50 backdrop-blur-sm p-5 rounded-2xl border border-primary-1100/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-pink-500/10">
                    <TrendingUp className="w-5 h-5 text-pink-400" />
                  </div>
                </div>
                <h3 className="text-primary-300 text-sm mb-1">Projection Period</h3>
                <p className="text-2xl font-bold text-white">
                  {revenueData.length > 0 ? `${revenueData[0].year} - ${revenueData[revenueData.length - 1].year}` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <div className="bg-primary-1300/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-1100/30">
                <div className="flex items-center mb-6">
                  <div className="bg-indigo-500/10 p-2 rounded-lg mr-3">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Revenue Projection</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis 
                      dataKey="year" 
                      tick={{ fill: "#9CA3AF" }} 
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fill: "#9CA3AF" }} 
                      axisLine={false}
                      tickFormatter={(value) => `₹${value / 1000}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(17, 24, 39, 0.8)", 
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)", 
                        borderRadius: "0.5rem",
                        color: "#fff" 
                      }} 
                      formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#6366F1" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Profit Chart */}
              <div className="bg-primary-1300/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-1100/30">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/10 p-2 rounded-lg mr-3">
                    <PieChartIcon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Profit Distribution</h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: `Profit (${Math.round(profitMargin * 100) / 100}%)`, value: Math.round(profitMargin * 100) / 100 },
                        { name: `Expenses (${Math.round((100 - profitMargin) * 100) / 100}%)`, value: Math.round((100 - profitMargin) * 100) / 100 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      <Cell fill="#6366F1" />
                      <Cell fill="#4B5563" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "rgba(17, 24, 39, 0.8)", 
                        backdropFilter: "blur(4px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)", 
                        borderRadius: "0.5rem",
                        color: "#fff" 
                      }} 
                      formatter={(value) => [`${value}%`, ""]}
                    />
                    <Legend 
                      iconType="circle" 
                      iconSize={10}
                      wrapperStyle={{ fontSize: '12px', color: '#9CA3AF' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Insights Section */}
            <div className="mt-8 bg-primary-1300/50 backdrop-blur-sm p-6 rounded-2xl border border-primary-1100/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-400" />
                Key Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary-1200/30 rounded-xl">
                  <h4 className="font-medium text-brand-400 mb-2">Revenue Growth</h4>
                  <p className="text-primary-300 text-sm">
                    Your business shows a {growthPercentage >= 0 ? 'positive' : 'negative'} growth trend of {Math.abs(growthPercentage).toFixed(1)}% over the projected period.
                  </p>
                </div>
                <div className="p-4 bg-primary-1200/30 rounded-xl">
                  <h4 className="font-medium text-brand-400 mb-2">Profitability</h4>
                  <p className="text-primary-300 text-sm">
                    With a {profitMargin?.toFixed(1)}% profit margin, your business is {profitMargin > 20 ? 'highly profitable' : profitMargin > 10 ? 'moderately profitable' : 'operating with thin margins'}.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDataDisplay;