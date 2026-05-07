const { db } = require('../config/firebase');
const stallManagementService = require('../services/stallManagementService');
const userManagementService  = require('../services/userManagementService');

/**
 * CONTROLLER: adminController
 * Handles high-level admin dashboard aggregations.
 */
const getDashboard = async (req, res) => {
  try {
    const [stalls, users] = await Promise.all([
      stallManagementService.getAllStalls(),
      userManagementService.getAllUsers(),
    ]);

    const totalStalls = stalls.length;
    const totalUsers  = users.length;

    // Top 5 stalls by review count / rating
    const topStalls = [...stalls]
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, 5)
      .map(s => ({
        id:            s.stallID || s.id,
        name:          s.stallName,
        category:      s.cuisineType || '—',
        rating:        s.overallRating || 0,
        reviews:       s.reviewCount   || 0,
        status:        s.accountStatus === 0 || s.accountStatus === undefined ? 'ACTIVE' : 'INACTIVE',
        imageURL:      s.imageURL || '',
      }));

    // Most popular stall
    const mostPopular = topStalls[0] || null;

    // Calculate real performance data (Reviews + Bookmarks per day for last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [allRatingsSnap, allBookmarksSnap, allLikesSnap] = await Promise.all([
      db.collection('Ratings').get(),
      db.collection('Bookmarks').get(),
      db.collection('menuLikes').get(),
    ]);

    const dailyActivity = DAYS.map((day, index) => {
      // Logic to find matches for each day of the week
      const dayIndex = (new Date().getDay() - (6 - index) + 7) % 7; 
      
      const dayRatings = allRatingsSnap.docs.filter(doc => {
        const d = new Date(doc.data().ratingDate);
        return d.getDay() === dayIndex && d >= sevenDaysAgo;
      }).length;

      const dayBookmarks = allBookmarksSnap.docs.filter(doc => {
        const d = new Date(doc.data().createdAt);
        return d.getDay() === dayIndex && d >= sevenDaysAgo;
      }).length;

      const dayLikes = allLikesSnap.docs.filter(doc => {
        const d = new Date(doc.data().timestamp);
        return d.getDay() === dayIndex && d >= sevenDaysAgo;
      }).length;

      return {
        day,
        interactions: dayRatings + dayBookmarks + dayLikes,
        reviews: dayRatings,
        bookmarks: dayBookmarks,
        likes: dayLikes
      };
    });

    return res.status(200).json({
      totalStalls,
      totalUsers,
      topStalls,
      mostPopular,
      dailyActivity, // Real chart data
    });
  } catch (err) {
    console.error('getDashboard Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

module.exports = {
  getDashboard
};
