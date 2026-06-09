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
    // Diagnostic log — helps detect if old FormData code is still cached on client
    console.log('[submitReview] content-type:', req.headers['content-type']);
    console.log('[submitReview] body keys:', Object.keys(req.body || {}));

    const { stallId, rating, comment, imageBase64, imageMimeType } = req.body;
    const { userID, userName } = req.user;

    if (!userID) return res.status(401).json({ error: 'Unauthorized: no user ID in token' });
    if (!stallId) return res.status(400).json({ error: 'Missing required field: stallId. Body received: ' + JSON.stringify(Object.keys(req.body || {})) });

    let imageURL = null;

    if (imageBase64) {
      const fileBuffer = Buffer.from(imageBase64, 'base64');
      const mimeType = imageMimeType || 'image/jpeg';
      imageURL = await reviewService.uploadReviewImage(userID, stallId, fileBuffer, mimeType);
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
