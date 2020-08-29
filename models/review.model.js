const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    autorName: String,
    autorUrl: String,
    autorPhoto: String,
    rating: Number,
    relativeTimeDesc: String,
    text: String,
    time: Date,
    place: {
      type: mongoose.Schema.ObjectId,
      ref: "Place",
      required: [true, "Review must belong to a place."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
