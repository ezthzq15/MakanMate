/**
 * User Model
 * Defines the strict structure for the 'users' collection based on the class diagram.
 */
class UserModel {
  constructor({
    userID,
    userName,
    userPassword,
    userEmail,
    userPhone = "",
    userRole = "user",
    isActive = true,
    preferenceID = ""
  }) {
    this.userID = userID;
    this.userName = userName;
    this.userPassword = userPassword;
    this.userEmail = userEmail;
    this.userPhone = userPhone;
    this.userRole = userRole;
    this.isActive = isActive;
    this.preferenceID = preferenceID;
  }

  /**
   * Static method to sanitize data before sending to Firestore
   * Ensures NO invalid fields are passed to the DB.
   */
  static toFirestore(data) {
    return {
      userName: data.userName,
      userPassword: data.userPassword,
      userEmail: data.userEmail,
      userPhone: data.userPhone || "",
      userRole: data.userRole || "user",
      isActive: data.isActive ?? true,
      preferenceID: data.preferenceID || ""
    };
  }

  /**
   * Static method to create a model from Firestore data
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new UserModel({
      userID: doc.id,
      userName: data.userName,
      userPassword: data.userPassword,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      userRole: data.userRole,
      isActive: data.isActive,
      preferenceID: data.preferenceID
    });
  }
}

module.exports = UserModel;
