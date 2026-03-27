/**
 * UserPreferences Model
 * Defines the strict structure for the 'userPreferences' collection based on the class diagram.
 */
class PreferenceModel {
  constructor({
    preferenceID,
    cuisineType = [],
    isHalal = false,
    spicyLevel = "MEDIUM",
    budgetAmount = 2,
    preferredDistance = "",
    dietaryRestrictions = "",
    allergyInfo = ""
  }) {
    this.preferenceID = preferenceID;
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
      cuisineType: data.cuisineType || [],
      isHalal: data.isHalal ?? false,
      spicyLevel: data.spicyLevel || "MEDIUM",
      budgetAmount: data.budgetAmount || 2,
      preferredDistance: data.preferredDistance || "",
      dietaryRestrictions: data.dietaryRestrictions || "",
      allergyInfo: data.allergyInfo || ""
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new PreferenceModel({
      preferenceID: doc.id,
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
