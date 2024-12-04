// api.js
const API_BASE_URL = "/api";

/**
 * Fetch the current user session.
 * @returns {Promise<Object>} The session data.
 */
export const fetchSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/session`);
    if (!response.ok) {
      throw new Error("Failed to fetch session");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};

/**
 * Fetch mood analysis data for a specific user.
 * @param {string} userId - The user ID to fetch analysis data for.
 * @returns {Promise<Array>} An array of analysis objects.
 */
export const fetchAnalysis = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch analysis data");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analysis?user_id=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch analysis data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching analysis data:", error);
    throw error;
  }
};

/**
 * Log an authentication event (e.g., login or logout).
 * @param {string} userId - The user ID performing the event.
 * @param {string} event - The event type (e.g., "login", "logout").
 * @returns {Promise<Object>} The API response.
 */
export const logAuthEvent = async (userId, event) => {
  if (!userId || !event) {
    throw new Error("User ID and event are required to log auth events");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, event }),
    });

    if (!response.ok) {
      throw new Error("Failed to log authentication event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error logging auth event:", error);
    throw error;
  }
};

/**
 * Save a journal entry to the backend.
 * @param {string} userId - The user ID associated with the journal.
 * @param {string} content - The journal content.
 * @returns {Promise<Object>} The saved journal data.
 */
export const saveJournal = async (userId, content) => {
  if (!userId || !content) {
    throw new Error("User ID and content are required to save a journal");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, content }),
    });

    if (!response.ok) {
      throw new Error("Failed to save journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving journal entry:", error);
    throw error;
  }
};

/**
 * Fetch all journal entries for a specific user.
 * @param {string} userId - The user ID to fetch journal entries for.
 * @returns {Promise<Array>} An array of journal entries.
 */
export const fetchJournals = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required to fetch journals");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/journal?user_id=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch journals");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching journals:", error);
    throw error;
  }
};

/**
 * Analyze a journal entry.
 * @param {string} userId - The user ID associated with the journal.
 * @param {string} journalId - The journal ID to analyze.
 * @returns {Promise<Object>} The analysis result.
 */
export const analyzeJournal = async (userId, journalId) => {
  if (!userId || !journalId) {
    throw new Error("User ID and journal ID are required for analysis");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, journalId }),
    });

    if (!response.ok) {
      throw new Error("Failed to analyze journal entry");
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing journal:", error);
    throw error;
  }
};
