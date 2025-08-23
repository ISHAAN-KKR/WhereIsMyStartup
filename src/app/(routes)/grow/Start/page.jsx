"use client";
import React, { useState, useEffect } from "react";
import { WelcomeQues } from "../../../../lib/welcomeques"
import Reveal from "../../../_components/Reveal";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function WelcomeForm() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true); // New state for checking user
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const api = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    checkUserExists(user.id);
  }, [isLoaded, user?.id]);

  // Check if user data already exists
  const checkUserExists = async (userId) => {
    try {
      const response = await fetch(`${api}/userData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: userId }),
      });
  
      const data = await response.json();
  
      if (!data.message) {
        console.warn("No 'message' field in response:", data);
        setCheckingUser(false);
        return;
      }
  
      // Ensure `data.message` is an array before calling `.find()`
      if (Array.isArray(data.message)) {
        const financialData = data.message.find((item) => item.annual_revenue !== undefined);
        if (financialData) {
          console.log("User already has financial data, redirecting...");
          router.push("/grow/dashboard");
          return;
        }
      } else {
        console.warn("Unexpected data format for 'message':", data.message);
      }
    } catch (error) {
      console.error("Error checking user data:", error);
    }
    setCheckingUser(false); // Hide loader after checking
  };
  

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 2000);
  };

  const handleNext = () => {
    if (answers[WelcomeQues[currentIndex].question]) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      showAlert("Please answer the question before proceeding.");
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleChange = (value) => {
    setAnswers((prev) => ({ ...prev, [WelcomeQues[currentIndex].question]: value }));
  };

  const handleSubmit = async () => {
    if (!isLoaded || !user?.id) {
      showAlert("User not loaded. Please try again.");
      return;
    }

    const formattedData = {
      uid: user.id,
      industry: answers["What Industry you are in?"],
      annual_revenue: answers["What is your Annual Revenue?"],
      recurring_expenses: answers["How much is your Recurring Expenses?"],
      monthly_budget: answers["What is your Monthly budget?"],
      savings: answers["How much is your Monthly Savings ?"],
    };

    for (let key in formattedData) {
      if (!formattedData[key]) {
        showAlert(`Please provide ${key.replace(/_/g, " ")} before submitting.`);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await fetch(`${api}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await response.json();
      if (response.ok) {
        showAlert("Successfully submitted!");
        router.push("/Dashboard");
      } else {
        showAlert(result.message || "Submission failed.");
      }
    } catch (error) {
      showAlert("Error submitting form.");
      console.error("Submission error:", error);
    }
    setLoading(false);
  };

  return (
    <section className="bg-gray-50 h-screen flex items-center justify-center bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
      {alertMessage && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-lime-600 text-white px-4 py-2 rounded-md shadow-md">
          {alertMessage}
        </div>
      )}

      {/* Show Loader While Checking User */}
      {checkingUser ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-transparent border-black  rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-semibold text-gray-800">Checking your details...</p>
        </div>
      ) : (
        <div className="max-w-md text-center border-lime-900 border-2 rounded-lg p-6 bg-white/10 backdrop-blur relative">
          <h1 className="text-2xl font-extrabold sm:text-3xl mb-4">
            {WelcomeQues[currentIndex].question}
          </h1>
          {WelcomeQues[currentIndex].type === "opt" ? (
            <div className="flex flex-col gap-2">
              {WelcomeQues[currentIndex].options.map((option, index) => (
                <Reveal key={index}>
                  <button
                    onClick={() => handleChange(option)}
                    className={`px-4 py-2 rounded-md border w-full text-center transition duration-300 ${
                      answers[WelcomeQues[currentIndex].question] === option
                        ? "bg-lime-600 text-white"
                        : "border-gray-300 hover:bg-gray-200"
                    }`}
                  >
                    {option}
                  </button>
                </Reveal>
              ))}
            </div>
          ) : (
            <input
              type="text"
              value={answers[WelcomeQues[currentIndex].question] || ""}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          )}
          <div className="mt-6 flex justify-between">
            {currentIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
              >
                Previous
              </button>
            )}
            {currentIndex < WelcomeQues.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default WelcomeForm;
