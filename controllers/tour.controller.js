const Place = require("../models/place.model");
const Review = require("../models/review.model");
const Tour = require("../models/tour.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");

module.exports.new = (req, res, next) => {
  res.render("tours/form");
};
