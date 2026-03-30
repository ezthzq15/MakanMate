class PreferenceModel {
  constructor({
    preferenceID,
    userID,
    cuisineType = [],
    isHalal = false,
    spicyLevel = "MEDIUM",
    budgetAmount = 2,
    preferredDistance = null,
    dietaryRestrictions = null,
    allergyInfo = null
  }) {
    this.preferenceID = preferenceID;
    this.userID = userID;
    this.cuisineType = cuisineType;
    this.isHalal = isHalal;
    this.spicyLevel = spicyLevel;
    this.budgetAmount = budgetAmount;
    this.preferredDistance = preferredDistance;
    this.dietaryRestrictions = dietaryRestrictions;
    this.allergyInfo = allergyInfo;
  }

  static toFirestore(data) {
    return {
      userID: data.userID,
      cuisineType: data.cuisineType || [],
      isHalal: data.isHalal ?? false,
      spicyLevel: data.spicyLevel || "MEDIUM",
      budgetAmount: data.budgetAmount || 2,
      preferredDistance: data.preferredDistance ?? null,
      dietaryRestrictions: data.dietaryRestrictions ?? null,
      allergyInfo: data.allergyInfo ?? null
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new PreferenceModel({
      preferenceID: doc.id,
      userID: data.userID,
      cuisineType: data.cuisineType,
      isHalal: data.isHalal,
      spicyLevel: data.spicyLevel,
      budgetAmount: data.budgetAmount,
      preferredDistance: data.preferredDistance,
      dietaryRestrictions: data.dietaryRestrictions,
      allergyInfo: data.allergyInfo
    });
  }
}

module.exports = PreferenceModel;
