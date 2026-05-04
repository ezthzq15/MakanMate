const { db, storage } = require('../config/firebase');

/**
 * Service: UC008 Rate & Review — Comment Section with Photo Upload
 * Design decisions:
 * - Uses 'Ratings' collection (matches Rating.js model field names)
 * - All sorts done in-memory to avoid composite Firestore indexes
 * - Upsert detection done by fetching user's review first (single where)
 * - _syncStallRating uses set+merge so it works on stalls with no rating field yet
 */
class ReviewService {

  async submitReview(userId, userName, stallId, ratingScore, comments, imageURL = null) {
    if (!userId || !stallId) throw new Error('Missing required fields: userId and stallId');
    if (!ratingScore || Number(ratingScore) === 0) throw new Error('A star rating is required');

    const now = new Date().toISOString();
    const reviewData = {
      userID: userId,
      userName: userName || 'Anonymous',
      stallID: stallId,
      ratingScore: Number(ratingScore),
      comments: comments || '',
      ratingDate: now,
      ...(imageURL ? { imageURL } : {})
    };

    // Always insert a new review — multiple reviews per user allowed
    await db.collection('Ratings').add(reviewData);

    // Sync aggregate rating back to stall document
    await this._syncStallRating(stallId);

    return reviewData;
  }

  async uploadReviewImage(userId, stallId, fileBuffer, mimeType) {
    if (!storage) throw new Error('Firebase Storage is not configured on this server');

    const filename = `reviews/${stallId}/${userId}_${Date.now()}`;
    const file = storage.file(filename);

    await file.save(fileBuffer, {
      metadata: { contentType: mimeType },
      public: true
    });

    return `https://storage.googleapis.com/${storage.name}/${filename}`;
  }

  // Fetch all reviews for a stall — single where, sorted in-memory
  async getStallReviews(stallId) {
    const snapshot = await db.collection('Ratings')
      .where('stallID', '==', stallId)
      .get();

    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.ratingDate) - new Date(a.ratingDate));
  }

  // Get a specific user's review for a stall — single where, filtered in-memory
  async getUserReview(userId, stallId) {
    if (!userId || !stallId) return null;

    const snapshot = await db.collection('Ratings')
      .where('userID', '==', userId)
      .get();

    const match = snapshot.docs.find(doc => doc.data().stallID === stallId);
    if (!match) return null;
    return { id: match.id, ...match.data() };
  }

  async _syncStallRating(stallId) {
    const reviews = await this.getStallReviews(stallId);
    if (reviews.length === 0) return;

    const total = reviews.reduce((sum, r) => sum + (r.ratingScore || 0), 0);
    const average = parseFloat((total / reviews.length).toFixed(1));

    // set+merge works whether or not rating/reviewCount fields exist yet
    await db.collection('FoodStalls').doc(stallId).set(
      { rating: average, reviewCount: reviews.length },
      { merge: true }
    );
  }
}

module.exports = new ReviewService();
