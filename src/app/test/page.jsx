"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ArrowUpRight, Sparkles, Building, BookOpen } from 'lucide-react';

const SunRayNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      label: 'Grow',
      path: '/grow',
      icon: <Sparkles className="w-4 h-4" />,
      color: 'from-emerald-500 to-teal-500',
      angle: -10
    },
    {
      label: 'Build',
      path: '/build',
      icon: <Building className="w-4 h-4" />,
      color: 'from-blue-500 to-indigo-500',
      angle: 30
    },
    {
      label: 'Learn',
      path: '/learn',
      icon: <BookOpen className="w-4 h-4" />,
      color: 'from-purple-500 to-pink-500',
      angle: 100
    }
  ];

  const handleNavClick = (path) => {
    // In a real Next.js app, you'd use router.push(path)
    console.log(`Navigating to: ${path}`);
    setIsOpen(false);
    // For demo purposes, we'll just log the navigation
    // In your actual implementation, replace with:
    // import { useRouter } from 'next/router';
    // const router = useRouter();
    // router.push(path);
  };

  return (
    <div className="fixed top-6 left-6 z-50">
      {/* Main Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Menu className="w-6 h-6 text-white" />
        
        {/* Pulsing ring effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-red-500"
          animate={isOpen ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ duration: 2, repeat: isOpen ? Infinity : 0 }}
          style={{ opacity: 0.3 }}
        />
      </motion.button>

      {/* Navigation Items */}
      <AnimatePresence>
        {isOpen && (
          <>
            {navItems.map((item, index) => {
              const distance = 100; // Distance from center
              const angleRad = (item.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * distance;
              const y = Math.sin(angleRad) * distance;

              return (
                <motion.div
                  key={item.label}
                  className="absolute top-1/2 left-1/2"
                  initial={{ 
                    x: -28,
                    y: -28,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    x: x - 28,
                    y: y - 28,
                    opacity: 1,
                    scale: 1
                  }}
                  exit={{ 
                    x: -28,
                    y: -28,
                    opacity: 0,
                    scale: 0
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <motion.button
                    onClick={() => handleNavClick(item.path)}
                    className={`relative flex items-center bg-gradient-to-br ${item.color} rounded-full shadow-lg hover:shadow-xl transition-all duration-200 group overflow-hidden px-4 py-3 min-w-max`}
                    whileHover={{ 
                      scale: 1.05,
                      rotate: 2
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Background glow effect */}
                    <div className="absolute inset-0 bg-white opacity-20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                    
                    {/* Icon and Text */}
                    <div className="relative z-10 text-white flex items-center gap-2">
                      {item.icon}
                      <span className="text-sm font-medium">{item.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-70" />
                    </div>
                  </motion.button>
                </motion.div>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Background overlay when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Demo component to show the navigation in context
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <SunRayNavigation />
      
      {/* Demo content */}
      <div className="pt-24 pl-24 pr-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Your Amazing Website
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Click the sun ray navigation button in the top-left corner to explore the floating navigation menu. 
            Each option will redirect to its respective page: /grow, /build, or /learn.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-emerald-600 mb-3">Grow</h3>
              <p className="text-gray-600">Expand your potential and reach new heights in your personal and professional journey.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Build</h3>
              <p className="text-gray-600">Create amazing projects and bring your ideas to life with powerful tools and resources.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">Learn</h3>
              <p className="text-gray-600">Discover new skills and knowledge to stay ahead in an ever-evolving world.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;