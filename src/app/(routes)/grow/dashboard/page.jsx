"use client"
import { useState, useEffect } from "react"
import {
  ShoppingCart,
  DollarSign,
  Wallet,
  PiggyBank,
  User,
  BarChart3,
  LogOut,
  Search,
  X,
  BookText,
  TrendingUp,
  Shield,
  Target,
  ChevronRight,
  Download,
  FileText,
  Sparkles,
} from "lucide-react"
import { SignOutButton, useUser } from "@clerk/nextjs"
import Reveal from "../../../_components/Reveal"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const SkeletonLoader = () => (
  <div className="animate-pulse p-6 bg-gradient-to-br from-primary-1500 to-primary-1400 min-h-screen">
    <div className="h-12 w-60 bg-primary-1200 rounded-xl mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-6 bg-primary-1300/50 backdrop-blur-sm rounded-2xl border border-primary-1100/30">
            <div className="h-6 w-40 bg-primary-1100 rounded-lg mb-3"></div>
            <div className="h-8 w-28 bg-primary-1000 rounded-lg"></div>
          </div>
        ))}
    </div>
  </div>
)

const NoDataFound = () => (
  <div className="p-6 bg-gradient-to-br from-primary-1500 to-primary-1400 min-h-screen text-white flex items-center justify-center">
    <div className="text-center bg-primary-1300/30 backdrop-blur-sm p-12 rounded-3xl border border-primary-1100/30">
      <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <Shield className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-3xl font-bold text-primary-200 mb-4">No Data Found</h2>
      <p className="text-primary-400 mb-8 text-lg">Please log in to view your financial dashboard.</p>
      <a href="/sign-in">
        <button className="bg-gradient-to-r from-primary-500 to-brand-500 text-white px-8 py-4 rounded-xl hover:from-primary-600 hover:to-brand-600 transition-all duration-300 font-semibold text-lg shadow-lg shadow-primary-glow">
          Log In
        </button>
      </a>
    </div>
  </div>
)

const Page = () => {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [prompt, setPrompt] = useState("")
  const [isFetching, setIsFetching] = useState(false)

  const generatePDF = async () => {
    if (!user) {
      alert("User not authenticated")
      return
    }

    const mail = user.emailAddresses[0]?.emailAddress
    const uname = user.firstName

    try {
      const response = await fetch(`${API_URL}/pdfGenerator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mail,
          prompt: [
            {
              role: "system",
              content: String.raw`
Dont Give Anything else except the report data. You are Arthashastra, an advanced AI-driven Business Cost Planner.

### Objective:
Your role is to generate structured and professional financial reports based on the user's financial data. Your responses should be formatted in a way that can be directly converted into a PDF document with clear styling.

---

# Business Financial Report  

---

## Financial Overview  

| Metric              | Value ($) |
|---------------------|-----------|
| *Annual Revenue*    | ${userData?.annual_revenue || "N/A"} |
| *Recurring Expenses*| ${userData?.recurring_expenses || "N/A"} |
| *Monthly Budget*    | ${userData?.monthly_budget || "N/A"} |
| *Savings*           | ${userData?.savings || "N/A"} |

---

## Cost Optimization Strategies  
-  Identify areas where expenses can be reduced without affecting productivity  
-  Automate routine financial processes to reduce operational costs  
-  Negotiate better deals with vendors to lower fixed expenses  

---

## Profitability Forecast  
-  *Projected Revenue Growth:* [Trend insights]  
-  *Expense Management:* [Expense reduction insights]  
-  *Savings Potential:* [Adjusted savings potential]  

---

##  Risk Management Insights  
-  *Potential Risks:* [Risk list]  
-  *Mitigation Strategies:* [Practical solutions]  

---

##  Actionable Recommendations  
✔ Optimize cash flow by balancing revenue & expenses  
✔ Invest strategically in growth areas  
✔ Maintain emergency savings for unforeseen challenges  

---

## Final Notes  
> This report provides an *in-depth financial analysis* tailored to the user's business needs.  
> Insights are *data-driven, designed to support **cost optimization, strategic planning, and long-term stability.*  

---

 *End of Report* 
        `,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          uname,
        }),
      })

      if (response.ok) {
        alert("PDF generation request sent successfully!")
        setShowModal(false)
        setPrompt("")
      } else {
        alert("Failed to generate PDF.")
      }
    } catch (error) {
      alert("Error connecting to the server.")
    }
  }

  useEffect(() => {
    if (!isLoaded || !user?.id) return
    fetchUserData(user.id)
  }, [isLoaded, user?.id])

  const fetchUserData = async (userId) => {
    setIsFetching(true)
    try {
      console.log("Fetching user data for UID:", userId)
      const response = await fetch(`${API_URL}/userData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId }),
      })

      if (!response.ok) {
        console.error("Server Error:", await response.text())
        setIsFetching(false)
        return
      }

      const data = await response.json()
      console.log("Full API Response:", data)

      if (!data.message || data.message.length === 0) {
        setIsFetching(false)
        return
      }

      const financialData = data.message.filter((item) => item.annual_revenue !== undefined)
      if (financialData.length === 0) {
        setIsFetching(false)
        return
      }

      const latestFinancialData = financialData[financialData.length - 1]
      setUserData(latestFinancialData)
      setIsFetching(false)
    } catch (error) {
      console.error("Error fetching user details:", error)
      setIsFetching(false)
    }
  }

  if (!isLoaded || isFetching) return <SkeletonLoader />
  if (!user || !userData) return <NoDataFound />
  console.log(userData)
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-1500 via-primary-1400 to-primary-1300">
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1 ml-12">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
              Welcome back,{" "}
              <span className="text-transparent bg-gradient-to-r from-primary-300 to-brand-400 bg-clip-text">
                {user?.username || "Guest"}
              </span>
              !
            </h1>
            <p className="text-primary-400 text-base">Here's your financial overview</p>
          </div>
          <SignOutButton>
            <button className="flex items-center bg-gradient-to-r from-red-500/90 to-red-600/90 px-4 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 text-white font-medium text-sm shadow-sm hover:shadow-md">
              <LogOut className="mr-2 w-4 h-4" /> Logout
            </button>
          </SignOutButton>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              title: "Annual Revenue",
              value: `₹${userData?.annual_revenue ?? "0"}`,
              icon: DollarSign,
              gradient: "from-emerald-500 to-emerald-600",
              bgGradient: "from-emerald-500/10 to-emerald-600/5",
              trend: "+12.5%",
            },
            {
              title: "Monthly Budget",
              value: `₹${userData?.monthly_budget ?? "0"}`,
              icon: Wallet,
              gradient: "from-primary-500 to-brand-500",
              bgGradient: "from-primary-500/10 to-brand-500/5",
              trend: "+5.2%",
            },
            {
              title: "Recurring Expenses",
              value: `₹${userData?.recurring_expenses ?? "0"}`,
              icon: ShoppingCart,
              gradient: "from-orange-500 to-red-500",
              bgGradient: "from-orange-500/10 to-red-500/5",
              trend: "-3.1%",
            },
            {
              title: "Savings",
              value: `₹${userData?.savings ?? "0"}`,
              icon: PiggyBank,
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-500/10 to-pink-500/5",
              trend: "+8.7%",
            },
          ].map(({ title, value, icon: Icon, gradient, bgGradient, trend }, index) => (
            <div
              key={index}
              className={`relative p-5 bg-gradient-to-br ${bgGradient} backdrop-blur-sm rounded-2xl border border-primary-1100/20 hover:border-primary-1000/40 transition-all duration-300 group overflow-hidden shadow-sm hover:shadow-lg`}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-gradient-to-r ${gradient} shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium bg-primary-1200/40 px-2 py-1 rounded-lg text-primary-200">
                    {trend}
                  </span>
                </div>
                <h3 className="text-primary-300 font-medium mb-2 text-sm">{title}</h3>
                <Reveal>
                  <p className="text-2xl lg:text-2xl font-bold text-white mb-1">{value}</p>
                </Reveal>
                <div className="h-1 w-full bg-primary-1200/30 rounded-full mt-3">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
                    style={{ width: `${Math.min(100, parseInt(value.replace('₹', '')) / 5000 * 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12"></div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <a href="/UpdateProfile" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3.5 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm">
              <User className="mr-2 w-4 h-4" /> Update Profile
            </button>
          </a>
          <a href="/grow/Analytics" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3.5 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-medium shadow-sm hover:shadow-md text-sm">
              <BarChart3 className="mr-2 w-4 h-4" /> See Analytics
            </button>
          </a>
        </div>

        {/* AI Assistant Search */}
        <div className="flex items-center justify-center mb-8">
          <a href="/grow/Chanakya" className="w-full max-w-2xl">
            <div className="relative w-full bg-gradient-to-r from-primary-100 to-primary-50 rounded-2xl h-14 text-primary-1400 text-lg font-semibold group overflow-hidden shadow-sm hover:shadow-lg border border-primary-200/50 transition-all duration-300 hover:-translate-y-0.5">
              <div className="absolute left-1 top-1 bottom-1 bg-gradient-to-r from-primary-500 to-brand-500 rounded-xl flex items-center justify-center w-12 group-hover:w-14 transition-all duration-500 ease-out">
                <Search className="text-white w-5 h-5" />
              </div>
              <div className="flex items-center justify-center h-full pl-14 pr-4">
                <Target className="mr-3 w-5 h-5 text-primary-600" />
                <span className="flex-1">Ask Chanakya AI Assistant</span>
                <ChevronRight className="w-5 h-5 text-primary-800 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </a>
        </div>

        {/* Report Generator Card */}
        <div className="bg-gradient-to-r from-primary-1300/40 to-primary-1200/20 backdrop-blur-sm rounded-3xl border border-primary-1100/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 mb-8">
          <div className="flex flex-col lg:flex-row">
            {/* Content */}
            <div className="flex-1 p-6 lg:p-8">
              <div className="flex items-start mb-6">
                <div className="bg-gradient-to-r from-primary-500 to-brand-500 p-3 rounded-xl mr-4 shadow-md">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Business Cost{" "}
                    <span className="text-transparent bg-gradient-to-r from-primary-300 to-brand-400 bg-clip-text">
                      Planner
                    </span>
                  </h2>
                  <p className="text-primary-300 text-base leading-relaxed max-w-md">
                    Generate comprehensive financial reports with AI-powered insights tailored to your business goals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center bg-gradient-to-r from-primary-500 to-brand-500 text-white px-6 py-3.5 rounded-xl hover:from-primary-600 hover:to-brand-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span>Generate Report</span>
              </button>
            </div>

            {/* Image */}
            <div className="lg:w-2/5 h-64 lg:h-auto flex items-center justify-center p-4">
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-primary-1100/30 shadow-inner">
                <img
                  src="/header.gif"
                  loading="lazy"
                  alt="Business Analytics Visualization"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-1300/10 to-primary-1200/5"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gradient-to-r from-primary-1300/30 to-primary-1200/10 backdrop-blur-sm rounded-3xl border border-primary-1100/20 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-brand-400" />
            Financial Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Review expenses weekly to identify savings opportunities",
              "Set aside 10-15% of revenue for emergency funds",
              "Consider automating recurring payments to avoid late fees"
            ].map((tip, index) => (
              <div key={index} className="bg-primary-1200/20 p-4 rounded-xl border border-primary-1100/20">
                <p className="text-primary-300 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
            <div className="bg-gradient-to-br from-primary-1300 to-primary-1400 p-6 rounded-2xl shadow-2xl border border-primary-1100/30 w-full max-w-lg">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Download className="w-5 h-5 mr-2 text-brand-400" />
                  Generate Financial Report
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-primary-1200/50 rounded-lg transition-colors"
                >
                  <X className="text-primary-300 w-5 h-5" />
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-primary-300 font-medium mb-2 text-sm">
                  Describe your business question or goal:
                </label>
                <textarea
                  placeholder="e.g., How can I optimize my monthly expenses while maintaining growth targets?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-primary-1200/50 text-white rounded-xl border border-primary-1100/30 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-primary-500 resize-none text-sm"
                />
              </div>

              <button
                onClick={generatePDF}
                className={`w-full p-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                  prompt.trim() === ""
                    ? "bg-primary-1100/50 text-primary-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-500 to-brand-500 text-white hover:from-primary-600 hover:to-brand-600 shadow-md hover:shadow-lg"
                }`}
                disabled={prompt.trim() === ""}
              >
                <FileText className="w-5 h-5 mr-2" />
                Generate Financial Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page