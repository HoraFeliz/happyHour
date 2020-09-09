const mongoose = require("mongoose");
const Comment = require("./comment.model");
const Place = require('./place.model')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Tour description is required"],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "/img/tour-def-icon.png",
    },
    recommended: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    places: {
      type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Place"
      }]
      // unique: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
);


tourSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "tour",
  justOne: false,
});

tourSchema.post("remove", function (next) {
  Promise.all([Comment.deleteMany({ place: this._id })]).then(next);
});

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
