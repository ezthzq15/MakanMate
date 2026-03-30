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
    accountStatus = 0,
    lastLoginAt = null,
    preferenceID = ""
  }) {
    this.userID = userID;
    this.userName = userName;
    this.userPassword = userPassword;
    this.userEmail = userEmail;
    this.userPhone = userPhone;
    this.userRole = userRole;
    this.accountStatus = accountStatus;
    this.lastLoginAt = lastLoginAt;
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
      accountStatus: data.accountStatus !== undefined ? data.accountStatus : 0,
      lastLoginAt: data.lastLoginAt || null,
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
      accountStatus: data.accountStatus !== undefined ? data.accountStatus : 0,
      lastLoginAt: data.lastLoginAt || null,
      preferenceID: data.preferenceID
    });
  }
}

module.exports = UserModel;
