/**
 * Rating Model
 */
class RatingModel {
  constructor({
    ratingID,
    ratingScore,
    comments,
    userID,
    stallID,
    ratingDate
  }) {
    this.ratingID = ratingID;
    this.ratingScore = ratingScore;
    this.comments = comments;
    this.userID = userID;
    this.stallID = stallID;
    this.ratingDate = ratingDate;
  }

  static toFirestore(data) {
    return {
      ratingScore: data.ratingScore,
      comments: data.comments || "",
      userID: data.userID,
      stallID: data.stallID,
      ratingDate: data.ratingDate || new Date().toISOString()
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new RatingModel({
      ratingID: doc.id,
      ratingScore: data.ratingScore,
      comments: data.comments,
      userID: data.userID,
      stallID: data.stallID,
      ratingDate: data.ratingDate
    });
  }
}

module.exports = RatingModel;
