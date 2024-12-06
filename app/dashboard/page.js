'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
  RadialLinearScale
} from 'chart.js';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  HiOutlinePencilAlt, 
  HiOutlineChartBar, 
  HiOutlineArchive, 
  HiOutlineUser, 
  HiOutlineLightningBolt,
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineMenu,
} from 'react-icons/hi';
import { Line, Doughnut } from 'react-chartjs-2';


// Add these new quote constants
const loadingQuotes = [
  "Great things take time...",
  "Preparing your insights...",
  "Securely analyzing your data...",
  "Almost ready to show your journey...",
  "Creating your personalized dashboard..."
];

// Update the LoadingSkeleton component
const LoadingSkeleton = () => {
  const [currentQuote, setCurrentQuote] = useState(loadingQuotes[0]);

  // Add quote rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = loadingQuotes.indexOf(prev);
        return loadingQuotes[(currentIndex + 1) % loadingQuotes.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Loading Message */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="animate-pulse mb-2 sm:mb-4">
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-orange-100 rounded mx-auto"></div>
          </div>
          <p className="text-orange-600 font-medium text-sm sm:text-base">{currentQuote}</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            <span className="inline-flex items-center">
              <HiOutlineShieldCheck className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Your data is being analyzed
            </span>
          </p>
        </div>

        {/* Sentiment Analysis Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="animate-pulse space-y-3 sm:space-y-4">
              <div className="h-6 sm:h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-[250px] sm:h-[300px] bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="animate-pulse space-y-3 sm:space-y-4">
              <div className="h-6 sm:h-8 w-48 bg-gray-200 rounded"></div>
              <div className="h-[250px] sm:h-[300px] bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* AI Insights Skeleton */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-6 sm:h-8 w-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Emotional Chart Skeleton */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-6 sm:h-8 w-48 bg-gray-200 rounded"></div>
            <div className="h-[300px] bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeaderSection = ({ journalData }) => {
  if (!journalData) return null;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="w-full sm:w-auto">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Journey Entry Details</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {format(new Date(journalData.created_at), 'MMMM d, yyyy • h:mm a')}
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Journal ID: {journalData.journal_id}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end space-y-2 w-full sm:w-auto">
          <span className="text-gray-800 text-xs sm:text-sm font-medium">
            Day Rating: {journalData.day_rating}
          </span>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {journalData.selected_moods?.map((mood) => (
              <span key={mood} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-50 text-orange-600 rounded-full text-xs sm:text-sm">
                {mood}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SentimentChart = ({ sentimentData }) => {
  if (!sentimentData) return null;

  // Debug log to check incoming data
  console.log('Sentiment Data:', sentimentData);

  // Ensure data is properly structured with fallbacks
  const sentimentChartData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      label: 'Sentiment Distribution',
      data: [
        sentimentData?.sentiment?.scores?.positive * 100 || 0,
        sentimentData?.sentiment?.scores?.neutral * 100 || 0,
        sentimentData?.sentiment?.scores?.negative * 100 || 0
      ],
      fill: true,
      borderColor: '#F97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#F97316',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#F97316',
      pointHoverBorderColor: '#fff',
      borderWidth: 2,
    }]
  };

  // Primary emotions doughnut chart data
  const emotionsChartData = {
    labels: Object.keys(sentimentData?.roberta_emotions?.top_5 || {}),
    datasets: [{
      data: Object.values(sentimentData?.roberta_emotions?.top_5 || {}).map(v => v * 100),
      backgroundColor: [
        '#F97316',
        '#FB923C', 
        '#FDBA74',
        '#FED7AA',
        '#FFEDD5'
      ],
      borderWidth: 0,
    }]
  };

  // Enhanced chart options for sentiment line chart
  const sentimentChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#F3F4F6',
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          color: '#6B7280',
          font: {
            size: 11,
          },
          callback: function(value) {
            return value + '%';
          }
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          padding: 10,
          color: '#6B7280',
          font: {
            size: 11,
          }
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  // Doughnut chart options
  const emotionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12
          },
          usePointStyle: true,
          pointStyle: 'circle',
          radius: 2, // Added smaller radius for the circle
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.toFixed(1)}%`;
          }
        }
      }
    },
    cutout: '50%',
    layout: {
      padding: {
        bottom: 20 // Adds 20px padding at the bottom
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-1">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Sentiment Analysis</h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            {sentimentData?.feelings}
          </p>
        </div>

        <div className="h-[250px] sm:h-[300px]">
          <Line data={sentimentChartData} options={sentimentChartOptions} />
        </div>

        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <span>Sentiment Distribution</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">Primary Emotions</h2>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
            Distribution of detected primary emotions in your entry
          </p>
        </div>
        <div className="h-[250px] sm:h-[300px]">
          <Doughnut data={emotionsChartData} options={emotionsChartOptions} />
        </div>
      </div>
    </div>
  );
};

const AIInsight = ({ aiInsight }) => {
  if (!aiInsight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6"
    >
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-gray-800 flex items-center">
          <span className="mr-2">✨</span>
          Personalized Recommendations
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {aiInsight?.recommendations?.emotional_insight}
        </p>
      </div>

      {/* Activities Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-2 sm:space-y-3"
      >
        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
          <span className="mr-2">🎯</span>
          Recommended Activities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {aiInsight?.recommendations?.suggestions?.activities?.map((activity, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-medium text-orange-600 text-sm sm:text-base">{activity.activity}</span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full w-fit">
                  {activity.duration} • {activity.intensity}
                </span>
              </div>
              <p className="text-xs text-gray-600">{activity.benefit}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Books & Media Section
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-2 sm:space-y-3"
      >
        <h3 className="text-sm font-semibold text-gray-700 flex items-center">
          <span className="mr-2">📚</span>
          Recommended Books & Media
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {aiInsight?.recommendations?.suggestions?.books_media?.map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-orange-50 rounded-lg p-3 sm:p-4 space-y-1.5 sm:space-y-2 hover:shadow-md transition-shadow"
            >
              <div className="font-medium text-orange-600 text-sm sm:text-base">{item.title}</div>
              <p className="text-xs text-gray-600">{item.reason}</p>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

      {/* Foods Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Foods Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <span className="mr-2 text-xl">🍎</span>
            Nutritional Recommendations
          </h3>
          <div className="space-y-4">
            {aiInsight?.recommendations?.suggestions?.foods?.map((food, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-orange-50 to-white rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-orange-100"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-orange-600 text-base">{food.food}</span>
                  <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                    {food.calories}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Nutrients:</span> {food.nutrients}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{food.benefits}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Self Care Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
            <span className="mr-2 text-xl">🧘‍♀️</span>
            Self-Care Practices
          </h3>
          <div className="space-y-4">
            {aiInsight?.recommendations?.suggestions?.self_care?.map((practice, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.01 }}
                className="bg-gradient-to-r from-orange-50 to-white rounded-lg p-4 hover:shadow-lg transition-all duration-300 border border-orange-100"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="font-medium text-orange-600 text-base">{practice.practice}</span>
                  <span className="text-sm bg-orange-100 text-orange-600 px-3 py-1 rounded-full whitespace-nowrap">
                    {practice.duration}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{practice.benefit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EmotionalChart = ({ emotionalData }) => {
  if (!emotionalData) return null;

  const stabilityScore = emotionalData?.emotional_stability?.stability_score * 100 || 0;
  const variance = emotionalData?.emotional_stability?.variance || 0;
  const shifts = emotionalData?.emotional_stability?.emotional_shifts || 0;

  // Prepare data for transitions line chart
  const transitionData = {
    labels: emotionalData?.emotion_transitions?.map(t => t.from_emotion) || [],
    datasets: [{
      label: 'Emotional Transitions',
      data: emotionalData?.emotion_transitions?.map(t => t.transition_score * 100) || [],
      fill: true,
      borderColor: '#F97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#F97316',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: '#F97316',
      pointHoverBorderColor: '#fff',
      borderWidth: 2,
    }]
  };

  const transitionOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Transition Strength: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Emotional Stability</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col justify-between bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {/* <HiOutlineShieldCheck className="w-5 h-5 text-orange-500" /> */}
                <span className="text-sm font-medium text-gray-700">Stability Score</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight">
              {stabilityScore.toFixed(1)}%
            </p>
          </div>

          <div className="flex flex-col justify-between bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {/* <HiOutlineChartBar className="w-5 h-5 text-orange-500" /> */}
                <span className="text-sm font-medium text-gray-700">Emotional Variance</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight">
              {variance.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col justify-between bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {/* <HiOutlineLightningBolt className="w-5 h-5 text-orange-500" /> */}
                <span className="text-sm font-medium text-gray-700">Emotional Shifts</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl font-bold text-orange-600 tracking-tight">
              {shifts}
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center">
          <p className="text-sm text-gray-500 mt-4">
            {stabilityScore > 70 ? 'Your emotions show high stability' :
             stabilityScore > 40 ? 'Your emotions show moderate stability' :
             'Your emotions show some variability'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm lg:col-span-2" style={{ marginTop: '0' }}>
        <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2 sm:mb-4">Emotional Transitions</h2>
        <div className="h-[200px] sm:h-[250px] md:h-[300px] w-full">
          <Line 
            data={transitionData} 
            options={{
              ...transitionOptions,
              maintainAspectRatio: false,
              responsive: true
            }} 
          />
        </div>
      </div>
    </div>
  );
};

// Add missing constants
const dayRatingOptions = [
  { value: 'great', label: 'Great', emoji: '😄' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'bad', label: 'Bad', emoji: '😕' },
  { value: 'terrible', label: 'Terrible', emoji: '😢' }
];

const moods = [
  { id: 1, name: 'Happy', emoji: '😊' },
  { id: 2, name: 'Excited', emoji: '🎉' },
  { id: 3, name: 'Peaceful', emoji: '😌' },
  { id: 4, name: 'Anxious', emoji: '😰' },
  { id: 5, name: 'Sad', emoji: '😢' },
  { id: 6, name: 'Angry', emoji: '😠' },
  { id: 7, name: 'Tired', emoji: '😴' },
  { id: 8, name: 'Grateful', emoji: '🙏' }
];

const moodQuotes = [
  "Analyzing your emotions...",
  "Processing your journal entry...",
  "Understanding your mood patterns...",
  "Generating insights...",
  "Almost there..."
];
// Update the JournalTimeline component
const JournalTimeline = ({ 
  journals, 
  timelineLoading, 
  setIsJournalOpen, 
  setAnalysisData, 
  setSelectedJournal, 
  selectedJournal, 
  setActivePanel, 
  setShowArchive 
}) => {



  if (timelineLoading) {
    return (
      <div className="space-y-4 px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-5 bg-orange-50 rounded w-1/2 mb-2"></div>
            <div className="space-y-3">
              <div className="h-24 bg-orange-50 rounded-lg"></div>
              <div className="h-24 bg-orange-50 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!journals || Object.keys(journals).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <div className="bg-orange-50 rounded-full p-3 mb-3">
          <HiOutlinePencilAlt className="w-6 h-6 text-orange-500" />
        </div>
        <p className="text-gray-600 mb-2">No journal entries yet</p>
        <button
          onClick={() => setIsJournalOpen(true)}
          className="text-orange-600 text-sm hover:text-orange-700 font-medium"
        >
          Write your first entry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(journals).map(([date, entries]) => (
        <div key={date} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-orange-100 rounded-full p-1">
                  <HiOutlineCalendar className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-700">
                  {format(new Date(date), 'MMMM d, yyyy')}
                </h3>
              </div>
              <span className="text-xs text-gray-500">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
              </span>
            </div>
          </div>

          {/* Journal Entries */}
          <div className="space-y-3 px-4 mt-3">
            {entries.map((journal) => {
              const localTime = new Date(journal.created_at);
              return (
                <button
                  key={journal.journal_id}
                  onClick={() => {
                    setAnalysisData(journal);
                    setSelectedJournal(journal);
                    setActivePanel('analysis');
                    setShowArchive(false);
                  }}
                  className={`w-full text-left rounded-xl transition-all duration-200 
                    ${selectedJournal?.journal_id === journal.journal_id
                      ? 'bg-orange-50 ring-2 ring-orange-200'
                      : 'bg-white hover:bg-orange-50/50'
                    } border border-gray-100 hover:border-orange-100 shadow-sm hover:shadow`}
                >
                  {/* Entry Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="bg-orange-100/50 rounded-full p-1">
                          <HiOutlineClock className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">
                          {format(localTime, 'h:mm a')}
                        </span>
                      </div>
                      <span className={`
                        text-xs px-3 py-1 rounded-full font-medium
                        ${selectedJournal?.journal_id === journal.journal_id
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-gray-100 text-gray-600'}
                      `}>
                        {journal.day_rating}
                      </span>
                    </div>

                    {/* Journal Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {journal.user_journal}
                    </p>
                  </div>

                  {/* Entry Footer */}
                  <div className="p-3 bg-gray-50/50">
                    {/* Analysis Metrics */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
                        <HiOutlineChartBar className="w-4 h-4 text-orange-500" />
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xs text-gray-500">Sentiment:</span>
                          <span className="text-sm font-medium text-orange-600">
                           
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
                        <HiOutlineLightningBolt className="w-4 h-4 text-orange-500" />
                        <div className="flex items-baseline space-x-1">
                          <span className="text-xs text-gray-500">Shifts:</span>
                          <span className="text-sm font-medium text-orange-600">
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Moods */}
                    {journal.selected_moods && journal.selected_moods.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {journal.selected_moods.slice(0, 3).map((mood) => (
                          <span
                            key={mood}
                            className="text-xs px-2.5 py-1 rounded-full bg-white text-orange-600 border border-orange-100"
                          >
                            {mood}
                          </span>
                        ))}
                        {journal.selected_moods.length > 3 && (
                          <span className="text-xs flex items-center bg-white px-2.5 py-1 rounded-full border border-orange-100">
                            <HiOutlineSparkles className="w-3 h-3 mr-1 text-orange-500" />
                            <span className="text-orange-600">
                              +{journal.selected_moods.length - 3}
                            </span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Debug log */}
                  {console.log('Journal timestamp:', {
                    original: journal.created_at,
                    parsed: new Date(journal.created_at),
                    local: new Date(journal.created_at).toLocaleString(),
                  })}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// First, let's define the LoadingAnalysisSkeleton component
// const LoadingAnalysisSkeleton = () => (
//   <div className="max-w-7xl mx-auto p-8">
//     <div className="space-y-6">
//       {/* Charts Grid Skeleton */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {[1, 2].map(i => (
//           <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="animate-pulse space-y-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-5 h-5 bg-gray-200 rounded"></div>
//                 <div className="h-6 w-48 bg-gray-200 rounded"></div>
//               </div>
//               <div className="h-64 bg-gray-200 rounded">
//                 <div className="h-full w-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Analysis Cards Skeleton */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {[1, 2].map(i => (
//           <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="animate-pulse space-y-4">
//               <div className="flex items-center space-x-2">
//                 <div className="w-5 h-5 bg-gray-200 rounded"></div>
//                 <div className="h-6 w-48 bg-gray-200 rounded"></div>
//               </div>
//               <div className="space-y-2">
//                 <div className="h-4 w-full bg-gray-200 rounded"></div>
//                 <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </div>
// );

// Add this new component for the main journal input section
const JournalInput = ({ journalContent, setJournalContent, dayRating, setDayRating, selectedMoods, setSelectedMoods, analyzeMood, isAnalyzing }) => {
  return (
    <div className="w-full flex items-center justify-center px-4 sm:px-6 py-4 sm:py-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Day Rating */}
        <div className="space-y-2">
          <h3 className="text-gray-700 font-medium text-left">How was your day?</h3>
          <div className="flex flex-wrap justify-items-start gap-1.5">
            {dayRatingOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setDayRating(option.value)}
                className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all duration-200 text-xs ${
                  dayRating === option.value
                    ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-200'
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <span>{option.emoji}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div className="space-y-2">
          <h3 className="text-gray-700 font-medium text-start">Select your moods</h3>
          <div className="flex flex-wrap justify-items-start gap-1.5">
            {moods.map(mood => (
              <button
                key={mood.id}
                onClick={() => {
                  if (selectedMoods.includes(mood.name)) {
                    setSelectedMoods(selectedMoods.filter(m => m !== mood.name));
                  } else {
                    setSelectedMoods([...selectedMoods, mood.name]);
                  }
                }}
                className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 transition-all duration-200 text-xs ${
                  selectedMoods.includes(mood.name)
                    ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-200'
                    : 'bg-white text-gray-600 hover:bg-orange-50 border border-gray-200'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Journal Input */}
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-2xl mx-auto w-full">
          <textarea
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="Your thoughts deserve a home. Start journaling now ..."
            style={journalContent ? {} : {
              fontFamily: "'Source Serif 4', serif",
              fontStyle: 'italic'
            }}
            className="w-full min-h-[200px] resize-none border-0 bg-transparent p-0 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0 sm:leading-7 text-lg"
          />
          <div className="absolute bottom-6 right-6">
            <button
              onClick={analyzeMood}
              disabled={!journalContent.trim() || isAnalyzing}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-[0px]"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C14.168 0 16 1.832 16 4v2.168A7.962 7.962 0 0116 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium text-sm">Analyzing...</span>
                </>
              ) : (
                <span className="font-medium text-sm">Analyze</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  // Add this with other state declarations at the top of the component
  const [showDropdown, setShowDropdown] = useState(false);

  // Move the Chart.js registration inside the component
  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      Filler,
      ArcElement,
      BarElement,
      RadialLinearScale
    );
  }, []);

  // State Management
  const [showSidebar, setShowSidebar] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [journalContent, setJournalContent] = useState('');
  const [dayRating, setDayRating] = useState('good');
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const router = useRouter();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const detailedSectionRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Add a new state to track if user is already verified
  const [isUserVerified, setIsUserVerified] = useState(false);

  // Add these new states near the top of the Dashboard component
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [timelineLoading, setTimelineLoading] = useState(true);

  // Optimize the auth and user verification useEffect
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          throw sessionError;
        }
        
        if (!session) {
          console.log('No active session found');
          router.replace('/auth');
          return;
        }

        console.log('Session found:', {
          userId: session.user.id,
          email: session.user.email
        });

        // Try to get stored user ID first
        const storedUserId = localStorage.getItem('databaseUserId');
        if (storedUserId && !isUserVerified) {
          console.log('Using stored userId:', storedUserId);
          setSession(session);
          setUserId(storedUserId);
          setIsUserVerified(true);
          setLoading(false);
          return;
        }

        // If not verified, check database
        if (!isUserVerified) {
          // First check if user exists by email
          const { data: existingUser, error: selectError } = await supabase
            .from('users')
            .select('id, user_id, email, username')
            .eq('email', session.user.email)
            .single();

          if (selectError && selectError.code !== 'PGRST116') {
            console.error('Error checking existing user:', selectError);
            throw new Error(`Database select error: ${selectError.message}`);
          }

          let userData = existingUser;

          // If user doesn't exist, create new user
          if (!existingUser) {
            console.log('Creating new user...');
            const { data: newUser, error: insertError } = await supabase
              .from('users')
              .insert({
                auth_user_id: session.user.id,
                email: session.user.email,
                username: session.user.name || session.user.email.split('@')[0],
                created_at: session.user.created_at || new Date().toISOString(),
                last_login: session.user.last_sign_in_at || new Date().toISOString(),
                // user_id will be auto-generated by the database default
              })
              .select('id, auth_user_id, email, username, created_at, last_login')
              .single();

            if (insertError) {
              console.error('Error creating new user:', insertError);
              throw new Error(`Database insert error: ${insertError.message}`);
            }

            userData = newUser;
            console.log('New user created:', userData);
          }

          if (userData?.user_id) {
            console.log('Setting user data:', userData);
            localStorage.setItem('databaseUserId', userData.user_id);
            setSession(session);
            setUserId(userData.user_id);
            setIsUserVerified(true);
          } else {
            throw new Error('Failed to get or create user record');
          }
        }

      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message || 'An error occurred during authentication');
      } finally {
        setLoading(false);
      }
    };

    const fetchJournals = async (userId) => {
      try {
        console.log('Fetching journals for userId:', userId);
        const response = await fetch(`http://localhost:8000/api/journals/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const journalData = await response.json();
        console.log('Fetched journal data:', journalData);
        // Process and set the journal data as needed
      } catch (error) {
        console.error('Error fetching journals:', error);
        setError('Failed to load journal entries');
      }
    };

    // Set up auth state change listener
    let authListener;
    
    const setupAuthListener = async () => {
      try {
        // Initialize the listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_OUT') {
              localStorage.removeItem('databaseUserId');
              setSession(null);
              setUserId(null);
              setIsUserVerified(false);
              router.replace('/auth');
            } else if (event === 'SIGNED_IN' && !isUserVerified) {
              await checkUser();
              if (newSession?.user) {
                fetchJournals(newSession.user.id); // Call the API after sign-in
              }
            }
          }
        );
        
        // Store the listener
        authListener = subscription;
      } catch (error) {
        console.error('Error setting up auth listener:', error);
      }
    };

    // Initial check and setup
    if (!isUserVerified) {
      checkUser();
      setupAuthListener();
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up auth listener');
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [router, isUserVerified]); // Add any other dependencies you're using

  // Add this effect to help debug user_id issues
  useEffect(() => {
    if (session?.user) {
      console.log('Current session user details:', {
        supabaseUserId: session.user.id,
        databaseUserId: session.user.user_id,
        email: session.user.email,
        isVerified: isUserVerified
      });
    }
  }, [session, isUserVerified]);

  // Add effect to monitor important state changes
  useEffect(() => {
    console.log('Dashboard - State Update:', {
      isUserVerified,
      userId,
      hasSession: !!session,
      isLoading: loading
    });
  }, [isUserVerified, userId, session, loading]);

  // Add an effect to log userId changes
  useEffect(() => {
    console.log('Current User ID:', userId);
  }, [userId]);

  // Update the quote rotation effect to use client-side only
  useEffect(() => {
    if (typeof window !== 'undefined' && isAnalyzing) {
      setCurrentQuote(moodQuotes[0]); // Set initial quote
      const interval = setInterval(() => {
        setCurrentQuote(prev => {
          const currentIndex = moodQuotes.indexOf(prev);
          const nextIndex = (currentIndex + 1) % moodQuotes.length;
          return moodQuotes[nextIndex];
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setShowScrollButton(scrollPosition > windowHeight * 0.6);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // API Integration
  const analyzeMood = async () => {
    if (!session?.user) {
      setError('No user session found');
      return;
    }

    setIsAnalyzing(true);
    setIsJournalOpen(false);
    setActivePanel('analysis');

    try {
      const analysisData = {
        user_id: userId,
        email: session.user.email,
        username: session.user.email.split('@')[0],
        content: journalContent.trim(),
        day_rating: dayRating.toLowerCase(),
        selected_moods: selectedMoods,
        tags: [],
        timestamp: new Date().toISOString()
      };

      const response = await fetch('http://localhost:8000/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      setAnalysisData(data);

      // Update the journals state with the new entry
      const newDate = format(new Date(data.created_at), 'yyyy-MM-dd');
      setJournals(prevJournals => {
        const updatedJournals = { ...prevJournals };
        if (!updatedJournals[newDate]) {
          updatedJournals[newDate] = [];
        }
        // Add the new journal entry at the beginning of the array for that date
        updatedJournals[newDate] = [
          {
            ...data,
            sentiment: data.sentiment || {},
            emotion_transitions: data.detailed_analysis?.emotion_transitions || [],
            emotional_stability: data.detailed_analysis?.emotional_stability || {
              variance: 0,
              stability_score: 0,
              emotional_shifts: 0
            }
          },
          ...updatedJournals[newDate]
        ];
        return updatedJournals;
      });

      // Set this as the selected journal
      setSelectedJournal(data);

    } catch (error) {
      setError(error.message || 'Failed to analyze journal entry');
    } finally {
      setIsAnalyzing(false);
      setJournalContent('');
      setDayRating('good');
      setSelectedMoods([]);
    }
  };


  // Update the useEffect for fetching journals
  useEffect(() => {
    const fetchJournals = async () => {
      if (!userId) {
        console.log('No userId available, skipping journal fetch');
        return;
      }

      setTimelineLoading(true);
      console.log('Fetching journals for userId:', userId);

      try {
        // Fetch journals from the backend API instead of Supabase
        const response = await fetch(`http://localhost:8000/api/journals/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            // Handle case where no journals are found
            console.log('No journals found for user');
            setJournals({});
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const journalData = await response.json();
        console.log('Raw journal data:', journalData);

        if (!journalData || journalData.length === 0) {
          console.log('No journals found for user');
          setJournals({});
          return;
        }

        // Group journals by date
        const groupedJournals = journalData.reduce((groups, journal) => {
          try {
            const date = format(new Date(journal.created_at), 'yyyy-MM-dd');
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push({
              ...journal,
              sentiment: journal.sentiment || {},
              emotion_transitions: journal.detailed_analysis?.emotion_transitions || [],
              emotional_stability: journal.detailed_analysis?.emotional_stability || {
                variance: 0,
                stability_score: 0,
                emotional_shifts: 0
              }
            });
            return groups;
          } catch (e) {
            console.error('Error processing journal entry:', e);
            return groups;
          }
        }, {});

        console.log('Grouped journals:', groupedJournals);
        setJournals(groupedJournals);

      } catch (error) {
        console.error('Error fetching journals:', error);
        setError('Failed to load journal entries');
        setJournals({});
      } finally {
        setTimelineLoading(false);
      }
    };

    if (userId) {
      fetchJournals();
    }
  }, [userId]);


  // Add this near the top of the component with other state declarations
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage and reset state
      localStorage.removeItem('databaseUserId');
      setSession(null);
      setUserId(null);
      setIsUserVerified(false);

      // Redirect to the authentication page
      router.replace('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  // Add this useEffect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Update this section in your component to maintain layout
  if (session === null || isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8F3]">
        <div className="flex">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F3]">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={() => router.replace('/auth')}
            className="mt-2 text-sm underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }
  // Begin main render
  return (
    <div className="min-h-screen bg-[#FFF8F3]">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center h-16">
            <div className="flex items-center space-x-9 md:flex-1">
              {/* Menu toggle button */}
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <HiOutlineMenu className="w-6 h-6 text-gray-600" />
              </button>
              
              <h1 className="text-xl md:text-2xl font-bold text-orange-600 md:text-left text-center flex-1">
                FeelMitra
              </h1>
            <div className="flex items-center">
              <div className="relative dropdown-container">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-4 focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <HiOutlineUser className="w-6 h-6 text-orange-600" />
                  </div>
                  <span className="hidden md:block text-gray-700 truncate max-w-[200px]">
                    {session?.user?.email}
                  </span>
                  <svg className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 md:w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100 transform origin-top-right transition-all duration-200 ease-out">
                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 md:hidden">
                      <div className="font-medium truncate">{session?.user?.email}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Logged in</div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 active:bg-orange-100 transition-colors duration-150 flex items-center space-x-2 group"
                      >
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-orange-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} fixed md:relative md:translate-x-0 w-72 bg-white border-r border-orange-100 flex flex-col h-full transition-transform duration-300 ease-in-out z-40`}>
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 bg-white border-b border-orange-100">
            <div className="p-4 space-y-3">
              {/* Mobile header with menu toggle */}
              <div className="flex justify-between items-center md:hidden mb-2">
                <h2 className="font-semibold text-gray-800">Menu</h2>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <button
                onClick={() => {
                  // Find the latest journal entry
                  const latestDate = Object.keys(journals).sort().reverse()[0];
                  if (latestDate && journals[latestDate].length > 0) {
                    const latestJournal = journals[latestDate][0]; // Get the first entry of the latest date
                    setSelectedJournal(latestJournal);
                    setAnalysisData(latestJournal);
                  }
                  setActivePanel('analysis');
                  setShowArchive(false);
                  setShowSidebar(false);
                }}
                className={`w-full p-3 flex items-center space-x-2 rounded-lg transition-all duration-200 
                  ${activePanel === 'analysis' && !showArchive
                    ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm'
                    : 'hover:bg-orange-50 text-gray-600'}`}
              >
                <HiOutlineChartBar className="w-5 h-5" />
                <span className="font-medium">My Analysis</span>
              </button>
              
              <button
                onClick={() => {
                  setShowArchive(true);
                  setActivePanel('archive');
                  setShowSidebar(false);
                }}
                className={`w-full p-3 flex items-center space-x-2 rounded-lg transition-all duration-200 
                  ${activePanel === 'archive' && showArchive
                    ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200 shadow-sm'
                    : 'hover:bg-orange-50 text-gray-600'}`}
              >
                <HiOutlineArchive className="w-5 h-5" />
                <span className="font-medium">Archive</span>
              </button>

              <button
                onClick={() => {
                  setIsJournalOpen(true);
                  setShowSidebar(false);
                }}
                className="w-full p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg 
                  hover:from-orange-600 hover:to-orange-700 transition-all duration-200 
                  flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <HiOutlinePencilAlt className="w-5 h-5" />
                <span className="font-medium">Write Journal</span>
              </button>
            </div>
          </div>

          {/* Scrollable Timeline */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <JournalTimeline 
              journals={journals}
              timelineLoading={timelineLoading}
              setIsJournalOpen={setIsJournalOpen}
              setAnalysisData={setAnalysisData}
              setSelectedJournal={(journal) => {
                setSelectedJournal(journal);
                setShowSidebar(false); // Hide sidebar on mobile when journal is selected
              }}
              selectedJournal={selectedJournal}
              setActivePanel={setActivePanel}
              setShowArchive={setShowArchive}
            />
          </div>
        </div>

        {/* Main content area with custom scrollbar */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#FFF8F3]">
          {activePanel === 'analysis' ? (
            <div className="max-w-7xl mx-auto p-4 space-y-6">
              {isAnalyzing ? (
                // Show loading skeleton only for analysis components
                <>
                  <div className="animate-pulse bg-white rounded-xl p-4 sm:p-6 shadow-sm h-24"></div>
                  <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm h-[400px]"></div>
                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm h-[400px]"></div>
                  </div>
                  <div className="animate-pulse bg-white rounded-xl p-4 sm:p-6 shadow-sm h-[300px]"></div>
                </>
              ) : (
                // Show analysis components
                <>
                  <HeaderSection journalData={analysisData} />
                  <AIInsight aiInsight={analysisData} />
                  <SentimentChart sentimentData={analysisData} />
                  <EmotionalChart emotionalData={analysisData} />
                </>
              )}
            </div>
          ) : (
            // Journal input section
            <JournalInput 
              journalContent={journalContent}
              setJournalContent={setJournalContent}
              dayRating={dayRating}
              setDayRating={setDayRating}
              selectedMoods={selectedMoods}
              setSelectedMoods={setSelectedMoods}
              analyzeMood={analyzeMood}
              isAnalyzing={isAnalyzing}
            />
          )}
        </main>
      </div>

      {/* Journal Writing Modal */}
      <AnimatePresence>
        {isJournalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-medium">Write Your Journal</h3>
                <button
                  onClick={() => setIsJournalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Reuse the JournalInput component */}
              <div className="!min-h-0"> {/* Override min-height */}
                <JournalInput
                  journalContent={journalContent}
                  setJournalContent={setJournalContent}
                  dayRating={dayRating}
                  setDayRating={setDayRating}
                  selectedMoods={selectedMoods}
                  setSelectedMoods={setSelectedMoods}
                  analyzeMood={() => {
                    analyzeMood();
                    setIsJournalOpen(false);
                  }}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <button onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
