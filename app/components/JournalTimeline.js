'use client';

import { useState, useEffect } from 'react';
import { format, isToday, isThisMonth, isThisYear, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import {
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineCalendar,
  HiOutlineEmojiHappy,
  HiOutlineClock,
} from 'react-icons/hi';
import { useSession } from 'next-auth/react';

const JournalTimeline = ({ onEntrySelect }) => {
  const { data: session } = useSession();
  
  const [journals, setJournals] = useState([]);
  const [groupedJournals, setGroupedJournals] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({
    today: true,
    thisMonth: false,
    thisYear: false,
    older: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user data from localStorage with correct database name reference
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    
    console.log('JournalTimeline - Session Data:', {
      sessionExists: !!userData,
      userId: userData?.id,
      userEmail: userData?.email,
      journalId: userData?.journal_id, // From mood_tracker database
      accessToken: userData?.access_token?.slice(0, 20) + '...'
    });

    const fetchJournals = async () => {
      const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
      
      if (!userData?.journal_id) {
        console.log('JournalTimeline - No journal ID from mood_tracker, skipping fetch');
        return;
      }

      setIsLoading(true);
      try {
        console.log('JournalTimeline - Fetching journals for journal_id:', userData.journal_id);
        
        const journalsResponse = await fetch(`/api/journals?journal_id=${userData.journal_id}`, {
          headers: {
            'Authorization': `Bearer ${userData.access_token}`
          }
        });
        
        console.log('JournalTimeline - API Response Status:', journalsResponse.status);
        
        if (!journalsResponse.ok) {
          throw new Error(`Failed to fetch journals: ${journalsResponse.status}`);
        }
        
        const journalData = await journalsResponse.json();
        console.log('JournalTimeline - Fetched Data:', {
          count: journalData.length,
          sample: journalData.slice(0, 1) // Log first entry as sample
        });

        setJournals(journalData);
        groupJournals(journalData);
      } catch (error) {
        console.error('JournalTimeline - Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournals();
  }, []); // Remove session dependency since we're using localStorage

  // Add console log for grouping process
  const groupJournals = (journalData) => {
    console.log('JournalTimeline - Grouping journals:', {
      totalEntries: journalData.length,
      firstEntry: journalData[0]
    });

    const grouped = journalData.reduce((acc, journal) => {
      const date = parseISO(journal.created_at);
      
      if (isToday(date)) {
        if (!acc.today) acc.today = [];
        acc.today.push(journal);
      } else if (isThisMonth(date)) {
        if (!acc.thisMonth) acc.thisMonth = [];
        acc.thisMonth.push(journal);
      } else if (isThisYear(date)) {
        if (!acc.thisYear) acc.thisYear = [];
        acc.thisYear.push(journal);
      } else {
        if (!acc.older) acc.older = [];
        acc.older.push(journal);
      }
      
      return acc;
    }, {});

    // Log grouped data statistics
    console.log('JournalTimeline - Grouped Data Stats:', {
      today: grouped.today?.length || 0,
      thisMonth: grouped.thisMonth?.length || 0,
      thisYear: grouped.thisYear?.length || 0,
      older: grouped.older?.length || 0
    });

    setGroupedJournals(grouped);
  };

  // Loading state
  if (isLoading) {
    console.log('JournalTimeline - Showing loading state:', { isLoading });
    return <div className="p-4 text-center text-gray-600">Loading journals...</div>;
  }

  // Error state
  if (error) {
    console.log('JournalTimeline - Showing error state:', error);
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  const toggleGroup = (groupName) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Journal Card Component
  const JournalCard = ({ journal }) => (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onEntrySelect(journal)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <HiOutlineClock className="text-orange-500 w-4 h-4" />
          <span className="text-sm text-gray-600">
            {format(parseISO(journal.created_at), 'h:mm a')}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          journal.day_rating === 'great' ? 'bg-green-100 text-green-800' :
          journal.day_rating === 'good' ? 'bg-blue-100 text-blue-800' :
          journal.day_rating === 'okay' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {journal.day_rating}
        </span>
      </div>

      <p className="text-gray-800 line-clamp-2 mb-2">
        {journal.feelings}
      </p>

      <div className="flex flex-wrap gap-2">
        {journal.selected_moods.map((mood, index) => (
          <span
            key={index}
            className="flex items-center space-x-1 text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full"
          >
            <HiOutlineEmojiHappy className="w-3 h-3" />
            <span>{mood}</span>
          </span>
        ))}
      </div>
    </motion.div>
  );

  // Group Header Component
  const GroupHeader = ({ title, count, isExpanded, onToggle }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-2 hover:bg-orange-50 rounded-md transition-colors"
    >
      <div className="flex items-center space-x-2">
        <HiOutlineCalendar className="text-orange-500 w-5 h-5" />
        <span className="font-medium text-gray-700">{title}</span>
        <span className="text-sm text-gray-500">({count})</span>
      </div>
      {isExpanded ? (
        <HiOutlineChevronDown className="w-5 h-5 text-gray-500" />
      ) : (
        <HiOutlineChevronRight className="w-5 h-5 text-gray-500" />
      )}
    </button>
  );

  console.log('Rendering timeline with groups:', groupedJournals); // Debug final render state

  return (
    <div className="p-4 space-y-6">
      {/* Today's Entries */}
      {groupedJournals.today?.length > 0 && (
        <div>
          <GroupHeader
            title="Today"
            count={groupedJournals.today.length}
            isExpanded={expandedGroups.today}
            onToggle={() => toggleGroup('today')}
          />
          <AnimatePresence>
            {expandedGroups.today && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {groupedJournals.today.map((journal) => (
                  <JournalCard key={journal.journal_id} journal={journal} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* This Month's Entries */}
      {groupedJournals.thisMonth?.length > 0 && (
        <div>
          <GroupHeader
            title="This Month"
            count={groupedJournals.thisMonth.length}
            isExpanded={expandedGroups.thisMonth}
            onToggle={() => toggleGroup('thisMonth')}
          />
          <AnimatePresence>
            {expandedGroups.thisMonth && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {groupedJournals.thisMonth.map((journal) => (
                  <JournalCard key={journal.journal_id} journal={journal} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* This Year's Entries */}
      {groupedJournals.thisYear?.length > 0 && (
        <div>
          <GroupHeader
            title="This Year"
            count={groupedJournals.thisYear.length}
            isExpanded={expandedGroups.thisYear}
            onToggle={() => toggleGroup('thisYear')}
          />
          <AnimatePresence>
            {expandedGroups.thisYear && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {groupedJournals.thisYear.map((journal) => (
                  <JournalCard key={journal.journal_id} journal={journal} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Older Entries */}
      {groupedJournals.older?.length > 0 && (
        <div>
          <GroupHeader
            title="Older"
            count={groupedJournals.older.length}
            isExpanded={expandedGroups.older}
            onToggle={() => toggleGroup('older')}
          />
          <AnimatePresence>
            {expandedGroups.older && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-2 space-y-2 overflow-hidden"
              >
                {groupedJournals.older.map((journal) => (
                  <JournalCard key={journal.journal_id} journal={journal} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {Object.keys(groupedJournals).length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No journal entries yet</p>
        </div>
      )}
    </div>
  );
};

export default JournalTimeline;