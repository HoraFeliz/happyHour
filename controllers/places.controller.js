const Place = require("../models/place.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");
const axios = require("axios");

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// GET /places/:id
module.exports.show = (req, res, next) => {
  Place.findById(req.params.id)
    .populate("owner")
    .populate("likes")
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
      res.render("places/show", { place });
    })
    .catch(next);
};

module.exports.getPlaceByName = async (req, res, next) => {
  const key = process.env.GOOGLE_API_KEY;
  try {
    const placeName = req.body.name;
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${placeName}&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=${key}`
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
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

module.exports.edit = (req, res, next) => {
  User.find({ staff: true })
    .then((staffUsers) => {
      res.render("places/edit", { staffUsers, place: req.place });
    })
    .catch(next);
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

module.exports.delete = (req, res, next) => {
  req.place
    .remove()
    .then(() => {
      res.redirect("/places");
    })
    .catch(next);
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
