"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { success } from '../../../../lib/successUps/success';
import { useRouter } from 'next/navigation';

const HorizontalSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stories = success.success_stories; // access the array
  const router = useRouter();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleCardClick = (heading) => {
    const formattedHeading = heading.toLowerCase().replace(/\s+/g, '-');
    router.push(`/learn/s/${formattedHeading}`);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-left mb-8 pt-12 text-gray-300">
        Read Success Stories
      </h1>

      {/* Main slider container */}
      <div className="relative h-96 md:h-[500px] overflow-visible">
        <div className="flex items-center justify-center h-full">

          {/* Previous card */}
          <motion.div
            className="absolute left-0 z-10 w-64 md:w-80 h-4/5 cursor-pointer"
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: stories.length > 1 ? 0.3 : 0, scale: 0.8, x: -20 }}
            whileHover={{ opacity: 0.5, scale: 0.85 }}
            onClick={() => {
              prevSlide();
              handleCardClick(stories[(currentIndex - 1 + stories.length) % stories.length].heading);
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src={stories[(currentIndex - 1 + stories.length) % stories.length].image}
                alt={stories[(currentIndex - 1 + stories.length) % stories.length].heading}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold truncate">
                  {stories[(currentIndex - 1 + stories.length) % stories.length].heading}
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Main active card */}
          <motion.div
            className="relative z-20 w-full max-w-2xl h-full mx-auto cursor-pointer"
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onClick={() => handleCardClick(stories[currentIndex].heading)}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500;
              if (swipe) {
                if (offset.x > 0) prevSlide();
                else nextSlide();
              }
            }}
          >
            <div className="relative w-full h-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
              {/* Image */}
              <div className="absolute inset-0">
                <img
                  src={stories[currentIndex].image}
                  alt={stories[currentIndex].heading}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                <motion.h2
                  className="text-2xl md:text-4xl font-bold mb-2 md:mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {stories[currentIndex].heading}
                </motion.h2>
                <motion.p
                  className="text-sm md:text-lg text-gray-200 max-w-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {stories[currentIndex].journey}
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Next card */}
          <motion.div
            className="absolute right-0 z-10 w-64 md:w-80 h-4/5 cursor-pointer"
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: stories.length > 1 ? 0.3 : 0, scale: 0.8, x: 20 }}
            whileHover={{ opacity: 0.5, scale: 0.85 }}
            onClick={() => {
              nextSlide();
              handleCardClick(stories[(currentIndex + 1) % stories.length].heading);
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
              <img
                src={stories[(currentIndex + 1) % stories.length].image}
                alt={stories[(currentIndex + 1) % stories.length].heading}
                className="w-full h-full object-cover"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-bold truncate">
                  {stories[(currentIndex + 1) % stories.length].heading}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots indicator */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentIndex === index ? 'bg-gray-800 scale-110' : 'bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute -bottom-12 left-0 right-0 h-1 bg-gray-300 rounded-full">
        <motion.div
          className="h-full bg-gray-800 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentIndex + 1) / stories.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default HorizontalSlider;