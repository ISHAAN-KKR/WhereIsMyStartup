"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Card } from "@mui/material";
import { Loader2, CheckCircle, XCircle, History, Save, ChevronRight } from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpdatePage = () => {
  const { user, isLoaded } = useUser();
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: "", type: "" });

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
      const timer = setTimeout(() => setAlert({ message: "", type: "" }), 4000); // Auto-dismiss alert after 4 sec
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
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-white bg-gray-900">
        <Loader2 className="animate-spin w-12 h-12 text-lime-400" />
      </div>
    );

  return (
    <div className="relative p-8 min-h-screen flex flex-col items-center bg-gray-900 text-white overflow-x-hidden">
      {/* Blobs for aesthetic background */}
      <div className="absolute w-96 h-96 bg-lime-500 rounded-full blur-3xl opacity-20 top-10 left-[-100px]"></div>
      <div className="absolute w-80 h-80 bg-lime-400 rounded-full blur-3xl opacity-30 bottom-10 right-[-100px]"></div>

      {/* Breadcrumb Navigation */}
      <div className="self-start text-gray-400 text-sm mb-4 flex items-center space-x-1">
        <Link href="/Dashboard" className="hover:text-lime-400 transition">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-lime-400">Profile</span>
      </div>

      {/* Alert Message */}
      {alert.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white flex items-center transition transform ${
            alert.type === "success" ? "bg-green-500/80" : "bg-red-500/80"
          } animate-fade-in`}
        >
          {alert.type === "success" ? <CheckCircle className="mr-2" /> : <XCircle className="mr-2" />}
          {alert.message}
        </div>
      )}

      <h2 className="text-4xl font-bold mb-6 text-lime-400 drop-shadow-md">Profile</h2>

      {/* Financial Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {["annual_revenue", "monthly_budget", "recurring_expenses", "savings"].map((name, index) => (
          <Card
            key={index}
            className="p-6 flex flex-col justify-between bg-gray-800/90 shadow-2xl rounded-xl border border-lime-500 transition transform hover:scale-105 hover:shadow-lime-500/40 relative overflow-hidden"
          >
            {/* Floating Blob in Card */}
            <div className="absolute w-24 h-24 bg-lime-400 rounded-full blur-2xl opacity-20 -top-5 -left-5 -z-20"></div>
            
            <h2 className="text-lg font-semibold text-lime-600 capitalize">{name.replace("_", " ")}</h2>
            <div className="flex mt-2 z-20">
              <span className="mt-2 text-lime-400">₹</span>
              <input
                type="number"
                name={name}
                value={userData?.[name] || ""}
                onChange={handleChange}
                className="w-full p-2 text-lg rounded-lg bg-transparent border-b-2 border-lime-500 outline-none text-black placeholder-gray-400 transition "
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Update Button */}
      <button
        onClick={handleSubmit}
        className="mt-8 bg-lime-500 text-white font-bold py-3 px-8 rounded-xl text-lg shadow-lg hover:bg-lime-600 transition transform hover:scale-105 hover:shadow-lime-500/50 flex gap-2 items-center animate-bounce-once"
      >
        <Save /> Update
      </button>

      {/* Update History */}
      {history.length > 0 && (
        <div className="mt-12 w-full max-w-4xl">
          <h3 className="text-2xl font-bold text-lime-400 flex items-center">
            <History className="w-6 h-6 mr-2" /> Update History
          </h3>
          <div className="mt-4 space-y-4">
            {history.map((entry, index) => (
              <Card key={index} className="p-4 bg-gray-800/60 shadow-md rounded-xl border border-gray-700 text-white">
                <p className="text-sm text-gray-400">Updated on: {new Date(entry.timestamp).toLocaleString()}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                  {["annual_revenue", "monthly_budget", "recurring_expenses", "savings"].map((key) => (
                    <div key={key}>
                      <span className="font-bold text-black capitalize ">{key.replace("_", " ")}:</span>
                      <p className="text-lg font-semibold text-lime-500">₹{entry[key]}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePage;
