/**
 * LoginSession Model
 */
class SessionModel {
  constructor({
    sessionID,
    userID,
    loginTime,
    expiryTime
  }) {
    this.sessionID = sessionID;
    this.userID = userID;
    this.loginTime = loginTime;
    this.expiryTime = expiryTime;
  }

  static toFirestore(data) {
    return {
      userID: data.userID,
      loginTime: data.loginTime || new Date().toISOString(),
      expiryTime: data.expiryTime
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new SessionModel({
      sessionID: doc.id,
      userID: data.userID,
      loginTime: data.loginTime,
      expiryTime: data.expiryTime
    });
  }
}

module.exports = SessionModel;
