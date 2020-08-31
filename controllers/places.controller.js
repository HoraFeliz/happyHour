const Place = require("../models/place.model");
const Review = require("../models/review.model");
const User = require("../models/user.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");
const axios = require("axios");

// GET /places/:id
module.exports.show = (req, res, next) => {
  console.log(`req.params.id: ` + req.params.id);
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
      console.log(place);
      res.render("places/show", { place });
    })
    .catch(next);
};

module.exports.searchPlace = async (req, res, next) => {
  const key = process.env.GOOGLE_API_KEY;
  const placeName = req.body.name;

  const mapsApiUrl = "https://maps.googleapis.com/maps/api/place";
  const inputTypeSearch =
    "textquery&fields=photos,place_id,types,formatted_address,name,rating,geometry";
  const fields =
    "formatted_phone_number,address_components,reviews,website,opening_hours,price_level";

  // Call Place Details request of Google Places, it needs a place_id,  we get the place_id from the Place Search request
  const getPlaceDetails = async (dataByName) => {
    const response = axios.get(
      `${mapsApiUrl}/details/json?place_id=${dataByName.data.candidates[0].place_id}&fields=${fields}&key=${key}`
    );
    if (response) {
      const data = await response;
      return data;
    } else {
      throw new Error("Unable to get place details");
    }
  };

  const getPlacesInfo = async () => {
    try {
      const dataByName = await axios.get(
        `${mapsApiUrl}/findplacefromtext/json?input=${placeName}&inputtype=${inputTypeSearch}&key=${key}`
      );

      const imgSrc = {
        imgSrc: `${mapsApiUrl}/photo?maxwidth=400&photoreference=${dataByName.data.candidates[0].photos[0].photo_reference}&key=${key}`,
      };

      getPlaceDetails(dataByName)
        .then((response) => {
          const dataById = response.data.result;

          const dataObject = {
            ...dataById,
            ...dataByName.data.candidates[0],
            ...imgSrc,
          };
          console.log(dataObject.opening_hours);

          const place = new Place({
            name: dataObject.name,
            description: dataObject.types.join(","),
            tags: dataObject.types,
            url: dataObject.website,
            image: dataObject.imgSrc,
            owner: req.currentUser._id,
            address: dataObject.formatted_address,
            city: dataObject.address_components[2].long_name,
            location: {
              type: "Point",
              coordinates: [
                dataObject.geometry.location.lat,
                dataObject.geometry.location.lng,
              ],
            },
            isOpen: dataObject.opening_hours.open_now,
            openingHours: dataObject.opening_hours.weekday_text,
            rating: dataObject.rating,
            priceLevel: dataObject.price_level,
          });

          console.log("city", place.city);

          place
            .save()
            .then((place) => {
              dataObject.reviews.map((reviewItem) => {
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
              res.json(place);
            })
            .catch((error) => {
              if (error instanceof mongoose.Error.ValidationError) {
                console.log("Validation error saving place to db", error);
              } else {
                next(error);
              }
            });
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
        });
    } catch (err) {
      console.log(err);
    }
  };

  getPlacesInfo();
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
