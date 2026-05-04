/**
 * Menu Model
 * Fields: menuID, menuName, menuPrice, menuPic, createdDate, lastUpdated, stallID
 * Extended fields: itemDescription, isAvailable, category
 */
class MenuModel {
  constructor({
    menuID,
    menuName,
    menuPrice,
    menuPic,
    itemDescription,
    isAvailable,
    category,
    likes,
    createdDate,
    lastUpdated,
    stallID
  }) {
    this.menuID = menuID;
    this.menuName = menuName;
    this.menuPrice = menuPrice;
    this.menuPic = menuPic;
    this.itemDescription = itemDescription;
    this.isAvailable = isAvailable;
    this.category = category;
    this.likes = likes || 0;
    this.createdDate = createdDate;
    this.lastUpdated = lastUpdated;
    this.stallID = stallID;
  }

  static toFirestore(data) {
    const now = new Date().toISOString();
    return {
      menuName: data.menuName,
      menuPrice: Number(data.menuPrice) || 0,
      menuPic: data.menuPic || "",
      itemDescription: data.itemDescription || "",
      isAvailable: data.isAvailable !== false,
      category: data.category || "Others",
      likes: data.likes || 0,
      createdDate: data.createdDate || now,
      lastUpdated: now,
      stallID: data.stallID
    };
  }

  static fromFirestore(doc) {
    const data = doc.data();
    return new MenuModel({
      menuID: doc.id,
      menuName: data.menuName,
      menuPrice: data.menuPrice,
      menuPic: data.menuPic,
      itemDescription: data.itemDescription,
      isAvailable: data.isAvailable,
      category: data.category,
      likes: data.likes || 0,
      createdDate: data.createdDate,
      lastUpdated: data.lastUpdated,
      stallID: data.stallID
    });
  }
}

module.exports = MenuModel;
