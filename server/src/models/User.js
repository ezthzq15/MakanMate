/**
 * User Model
 * Defines the strict structure for the 'users' collection based on the class diagram.
 */
class User {
  constructor({
    userID,
    userName,
    userPassword,
    userEmail,
    userPhone = "",
    userRole = "user",
    accountStatus = 0,
    lastLoginAt = null,
    preferenceID = "",
    profilePic = null,
    address = "",
    gender = null,
    birthday = null
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
    this.profilePic = profilePic;
    this.address = address;
    this.gender = gender;
    this.birthday = birthday;
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
      preferenceID: data.preferenceID || "",
      profilePic: data.profilePic || null,
      address: data.address || "",
      gender: data.gender || null,
      birthday: data.birthday || null
    };
  }

  /**
   * Static method to create a model from Firestore data
   */
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      userID: doc.id,
      userName: data.userName,
      userPassword: data.userPassword,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      userRole: data.userRole,
      accountStatus: data.accountStatus !== undefined ? data.accountStatus : 0,
      lastLoginAt: data.lastLoginAt || null,
      preferenceID: data.preferenceID,
      profilePic: data.profilePic || null,
      address: data.address || "",
      gender: data.gender || null,
      birthday: data.birthday || null
    });
  }
}

module.exports = User;
