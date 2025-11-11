const mongoose = require("mongoose");
const useSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  fullName: { type: String, requires: true },
  email: { type: String, requires: true },
  phone: { type: String, requires: true },
  password: { type: String, requires: true },
  imageURL: { type: String, requires: true },
  imageID: { type: String, requires: true },
});

module.exports = mongoose.model("User", useSchema);
