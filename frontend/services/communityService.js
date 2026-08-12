import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_KEY = '@guardpay_reports';
const COMMENTS_KEY = '@guardpay_comments';
const REACTIONS_KEY = '@guardpay_reactions';

// Fraud types
export const FRAUD_TYPES = [
  { id: 'whatsapp_takeover', label: 'WhatsApp Account Takeover', icon: 'logo-whatsapp', color: '#25D366' },
  { id: 'fake_mpesa', label: 'Fake M-PESA Message', icon: 'cash-outline', color: '#00A650' },
  { id: 'sim_swap', label: 'SIM Swap Fraud', icon: 'phone-portrait-outline', color: '#EF6C00' },
  { id: 'impersonation', label: 'Impersonation/Fake Identity', icon: 'person-outline', color: '#1565C0' },
  { id: 'loan_scam', label: 'Fake Loan/Investment', icon: 'trending-up-outline', color: '#9C27B0' },
  { id: 'job_scam', label: 'Job/Advance Fee Scam', icon: 'briefcase-outline', color: '#D32F2F' },
  { id: 'other', label: 'Other Fraud', icon: 'alert-circle-outline', color: '#6B7280' },
];

// Get all reports
export const getAllReports = async () => {
  try {
    const reportsJson = await AsyncStorage.getItem(REPORTS_KEY);
    return reportsJson ? JSON.parse(reportsJson) : [];
  } catch (error) {
    console.error('Error loading reports:', error);
    return [];
  }
};

// Get reports for a specific number
export const getReportsForNumber = async (phoneNumber) => {
  try {
    const allReports = await getAllReports();
    return allReports.filter(r => r.phoneNumber === phoneNumber);
  } catch (error) {
    console.error('Error loading reports for number:', error);
    return [];
  }
};

// Check if number is flagged
export const isNumberFlagged = async (phoneNumber) => {
  const reports = await getReportsForNumber(phoneNumber);
  return reports.length > 0;
};

// Get number risk score (0-100)
export const getNumberRiskScore = async (phoneNumber) => {
  const reports = await getReportsForNumber(phoneNumber);
  
  if (reports.length === 0) return 0;
  
  // Calculate risk based on:
  // - Number of reports (more reports = higher risk)
  // - Verified reports (with evidence)
  // - Recent reports (within last 30 days)
  
  const reportCount = reports.length;
  const verifiedCount = reports.filter(r => r.hasEvidence).length;
  const recentCount = reports.filter(r => {
    const daysSince = (Date.now() - r.timestamp) / (1000 * 60 * 60 * 24);
    return daysSince <= 30;
  }).length;
  
  // Scoring algorithm
  let score = 0;
  score += Math.min(reportCount * 15, 50); // Up to 50 points for reports
  score += Math.min(verifiedCount * 20, 30); // Up to 30 points for verified reports
  score += Math.min(recentCount * 10, 20); // Up to 20 points for recent activity
  
  return Math.min(Math.round(score), 100);
};

// Add a new report
export const addReport = async (reportData) => {
  try {
    const allReports = await getAllReports();
    
    const newReport = {
      id: Date.now().toString(),
      phoneNumber: reportData.phoneNumber,
      fraudType: reportData.fraudType,
      description: reportData.description,
      amount: reportData.amount || null,
      hasEvidence: reportData.hasEvidence || false,
      timestamp: Date.now(),
      userName: reportData.userName || 'Anonymous',
      location: reportData.location || 'Kenya',
      verified: false, // Will be verified by community reactions
    };
    
    allReports.push(newReport);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(allReports));
    
    return { success: true, report: newReport };
  } catch (error) {
    console.error('Error adding report:', error);
    return { success: false, error: error.message };
  }
};

// Get comments for a number
export const getComments = async (phoneNumber) => {
  try {
    const commentsJson = await AsyncStorage.getItem(COMMENTS_KEY);
    const allComments = commentsJson ? JSON.parse(commentsJson) : [];
    return allComments.filter(c => c.phoneNumber === phoneNumber);
  } catch (error) {
    console.error('Error loading comments:', error);
    return [];
  }
};

// Add a comment
export const addComment = async (phoneNumber, commentText, userName = 'Anonymous') => {
  try {
    const commentsJson = await AsyncStorage.getItem(COMMENTS_KEY);
    const allComments = commentsJson ? JSON.parse(commentsJson) : [];
    
    const newComment = {
      id: Date.now().toString(),
      phoneNumber,
      text: commentText,
      userName,
      timestamp: Date.now(),
      reactions: { helpful: 0, confirmed: 0, disputed: 0 },
    };
    
    allComments.push(newComment);
    await AsyncStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    
    return { success: true, comment: newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error: error.message };
  }
};

// Get reactions for a report
export const getReactions = async (reportId) => {
  try {
    const reactionsJson = await AsyncStorage.getItem(REACTIONS_KEY);
    const allReactions = reactionsJson ? JSON.parse(reactionsJson) : {};
    return allReactions[reportId] || { helpful: 0, confirmed: 0, disputed: 0 };
  } catch (error) {
    console.error('Error loading reactions:', error);
    return { helpful: 0, confirmed: 0, disputed: 0 };
  }
};

// Add reaction to a report
export const addReaction = async (reportId, reactionType) => {
  try {
    const reactionsJson = await AsyncStorage.getItem(REACTIONS_KEY);
    const allReactions = reactionsJson ? JSON.parse(reactionsJson) : {};
    
    if (!allReactions[reportId]) {
      allReactions[reportId] = { helpful: 0, confirmed: 0, disputed: 0 };
    }
    
    allReactions[reportId][reactionType] = (allReactions[reportId][reactionType] || 0) + 1;
    
    await AsyncStorage.setItem(REACTIONS_KEY, JSON.stringify(allReactions));
    
    return { success: true, reactions: allReactions[reportId] };
  } catch (error) {
    console.error('Error adding reaction:', error);
    return { success: false, error: error.message };
  }
};

// Get aggregated number stats
export const getNumberStats = async (phoneNumber) => {
  const reports = await getReportsForNumber(phoneNumber);
  const comments = await getComments(phoneNumber);
  const riskScore = await getNumberRiskScore(phoneNumber);
  
  // Count fraud types
  const fraudTypeCounts = {};
  reports.forEach(report => {
    fraudTypeCounts[report.fraudType] = (fraudTypeCounts[report.fraudType] || 0) + 1;
  });
  
  // Get most common fraud type
  const mostCommonFraudType = Object.keys(fraudTypeCounts).reduce((a, b) => 
    fraudTypeCounts[a] > fraudTypeCounts[b] ? a : b, 
    'unknown'
  );
  
  return {
    phoneNumber,
    reportCount: reports.length,
    commentCount: comments.length,
    riskScore,
    mostCommonFraudType,
    fraudTypeCounts,
    firstReportDate: reports.length > 0 ? Math.min(...reports.map(r => r.timestamp)) : null,
    lastReportDate: reports.length > 0 ? Math.max(...reports.map(r => r.timestamp)) : null,
  };
};

// Get top flagged numbers (for community feed)
export const getTopFlaggedNumbers = async (limit = 50) => {
  try {
    const allReports = await getAllReports();
    
    // Group by phone number
    const numberGroups = {};
    allReports.forEach(report => {
      if (!numberGroups[report.phoneNumber]) {
        numberGroups[report.phoneNumber] = [];
      }
      numberGroups[report.phoneNumber].push(report);
    });
    
    // Create summary for each number
    const summaries = await Promise.all(
      Object.keys(numberGroups).map(async (phoneNumber) => {
        const stats = await getNumberStats(phoneNumber);
        return {
          phoneNumber,
          ...stats,
          reports: numberGroups[phoneNumber],
        };
      })
    );
    
    // Sort by risk score and report count
    summaries.sort((a, b) => {
      if (b.riskScore !== a.riskScore) return b.riskScore - a.riskScore;
      return b.reportCount - a.reportCount;
    });
    
    return summaries.slice(0, limit);
  } catch (error) {
    console.error('Error getting top flagged numbers:', error);
    return [];
  }
};

// Search numbers
export const searchNumbers = async (searchQuery) => {
  try {
    const allReports = await getAllReports();
    const query = searchQuery.toLowerCase().trim();
    
    // Filter reports that match search query
    const matchingReports = allReports.filter(report => 
      report.phoneNumber.includes(query) ||
      report.description.toLowerCase().includes(query)
    );
    
    // Get unique phone numbers
    const uniqueNumbers = [...new Set(matchingReports.map(r => r.phoneNumber))];
    
    // Get stats for each number
    const results = await Promise.all(
      uniqueNumbers.map(async (phoneNumber) => await getNumberStats(phoneNumber))
    );
    
    return results;
  } catch (error) {
    console.error('Error searching numbers:', error);
    return [];
  }
};

// Clear all data (for testing)
export const clearAllCommunityData = async () => {
  try {
    await AsyncStorage.removeItem(REPORTS_KEY);
    await AsyncStorage.removeItem(COMMENTS_KEY);
    await AsyncStorage.removeItem(REACTIONS_KEY);
    return { success: true };
  } catch (error) {
    console.error('Error clearing community data:', error);
    return { success: false, error: error.message };
  }
};
