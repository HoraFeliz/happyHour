const Place = require("../models/place.model");

module.exports.placeOwner = (req, res, next) => {
  Place.findById(req.params.id)
    .then((place) => {
      if (place.author.toString() === req.currentUser.id.toString()) {
        req.place = place;
        next();
      } else {
        res.redirect(`/places/${req.params.id}`);
      }
    })
    .catch(next);
};
