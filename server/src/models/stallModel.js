/**
 * FoodStall Model
 */
class StallModel {
  constructor({
    stallID,
    stallName,
    cuisineType,
    isHalal,
    latitude,
    longitude,
    description,
    operatingHours,
    imageURL
  }) {
    this.stallID = stallID;
    this.stallName = stallName;
    this.cuisineType = cuisineType;
    this.isHalal = isHalal;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.operatingHours = operatingHours;
    this.imageURL = imageURL;
  }

  static toFirestore(data) {
    return {
      stallName: data.stallName,
      cuisineType: data.cuisineType,
      isHalal: data.isHalal ?? false,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description || "",
      operatingHours: data.operatingHours || "",
      imageURL: data.imageURL || ""
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new StallModel({
      stallID: doc.id,
      stallName: data.stallName,
      cuisineType: data.cuisineType,
      isHalal: data.isHalal,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      operatingHours: data.operatingHours,
      imageURL: data.imageURL
    });
  }
}

module.exports = StallModel;
