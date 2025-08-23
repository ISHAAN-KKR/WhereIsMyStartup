'use client';

import { useState, useEffect } from 'react';
import { Search, Users, TrendingUp, Calendar, MapPin, Building2, Clock, User, Mail, Briefcase } from 'lucide-react';

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

  // Load news data on component mount
  useEffect(() => {
    loadNews();
  }, []);

  // Load VCs when tab switches to venture capitalists
  useEffect(() => {
    if (activeTab === 'venture-capitalists') {
      loadVCs();
    }
  }, [activeTab]);

  const loadNews = async () => {
    try {
      // Simulated news data - in real app, this would come from news.json
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
      const response = await fetch('http://localhost:5000/api/connect_vc');
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
    try {
      const response = await fetch('http://localhost:5000/api/market_research', {
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
      const response = await fetch(`http://localhost:5000/api/connect_vc/${vcId}`);
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
      const response = await fetch(`http://localhost:5000/api/connect_vc/${selectedVc.id}/schedule`, {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Build Platform</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toggle Buttons */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md border">
            <button
              onClick={() => setActiveTab('market-research')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'market-research'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              <span>Market Research</span>
            </button>
            <button
              onClick={() => setActiveTab('venture-capitalists')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'venture-capitalists'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Venture Capitalists</span>
            </button>
          </div>
        </div>

        {/* Market Research Tab */}
        {activeTab === 'market-research' && (
          <div className="space-y-8">
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleMarketResearch()}
                  placeholder="Enter your startup idea for comprehensive market research..."
                  className="block w-full pl-12 pr-32 py-4 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <button
                    onClick={handleMarketResearch}
                    disabled={!searchInput.trim() || loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {loading ? 'Analyzing...' : 'Research'}
                  </button>
                </div>
              </div>
            </div>

            {/* Market Research Results or News */}
            {marketResearchResult ? (
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Market Research Results</h3>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{marketResearchResult}</pre>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Latest Startup News</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  {news.map((article) => (
                    <div key={article.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">{article.time}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h4>
                      <p className="text-gray-600 mb-3">{article.summary}</p>
                      <p className="text-sm text-gray-500">Source: {article.source}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Venture Capitalists Tab */}
        {activeTab === 'venture-capitalists' && (
          <div className="space-y-8">
            {!selectedVc ? (
              <div className="max-w-6xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Connect with Top Venture Capitalists</h3>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {vcs.map((vc) => (
                      <div
                        key={vc.id}
                        onClick={() => handleVcClick(vc.id)}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group p-6"
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <img
                            src={vc.photo}
                            alt={vc.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {vc.name}
                            </h4>
                            <p className="text-gray-600 text-sm">{vc.company}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Briefcase className="h-4 w-4 mr-2" />
                            {vc.experience}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {vc.domain.map((domain, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                              >
                                {domain}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mt-3 line-clamp-3">{vc.bio}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
                <button
                  onClick={() => setSelectedVc(null)}
                  className="text-blue-600 hover:text-blue-800 mb-6 flex items-center space-x-2"
                >
                  <span>← Back to all VCs</span>
                </button>
                
                <div className="flex items-start space-x-6 mb-8">
                  <img
                    src={selectedVc.photo}
                    alt={selectedVc.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-900">{selectedVc.name}</h2>
                    <p className="text-xl text-gray-600 mb-2">{selectedVc.company}</p>
                    <div className="flex items-center text-gray-600 mb-3">
                      <Briefcase className="h-4 w-4 mr-2" />
                      {selectedVc.experience}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedVc.domain.map((domain, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Biography</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedVc.bio}</p>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {getAvailableSlots(selectedVc.schedule).map((slot, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setScheduleForm({...scheduleForm, date: slot.date, time_slot: slot.time});
                          setShowScheduleModal(true);
                        }}
                        className="bg-green-50 border border-green-200 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">{slot.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">{slot.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Meeting</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Startup Name</label>
                <input
                  type="text"
                  value={scheduleForm.startup_name}
                  onChange={(e) => setScheduleForm({...scheduleForm, startup_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Founder Name</label>
                <input
                  type="text"
                  value={scheduleForm.founder_name}
                  onChange={(e) => setScheduleForm({...scheduleForm, founder_name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={scheduleForm.email}
                  onChange={(e) => setScheduleForm({...scheduleForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pitch Summary</label>
                <textarea
                  value={scheduleForm.pitch_summary}
                  onChange={(e) => setScheduleForm({...scheduleForm, pitch_summary: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleMeeting}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Scheduling...' : 'Schedule Meeting'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPage;