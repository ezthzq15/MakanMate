/**
 * Bookmark Model
 */
class Bookmark {
  constructor({
    bookmarkID,
    userID,
    stallID,
    createdDate,
    isActive = true
  }) {
    this.bookmarkID = bookmarkID;
    this.userID = userID;
    this.stallID = stallID;
    this.createdDate = createdDate;
    this.isActive = isActive;
  }

  static toFirestore(data) {
    return {
      userID: data.userID,
      stallID: data.stallID,
      createdDate: data.createdDate || new Date().toISOString(),
      isActive: data.isActive ?? true
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Bookmark({
      bookmarkID: doc.id,
      userID: data.userID,
      stallID: data.stallID,
      createdDate: data.createdDate,
      isActive: data.isActive
    });
  }
}

module.exports = Bookmark;
