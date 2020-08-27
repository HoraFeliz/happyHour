const express = require("express");
const router = express.Router();
const session = require("../middlewares/session.middleware");
const placesMiddleware = require("../middlewares/place.middleware");
const placesController = require("../controllers/places.controller");
const usersController = require("../controllers/users.controller");
const commentsController = require("../controllers/comments.controller");
const upload = require("../config/multer.config");

router.get("/search", (req, res, next) => {
  res.render("places/search");
});

router.post("/search-place", placesController.getPlaceByName);

router.get(
  "/auth/slack",
  session.isNotAuthenticated,
  usersController.doSlackLogin
);
router.get(
  "/auth/google",
  session.isNotAuthenticated,
  usersController.doGoogleLogin
);
router.get(
  "/auth/google/callback",
  session.isNotAuthenticated,
  usersController.googleCallback
);

router.get("/login", session.isNotAuthenticated, usersController.login);
router.post("/login", session.isNotAuthenticated, usersController.doLogin);
router.post("/logout", session.isAuthenticated, usersController.logout);
router.get("/users/new", session.isNotAuthenticated, usersController.new);
router.post(
  "/users",
  session.isNotAuthenticated,
  upload.single("avatar"),
  usersController.create
);
router.get("/users/:id", session.isAuthenticated, usersController.show);
router.get("/users/:id/edit", session.isAuthenticated, usersController.edit);
router.post(
  "/users/:id/edit",
  session.isAuthenticated,
  upload.single("avatar"),
  usersController.update
);
router.post(
  "/users/:id/delete",
  session.isAuthenticated,
  usersController.delete
);
router.get(
  "/users/:id/activate/:token",
  session.isNotAuthenticated,
  usersController.activateUser
);

router.post("/search", (req, res, next) => {
  //res.render("places/search");
});

router.get("/places", session.isAuthenticated, placesController.list);

//TODO: Add session.isAuthenticated middlewarex
router.get("/tags", placesController.getPlaceByTag);
router.get("/tags/:tag", placesController.getPlaceByTag);

router.post(
  "/places",
  session.isAuthenticated,
  upload.single("image"),
  placesController.create
);
router.get("/places/new", session.isAuthenticated, placesController.new);
router.get("/places/:id", session.isAuthenticated, placesController.show);
router.get(
  "/places/:id/edit",
  session.isAuthenticated,
  placesMiddleware.placeOwner,
  placesController.edit
);
router.post(
  "/places/:id/delete",
  session.isAuthenticated,
  placesMiddleware.placeOwner,
  placesController.delete
);
router.post(
  "/places/:id/edit",
  session.isAuthenticated,
  placesMiddleware.placeOwner,
  upload.single("image"),
  placesController.update
);
router.post("/places/:id/like", session.isAuthenticated, placesController.like);

router.post("/comments", session.isAuthenticated, commentsController.create);
router.post(
  "/comments/:id/delete",
  session.isAuthenticated,
  commentsController.delete
);

router.get("/", (req, res) => res.redirect("/places"));

module.exports = router;
