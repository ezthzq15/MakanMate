const reviewService = require('../services/reviewService');
const bookmarkService = require('../services/bookmarkService');
const path = require('path');
const fs = require('fs');

/**
 * Controller: UC007 Bookmark
 */
const toggleBookmark = async (req, res) => {
  try {
    const { stallId } = req.body;
    const userId = req.user.userID;
    const result = await bookmarkService.toggleBookmark(userId, stallId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkBookmark = async (req, res) => {
  try {
    const { stallId } = req.params;
    const userId = req.user?.userID;
    const saved = await bookmarkService.isBookmarked(userId, stallId);
    res.status(200).json({ saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user.userID;
    const bookmarks = await bookmarkService.getUserFullBookmarks(userId);
    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: UC008 Review — Submit (with optional photo)
 */
const submitReview = async (req, res) => {
  try {
    const { stallId, stallName, rating, comment } = req.body;
    const { userID, userName } = req.user;

    let imageURL = null;

    if (req.file) {
      // Sanitize stall name for use as a folder name
      const sanitized = (stallName || 'Unknown_Stall')
        .replace(/[<>:"/\\|?*]/g, '')   // strip invalid filesystem chars
        .trim()
        .replace(/\s+/g, '_');

      const ext = path.extname(req.file.originalname) || 
                  '.' + req.file.mimetype.split('/')[1];
      const filename = `${Date.now()}${ext}`;

      // Path on disk: client/public/Rate_Review/Stalls/{stallName}/{userId}/
      const uploadDir = path.join(
        __dirname, '../../../client/public/Rate_Review/Stalls',
        sanitized, userID
      );

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);

      // URL relative to client's public folder root
      imageURL = `/Rate_Review/Stalls/${sanitized}/${userID}/${filename}`;
    }

    const result = await reviewService.submitReview(
      userID, userName, stallId, rating, comment, imageURL
    );
    res.status(200).json(result);
  } catch (error) {
    console.error('[Submit Review Error]:', error.message, error.stack);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all reviews for a stall (public comment feed)
 */
const getStallReviews = async (req, res) => {
  try {
    const { stallId } = req.params;
    const reviews = await reviewService.getStallReviews(stallId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get the current user's review for a stall
 */
const getUserReview = async (req, res) => {
  try {
    const { stallId } = req.params;
    const userId = req.user.userID;
    const review = await reviewService.getUserReview(userId, stallId);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const menuEngagementService = require('../services/menuEngagementService');

/**
 * Controller: Toggle Like on Menu Item
 */
const toggleMenuLike = async (req, res) => {
  try {
    const { menuId } = req.body;
    const userId = req.user.userID;
    const result = await menuEngagementService.toggleLike(userId, menuId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  toggleBookmark,
  checkBookmark,
  getMyBookmarks,
  submitReview,
  getStallReviews,
  getUserReview,
  toggleMenuLike
};
