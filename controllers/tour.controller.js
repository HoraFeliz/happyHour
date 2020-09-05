const Place = require("../models/place.model");
const Tour = require("../models/tour.model");
const mailer = require("../config/mailer.config");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const mongoose = require("mongoose");

module.exports.addTour = (req, res, next) => {
  const name = req.body.tourName;
  const description = req.body.tourDescription;
  const tour = new Tour({
    name,
    description,
    owner: req.currentUser._id,
    image: req.file ? req.file.path : undefined,
  });

  tour
    .save()
    .then(() => {
      console.log("tour", tour);
      res.redirect(`/tours/form-2/${tour.id}`);
    })
    .catch((err) => console.log("err saving tour:", err));
};

module.exports.update = (req, res, next) => {
  const body = req.body;

  if (req.file) {
    body.image = req.file.path;
  }

  const place = req.place;

  place.set(body);
  place
    .save()
    .then(() => {
      res.redirect(`/places/${place.id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("places/edit", { error: error.errors, place });
      } else {
        next(error);
      }
    });
};

module.exports.list = (req, res, next) => {
  Tour.find(req.query.search)

    .then((tours) => {
      res.render("tours/list", { tours });
    })
    .catch(next);
};

module.exports.createTourStep2 = (req, res, next) => {
  console.log("test test *******+", req.params);
  const tourId = req.params.id;
  Tour.findById(tourId)
    .populate("places")
    .then((tour) => {
      console.log("test **********", tour);
      res.render("tours/form-2", { tour });
    })
    .catch(next);
};

module.exports.createTourStep = (req, res, next) => {
  Place.find(req.query.search)

    .then((places) => {
      res.render("tours/form-1", { places });
    })
    .catch(next);
};
