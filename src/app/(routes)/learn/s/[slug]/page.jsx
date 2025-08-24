"use client";
import { succ, success } from "../../../../../lib/successUps/success";
import Image from "next/image";
import { motion } from "framer-motion";
import { use, useState, useEffect } from "react";

export default function SuccessStoryPage({ params }) {
  const { slug } = use(params);
  const story = succ.success_stories.find(
    (s) => s.heading.toLowerCase() === decodeURIComponent(slug).toLowerCase()
  );
  const [activeTab, setActiveTab] = useState("");

  // Set first section as active by default
  useEffect(() => {
    if (story && Object.keys(story.sections).length > 0) {
      setActiveTab(Object.keys(story.sections)[0]);
    }
  }, [story]);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-gray-400">The requested success story could not be found.</p>
        </div>
      </div>
    );
  }

  const sectionKeys = Object.keys(story.sections);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={story.image}
          alt={story.heading}
          fill="true"
          className="object-cover"
          priority="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 via-60% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30"></div>
      </div>

      {/* Content Container */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-8 leading-tight">
              {story.heading}
            </h1>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-slate-800/60 backdrop-blur-sm text-gray-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50 rounded-full text-sm sm:text-base font-medium transition-all duration-300"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </motion.button>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
              {sectionKeys.map((key, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setActiveTab(key);
                    const element = document.getElementById(key);
                    if (element) {
                      const offset = 100;
                      const elementPosition = element.getBoundingClientRect().top;
                      const offsetPosition = elementPosition + window.pageYOffset - offset;
                      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                    }
                  }}
                  className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    activeTab === key
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25"
                      : "bg-slate-800/60 backdrop-blur-sm text-gray-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50"
                  }`}
                >
                  {key}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-16">
            {sectionKeys.map((key, idx) => (
              <motion.section
                key={idx}
                id={key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="scroll-mt-32"
              >
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-2">{key}</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/30 shadow-xl">
                  <p className="text-gray-300 leading-relaxed text-base sm:text-lg">{story.sections[key]}</p>
                </div>
              </motion.section>
            ))}
          </div>
        </div>

        {/* Other Case Studies Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Explore Other Success Stories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {success.success_stories
              .filter((s) => s.heading !== story.heading)
              .map((s, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-2xl overflow-hidden shadow-xl cursor-pointer group bg-slate-800/30 backdrop-blur-sm border border-slate-700/30"
                  onClick={() => (window.location.href = `/learn/s/${encodeURIComponent(s.heading)}`)}
                >
                  <div className="relative h-40 sm:h-48 w-full">
                    <img
                      src={s.image || "/placeholder.jpg"}
                      alt={s.heading}
                      fill="true"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-semibold text-white mb-2">{s.heading}</h4>
                    <p className="text-gray-300 text-sm sm:text-base">
                      {s.journey.length > 80 ? s.journey.slice(0, 80) + "..." : s.journey}
                    </p>
                    <button
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition"
                      onClick={() => (window.location.href = `/learn/success/${encodeURIComponent(s.heading)}`)}
                    >
                      Read More
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 transform origin-left z-50"
        style={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
}
