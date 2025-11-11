// import the required library
const mongoose = require("mongoose");

// This courseSchema defines the blueprint for how Course documents are stored in MongoDB (name, price, description, dates, user, image info).
const courseSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  courseName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  uId: { type: String, required: true }, 
  imageURL: { type: String, required: true },
  imageId: { type: String, required: true },
});

// export the schema
module.exports = mongoose.model("Course", courseSchema);
