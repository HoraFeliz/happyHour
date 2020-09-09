const Place = require("../models/place.model");
const Tour = require("../models/tour.model");
const mongoose = require("mongoose");

module.exports.getTour = (req, res, next) => {
  Tour.findById(req.params.id)
    .populate("places")
    .then((tour) => {
      // return res.status(200).json(tour.places)
      res.render("tours/tour", {
        layout: "layout-nofooter",
        tour
      });
    })
    .catch(next);
};

module.exports.startTour = (req, res, next) => {
  Tour.findById(req.params.id)
    .populate("places")
    .then((tour) => {
      // return res.status(200).json(tour.places)
      res.render("tours/start", {
        layout: "layout",
        tour
      });
    })
    .catch(next);
};

// module.exports.startTour = (req, res, next) => {
//   const places = [];
//   let tourById;
//   Tour.findById(req.params.id)
//     .populate("place")
//     .then((tour) => {
//       tourById = tour;
//       const placesInTour = tour.places;
//       placesInTour.forEach((placeId) => {
//         Place.findById(placeId).then((place) => {
//           places.push(place);
//         });
//       });
//     })
//     .catch(next);
//   setTimeout(() => {
//     // console.log(`Tour: ${tourById}, places in tour: ${places}`);
//     res.render("tours/start", {
//       layout: "layout",
//       tour: tourById,
//       places,
//     });
//   }, 100);
// };

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
      //res.render("tours/form-2", { tour });
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
  const tourId = req.params.id;
  Tour.findById(tourId)
    .populate("places")
    .then((tour) => {
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

// module.exports.delete = (req, res, next) => {
//   req.place
//     .remove()
//     .then(() => {
//       res.redirect("/tours/form-2");
//     })
//     .catch(next);
// };

// module.exports.new = (req, res, next) => {
//   User.find({ staff: true })
//     .then((staffUsers) => {
//       res.render("places/new", { staffUsers });
//     })
//     .catch(next);
// };

// module.exports.create = (req, res, next) => {
//   const place = new Place({
//     ...req.body,
//     image: req.file ? req.file.path : undefined,
//     owner: req.currentUser._id,
//   });

//   place
//     .save()
//     .then((place) => {
//       res.redirect(`/places/${place._id}`);
//     })
//     .catch((error) => {
//       if (error instanceof mongoose.Error.ValidationError) {
//         User.find({ staff: true })
//           .then((staffUsers) => {
//             res.render("places/new", {
//               error: error.errors,
//               place,
//               staffUsers,
//             });
//           })
//           .catch(next);
//       } else {
//         next(error);
//       }
//     });
// };

// module.exports.list = (req, res, next) => {
//   const criteria = {};

//   if (req.query.search) {
//     res.locals.search = req.query.search;
//     criteria["$or"] = [
//       { name: new RegExp(req.query.search, "i") },
//       { ["owner.name"]: new RegExp(req.query.search, "i") },
//       { ["staff.name"]: new RegExp(req.query.search, "i") },
//     ];
//   }

//   Place.find(criteria)
//     .populate("owner")
//     .populate("staff")
//     .populate("likes")

//     .then((places) => {
//       res.render("places/list", { places });
//     })
//     .catch(next);
// };

// module.exports.like = (req, res, next) => {
//   const params = { place: req.params.id, user: req.currentUser._id };

//   Like.findOne(params)
//     .then((like) => {
//       if (like) {
//         Like.findByIdAndRemove(like._id)
//           .then(() => {
//             res.json({ like: -1 });
//           })
//           .catch(next);
//       } else {
//         const newLike = new Like(params);

//         newLike
//           .save()
//           .then(() => {
//             res.json({ like: 1 });
//           })
//           .catch(next);
//       }
//     })
//     .catch(next);
// };

// module.exports.createTourStep2 = (req, res, next) => {
//   Place.find(req.query.search)

//     .then((places) => {
//       res.render("tours/form-2", { places });
//     })
//     .catch(next);
// };
