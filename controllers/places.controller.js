const Place = require("../models/place.model");
const Tour = require("../models/tour.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");

module.exports.getList = (req, res, next) => {
  Tour.findById(req.params.id)
    .populate("places")
    .then((tour) => {
      if (tour) {
        //const placesInTour = tour.places;
        res.render("tours/form-2", { places: tour.places, tour });
      } else {
        console.log("Couldn´t update tour with list of places");
      }
    })
    .catch(next);
};
// GET /places/:id
module.exports.show = (req, res, next) => {
  console.log(`req.params.id: ` + req.params.id);
  Place.findById(req.params.id)
    .populate("owner")
    .populate("likes")
    .populate("reviews")
    .populate({
      path: "comments",
      options: {
        sort: {
          createdAt: -1,
        },
      },
      populate: "user",
    })
    .then((place) => {
      console.log(place);
      res.render("places/show", {
        layout: "layout-detail",
        place
      });
    })
    .catch(next);
};

module.exports.getPlaceByTag = (req, res, next) => {
  const tag = req.params.tag.toLowerCase();
  console.log("tag", tag);
  Place.find({ tags: tag })
    .then((places) => {
      res.json({ places });
    })
    .catch(next);
};

module.exports.goToSearch = (req, res, next) => {
  res.render("places/search");
};
module.exports.edit = (req, res, next) => {
  User.find({ staff: true })
    .then((staffUsers) => {
      res.render("places/edit", { staffUsers, place: req.place });
    })
    .catch(next);
};

module.exports.addPlace = (req, res, next) => {
  const tourId = req.params.id;

  const placeFromDb = JSON.parse(req.body.placeData);
  const place = new Place({
    name: placeFromDb.name,
    tags: placeFromDb.tags,
    city: placeFromDb.city,
    image: placeFromDb.imgSrc,
    owner: req.currentUser._id,
    location: {
      type: "Point",
      coordinates: [
        placeFromDb.geometry.longitude,
        placeFromDb.geometry.latitude,
      ],
    },
    url: placeFromDb.website,
    address: placeFromDb.formatted_address,
    isOpen: placeFromDb.opening_hours.open_now,
    openingHours: placeFromDb.opening_hours.weekday_text,
    rating: placeFromDb.rating,
    priceLevel: placeFromDb.price_level,
  });

  place
    .save()
    .then((place) => {
      placeFromDb.reviews.map((reviewItem) => {
        let review = new Review({
          autorName: reviewItem.author_name,
          autorUrl: reviewItem.author_url,
          autorPhoto: reviewItem.profile_photo_url,
          rating: reviewItem.rating,
          relativeTimeDesc: reviewItem.relative_time_description,
          text: reviewItem.text,
          time: reviewItem.time,
          place: place._id,
        });
        review.save();
      });
      Tour.findByIdAndUpdate(
        tourId,
        {
          $push: { places: place },
        },
        { runValidators: true, new: true, useFindAndModify: false }
      )
        .populate("places")
        .then((tour) => {
          let tourRating;
          if (tour) {
            if (!tour.rating) {
              const fixedRating = place.rating.toFixed(1);
              tourRating = fixedRating;
            } else {
              const average = ((tour.rating + place.rating) / 2).toFixed(1);
              tourRating = average;
            }
            Tour.findByIdAndUpdate(tourId, {
              $set: {
                rating: tourRating,
              },
            })
              .then(() => {
                res.redirect(`/tours/form-2/added/${tour.id}`);
              })
              .catch(next);
          } else {
            console.log("Couldn´t update tour with list of places");
          }
        })
        .catch(next);
    })

    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        console.log("Validation error saving place to db", error);
      } else {
        console.log("error", error);
        next(error);
      }
    });
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

module.exports.new = (req, res, next) => {
  User.find({ staff: true })
    .then((staffUsers) => {
      res.render("places/new", { staffUsers });
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  const place = new Place({
    ...req.body,
    image: req.file ? req.file.path : undefined,
    owner: req.currentUser._id,
  });

  place
    .save()
    .then((place) => {
      res.redirect(`/places/${place._id}`);
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        User.find({ staff: true })
          .then((staffUsers) => {
            res.render("places/new", {
              error: error.errors,
              place,
              staffUsers,
            });
          })
          .catch(next);
      } else {
        next(error);
      }
    });
};

module.exports.list = (req, res, next) => {
  const criteria = {};

  if (req.query.search) {
    res.locals.search = req.query.search;
    criteria["$or"] = [
      { name: new RegExp(req.query.search, "i") },
      { ["owner.name"]: new RegExp(req.query.search, "i") },
      { ["staff.name"]: new RegExp(req.query.search, "i") },
    ];
  }

  Place.find(criteria)
    .populate("owner")
    .populate("staff")
    .populate("likes")

    .then((places) => {
      res.render("places/list", { places });
    })
    .catch(next);
};

module.exports.like = (req, res, next) => {
  const params = { place: req.params.id, user: req.currentUser._id };

  Like.findOne(params)
    .then((like) => {
      if (like) {
        Like.findByIdAndRemove(like._id)
          .then(() => {
            res.json({ like: -1 });
          })
          .catch(next);
      } else {
        const newLike = new Like(params);

        newLike
          .save()
          .then(() => {
            res.json({ like: 1 });
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports.delete = (req, res, next) => {
  const tourId = req.body.tourId;
  Place.findByIdAndDelete(req.params.place).then((places) => {
    console.log(tourId);
    Tour.findByIdAndUpdate(
      tourId,
      {
        $pull: { places: req.params.place },
      },
      { runValidators: true, new: true, useFindAndModify: false }
    )
      .populate("places")
      .then((tour) => {
        if (tour) {
          res.redirect(`/tours/form-2/added/${tour.id}`);
        } else {
          console.log("Couldn´t update tour with list of places");
        }
      })
      .catch(next);
  });
};
