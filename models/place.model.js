const mongoose = require("mongoose");
const Comment = require("./comment.model");
const Like = require("./like.model");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Place title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
      required: [true, "Place url is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

placeSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "place",
  justOne: false,
});

placeSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "place",
  count: true,
});

placeSchema.post("remove", function (next) {
  Promise.all([
    Like.deleteMany({ place: this._id }),
    Comment.deleteMany({ place: this._id }),
  ]).then(next);
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;
