/**
 * FoodStall Model
 */
class Stall {
  constructor({
    stallID,
    stallName,
    cuisineType,
    isHalal,
    isMuslimFriendly,
    latitude,
    longitude,
    description,
    operatingHours,
    operatingDays,
    specialHours,
    imageURL
  }) {
    this.stallID = stallID;
    this.stallName = stallName;
    this.cuisineType = cuisineType;
    this.isHalal = isHalal;
    this.isMuslimFriendly = isMuslimFriendly ?? false;
    this.latitude = latitude;
    this.longitude = longitude;
    this.description = description;
    this.operatingHours = operatingHours;
    this.operatingDays = operatingDays;
    this.specialHours = specialHours;
    this.imageURL = imageURL;
  }

  static toFirestore(data) {
    return {
      stallName: data.stallName,
      cuisineType: data.cuisineType,
      isHalal: data.isHalal ?? false,
      isMuslimFriendly: data.isMuslimFriendly ?? false,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description || "",
      operatingHours: data.operatingHours || "",
      operatingDays: data.operatingDays || "",
      specialHours: data.specialHours || "",
      imageURL: data.imageURL || ""
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new Stall({
      stallID: doc.id,
      stallName: data.stallName,
      cuisineType: data.cuisineType,
      isHalal: data.isHalal,
      isMuslimFriendly: data.isMuslimFriendly ?? false,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      operatingHours: data.operatingHours,
      operatingDays: data.operatingDays,
      specialHours: data.specialHours,
      imageURL: data.imageURL
    });
  }
}

module.exports = Stall;
