"use client";
import { wis } from "../../../../../lib/wiseUps/wise";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect,use } from "react";

export default function FailedStartupPage({ params }) {
  const resolvedParams = use(params); // unwrap the promise
  const { slug } = resolvedParams;

  // Find the section that matches the slug (startup_name)
  const story = wis.sections.find(
    (s) => s.startup_name.toLowerCase() === decodeURIComponent(slug).toLowerCase()
  );

  const [activeTab, setActiveTab] = useState("");

  // Set activeTab to the current story's startup_name
  useEffect(() => {
    if (story) {
      setActiveTab(story.startup_name);
    }
  }, [story]);

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Story Not Found</h1>
          <p className="text-gray-400">The requested startup story could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src={story.image}
          alt={story.startup_name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 via-60% to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 via-transparent to-slate-950/30"></div>
      </div>

      {/* Content Container */}
      <div className="relative -mt-32 z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-4 leading-tight">
            {story.startup_name}
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-slate-800/60 backdrop-blur-sm text-gray-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/50 rounded-full text-sm sm:text-base font-medium transition-all duration-300"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </motion.button>
        </motion.div>

        {/* Section Content */}
        <motion.section
          id={story.startup_name}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="scroll-mt-32"
        >
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-700/30 shadow-xl space-y-4 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p><strong>Dream:</strong> {story.dream}</p>

            <p><strong>What went wrong:</strong></p>
            <ul className="list-disc list-inside">
              {story.what_went_wrong.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>

            <p><strong>Biggest Mistake:</strong> {story.biggest_mistake}</p>

            <p><strong>Key Learnings:</strong></p>
            <ul className="list-disc list-inside">
              {story.key_learnings.map((k, i) => (
                <li key={i}>{k}</li>
              ))}
            </ul>

            <p><strong>What they’d do differently:</strong> {story.what_they_d_do_differently}</p>
            <p><strong>Takeaway for dreamers:</strong> {story.takeaway_for_dreamers}</p>
          </div>
        </motion.section>
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
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
