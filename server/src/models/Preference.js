class Preference {
  constructor({
    preferenceID,
    userId,
    cuisines = [],
    halal = false,
    spiceLevel = "MEDIUM",
    budgetRange = "RM10–20"
  }) {
    this.preferenceID = preferenceID;
    this.userId = userId;
    this.cuisines = cuisines;
    this.halal = halal;
    this.spiceLevel = spiceLevel;
    this.budgetRange = budgetRange;
  }

  static toFirestore(data) {
    return {
      userId: data.userId,
      cuisines: data.cuisines || [],
      halal: data.halal ?? false,
      spiceLevel: data.spiceLevel || "MEDIUM",
      budgetRange: data.budgetRange || "RM10–20",
      updatedAt: new Date().toISOString()
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Preference({
      preferenceID: doc.id,
      userId: data.userId,
      cuisines: data.cuisines,
      halal: data.halal,
      spiceLevel: data.spiceLevel,
      budgetRange: data.budgetRange
    });
  }
}

module.exports = Preference;
