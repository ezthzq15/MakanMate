const functions = require("firebase-functions/v1");
const app = require("./server");

// Export Express app as Firebase HTTPS Cloud Function (Gen 1)
exports.backend = functions.https.onRequest(app);
