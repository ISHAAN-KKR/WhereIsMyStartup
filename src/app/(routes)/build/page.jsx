'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, TrendingUp, Calendar, Clock, Briefcase, ChevronLeft, ChevronRight, Brain, Target, BarChart3, Lightbulb } from 'lucide-react';
import ReactMarkdown from "react-markdown";
const API_URL = process.env.NEXT_PUBLIC_BUILD_API_URL

const BuildPage = () => {
  const [activeTab, setActiveTab] = useState('market-research');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [marketResearchResult, setMarketResearchResult] = useState(null);
  const [vcs, setVcs] = useState([]);
  const [selectedVc, setSelectedVc] = useState(null);
  const [news, setNews] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    time_slot: '',
    startup_name: '',
    founder_name: '',
    email: '',
    pitch_summary: ''
  });
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [thinkingStep, setThinkingStep] = useState(0);
  const newsRef = useRef(null);

  useEffect(() => {
    loadNews();
  }, []);

  useEffect(() => {
    if (activeTab === 'venture-capitalists') {
      loadVCs();
    }
  }, [activeTab]);

  useEffect(() => {
    // Auto-scroll news carousel
    const interval = setInterval(() => {
      if (news.length > 0) {
        setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [news]);

  useEffect(() => {
    let thinkingInterval;
    if (loading) {
      thinkingInterval = setInterval(() => {
        setThinkingStep((prev) => (prev + 1) % 4);
      }, 1500);
    }
    
    return () => {
      if (thinkingInterval) clearInterval(thinkingInterval);
    };
  }, [loading]);

  const loadNews = async () => {
    try {
      const newsData = [
        {
          id: 1,
          title: "Indian Startup Funding Reaches $8.2B in Q3 2025",
          summary: "Venture capital investments in Indian startups show strong growth, with fintech and AI companies leading the charge.",
          category: "Funding",
          time: "2 hours ago",
          source: "TechCrunch India"
        },
        {
          id: 2,
          title: "AI-Powered Healthcare Startups See 40% Growth",
          summary: "Healthcare technology companies leveraging artificial intelligence are attracting significant investor attention.",
          category: "HealthTech",
          time: "4 hours ago",
          source: "YourStory"
        },
        {
          id: 3,
          title: "Sequoia Capital India Launches $2.8B Fund",
          summary: "Major venture capital firm announces new fund focusing on early-stage Indian startups across multiple sectors.",
          category: "VC News",
          time: "6 hours ago",
          source: "Economic Times"
        },
        {
          id: 4,
          title: "EdTech Market Expected to Reach $30B by 2027",
          summary: "Educational technology sector shows promising growth trajectory with increased adoption of digital learning.",
          category: "EdTech",
          time: "8 hours ago",
          source: "Inc42"
        }
      ];
      setNews(newsData);
    } catch (error) {
      console.error('Error loading news:', error);
    }
  };

  const loadVCs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}connect_vc`);
      const data = await response.json();
      if (data.status === 'success') {
        setVcs(data.venture_capitalists);
      }
    } catch (error) {
      console.error('Error loading VCs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarketResearch = async () => {
    if (!searchInput.trim()) return;
    
    setLoading(true);
    setMarketResearchResult(null);
    try {
      const response = await fetch(`${API_URL}market_research`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: searchInput }),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setMarketResearchResult(data.result);
      }
    } catch (error) {
      console.error('Error conducting market research:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVcClick = async (vcId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}connect_vc/${vcId}`);
      const data = await response.json();
      if (data.status === 'success') {
        setSelectedVc(data.venture_capitalist);
      }
    } catch (error) {
      console.error('Error loading VC details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleMeeting = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}connect_vc/${selectedVc.id}/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleForm),
      });
      
      const data = await response.json();
      if (data.status === 'success') {
        setShowScheduleModal(false);
        setScheduleForm({
          date: '',
          time_slot: '',
          startup_name: '',
          founder_name: '',
          email: '',
          pitch_summary: ''
        });
        alert('Meeting scheduled successfully!');
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = (schedule) => {
    const availableSlots = [];
    Object.entries(schedule || {}).forEach(([date, slots]) => {
      Object.entries(slots).forEach(([time, available]) => {
        if (available) {
          availableSlots.push({ date, time });
        }
      });
    });
    return availableSlots;
  };

  const handleNewsNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentNewsIndex((prevIndex) => (prevIndex + 1) % news.length);
    } else {
      setCurrentNewsIndex((prevIndex) => (prevIndex - 1 + news.length) % news.length);
    }
  };

  // Thinking animation steps
  const thinkingSteps = [
    { icon: Brain, text: "Analyzing your idea...", color: "text-blue-400" },
    { icon: Target, text: "Identifying market opportunities...", color: "text-purple-400" },
    { icon: BarChart3, text: "Researching competitors...", color: "text-green-400" },
    { icon: Lightbulb, text: "Generating insights...", color: "text-yellow-400" }
  ];

  return (
    <div className="min-h-screen bg-primary-1300 font-sans text-primary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-primary-1100 rounded-full shadow-md border border-primary-900 overflow-hidden p-1">
            <motion.button
              onClick={() => {
                setActiveTab('market-research');
                setMarketResearchResult(null);
              }}
              className={`px-8 py-3 font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'market-research'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-primary-50 hover:bg-primary-1000'
              } rounded-l-full rounded-r-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className="h-5 w-5" />
              <span>Market Research</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('venture-capitalists')}
              className={`px-8 py-3 font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'venture-capitalists'
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-primary-50 hover:bg-primary-1000'
              } rounded-r-full rounded-l-md`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Users className="h-5 w-5" />
              <span>Venture Capitalists</span>
            </motion.button>
          </div>
        </div>

        {/* Market Research Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'market-research' && (
            <motion.div
              key="market-research"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {/* Search Bar - Hidden during loading */}
              <AnimatePresence mode="wait">
                {!loading && (
                  <motion.div
                    key="search-bar"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto"
                  >
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-primary-400" />
                      </div>
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleMarketResearch()}
                        placeholder="Enter your startup idea for comprehensive market research..."
                        className="block w-full pl-12 pr-32 py-4 rounded-xl bg-primary-1100 shadow-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 text-lg text-primary-50 border border-primary-900"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <motion.button
                          onClick={handleMarketResearch}
                          disabled={!searchInput.trim() || loading}
                          className="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.05, boxShadow: '0 0 10px var(--color-primary-glow)' }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Research
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading Animation */}
              <AnimatePresence mode="wait">
                {loading && (
                  <motion.div
                    key="loading-animation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-4xl mx-auto flex flex-col items-center justify-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0.8, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        duration: 0.5
                      }}
                      className="mb-8"
                    >
                      <div className="relative">
                        <div className="w-32 h-32  bg-black rounded-full flex items-center justify-center">
                          {thinkingSteps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ 
                                  opacity: thinkingStep === index ? 1 : 0,
                                  scale: thinkingStep === index ? 1 : 0.5
                                }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <IconComponent className={`h-16 w-16 ${step.color}`} />
                              </motion.div>
                            );
                          })}
                        </div>
                        <motion.div
                          className="absolute -inset-4 bg-primary-500 rounded-full opacity-20 blur-xl"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      key={thinkingStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      className="text-center"
                    >
                      <p className={`text-2xl font-semibold ${thinkingSteps[thinkingStep].color} mb-2`}>
                        {thinkingSteps[thinkingStep].text}
                      </p>
                      <p className="text-primary-300">This may take a few moments...</p>
                    </motion.div>

                    {/* Animated dots */}
                    <motion.div 
                      className="flex space-x-1 mt-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-3 h-3 bg-primary-500 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 1.5, 
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Market Research Results or News Vertical Carousel */}
              {marketResearchResult ? (
                <motion.div
                  className="max-w-4xl mx-auto bg-primary-1100 rounded-xl shadow-lg p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-primary-900 rounded-lg mr-3">
                      <Lightbulb className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-50">Market Research Results</h3>
                  </div>
                  <div className="prose max-w-none text-primary-200">
                    <div className="whitespace-pre-wrap leading-relaxed p-4 bg-primary-1200 rounded-lg border border-primary-1000">
                      <ReactMarkdown>{marketResearchResult}</ReactMarkdown>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      setMarketResearchResult(null);
                      setSearchInput('');
                    }}
                    className="mt-6 bg-primary-700 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Research Another Idea
                  </motion.button>
                </motion.div>
              ) : !loading && (
                <motion.div 
                  className="max-w-4xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-primary-50 mb-6 flex items-center justify-between">
                    <span>Latest Startup News</span>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleNewsNavigation('prev')}
                        className="p-1 rounded-full bg-primary-1000 hover:bg-primary-900 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleNewsNavigation('next')}
                        className="p-1 rounded-full bg-primary-1000 hover:bg-primary-900 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </h3>
                  <div className="relative h-64 overflow-hidden rounded-xl bg-primary-1100 shadow-lg">
                    <motion.div 
                      className="absolute inset-0"
                      key={currentNewsIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      {news.length > 0 && (
                        <div className="p-6 h-full flex flex-col justify-center">
                          <div className="flex items-center justify-between mb-3">
                            <span className="bg-primary-900 text-primary-50 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {news[currentNewsIndex].category}
                            </span>
                            <span className="text-primary-400 text-sm">{news[currentNewsIndex].time}</span>
                          </div>
                          <h4 className="text-lg font-semibold text-primary-50 mb-2">{news[currentNewsIndex].title}</h4>
                          <p className="text-primary-200 mb-3">{news[currentNewsIndex].summary}</p>
                          <p className="text-sm text-primary-400">Source: {news[currentNewsIndex].source}</p>
                          
                          {/* Indicator dots */}
                          <div className="flex justify-center mt-6 space-x-2">
                            {news.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentNewsIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  index === currentNewsIndex ? 'bg-primary-500 scale-125' : 'bg-primary-700'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Venture Capitalists Tab */}
          {activeTab === 'venture-capitalists' && (
            <motion.div
              key="venture-capitalists"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {!selectedVc ? (
                <div className="max-w-6xl mx-auto">
                  <h3 className="text-xl font-semibold text-primary-50 mb-6">Connect with Top Venture Capitalists</h3>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <motion.div
                        className="h-12 w-12 border-b-2 border-primary-500 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {vcs.map((vc) => (
                        <motion.div
                          key={vc.id}
                          onClick={() => handleVcClick(vc.id)}
                          className="bg-primary-1100 rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer p-6 border border-primary-1000 hover:border-primary-700"
                          whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--color-primary-glow)' }}
                        >
                          <div className="flex items-center space-x-4 mb-4">
                            <img
                              src={vc.photo}
                              alt={vc.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-primary-900"
                            />
                            <div>
                              <h4 className="text-lg font-semibold text-primary-50 group-hover:text-primary-300 transition-colors">
                                {vc.name}
                              </h4>
                              <p className="text-primary-200 text-sm">{vc.company}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-primary-200">
                              <Briefcase className="h-4 w-4 mr-2" />
                              {vc.experience}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {vc.domain.map((domain, index) => (
                                <span
                                  key={index}
                                  className="bg-primary-900 text-primary-50 text-xs px-2 py-1 rounded-full"
                                >
                                  {domain}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-primary-200 text-sm mt-3 line-clamp-3">{vc.bio}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <motion.div
                  className="max-w-4xl mx-auto bg-primary-1100 rounded-xl shadow-lg p-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.button
                    onClick={() => setSelectedVc(null)}
                    className="text-primary-300 hover:text-primary-50 mb-6 flex items-center space-x-2"
                    whileHover={{ x: -5 }}
                  >
                    <span>← Back to all VCs</span>
                  </motion.button>
                  
                  <div className="flex items-start space-x-6 mb-8">
                    <img
                      src={selectedVc.photo}
                      alt={selectedVc.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-900"
                    />
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold text-primary-50">{selectedVc.name}</h2>
                      <p className="text-xl text-primary-200 mb-2">{selectedVc.company}</p>
                      <div className="flex items-center text-primary-200 mb-3">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {selectedVc.experience}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedVc.domain.map((domain, index) => (
                          <span
                            key={index}
                            className="bg-primary-900 text-primary-50 text-sm px-3 py-1 rounded-full"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary-50 mb-3">Biography</h3>
                    <p className="text-primary-200 leading-relaxed">{selectedVc.bio}</p>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-primary-50 mb-4">Available Time Slots</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getAvailableSlots(selectedVc.schedule).map((slot, index) => (
                        <motion.div
                          key={index}
                          onClick={() => {
                            setScheduleForm({...scheduleForm, date: slot.date, time_slot: slot.time});
                            setShowScheduleModal(true);
                          }}
                          className="bg-primary-1100 border-2 border-green-500 rounded-lg p-4 cursor-pointer hover:bg-primary-1000 transition-colors"
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-primary-50">{slot.date}</span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="text-primary-200">{slot.time}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Meeting Modal */}
        <AnimatePresence>
          {showScheduleModal && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-primary-1100 rounded-xl shadow-xl p-6 w-full max-w-md"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <h3 className="text-lg font-semibold text-primary-50 mb-4">Schedule Meeting</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-1">Startup Name</label>
                    <input
                      type="text"
                      value={scheduleForm.startup_name}
                      onChange={(e) => setScheduleForm({...scheduleForm, startup_name: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-900 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-primary-1200 text-primary-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-1">Founder Name</label>
                    <input
                      type="text"
                      value={scheduleForm.founder_name}
                      onChange={(e) => setScheduleForm({...scheduleForm, founder_name: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-900 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-primary-1200 text-primary-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-1">Email</label>
                    <input
                      type="email"
                      value={scheduleForm.email}
                      onChange={(e) => setScheduleForm({...scheduleForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-primary-900 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-primary-1200 text-primary-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-200 mb-1">Pitch Summary</label>
                    <textarea
                      value={scheduleForm.pitch_summary}
                      onChange={(e) => setScheduleForm({...scheduleForm, pitch_summary: e.target.value})}
                      rows="3"
                      className="w-full px-3 py-2 border border-primary-900 rounded-md focus:ring-2 focus:ring-primary-300 focus:border-primary-300 bg-primary-1200 text-primary-50"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <motion.button
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 px-4 py-2 border border-primary-900 rounded-md text-primary-200 hover:bg-primary-1000"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleScheduleMeeting}
                      disabled={loading}
                      className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? 'Scheduling...' : 'Schedule Meeting'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuildPage;