const express = require("express");
const router = express.Router();
const session = require("../middlewares/session.middleware");
const placesMiddleware = require("../middlewares/place.middleware");
const placesController = require("../controllers/places.controller");
const tourController = require("../controllers/tour.controller");
const usersController = require("../controllers/users.controller");
const commentsController = require("../controllers/comments.controller");
const upload = require("../config/multer.config");

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

router.get(
  "/places/search",
  session.isAuthenticated,
  placesController.goToSearch
);


router.get("/places", session.isAuthenticated, placesController.list);

//TODO: Add session.isAuthenticated middlewarex
router.get("/tags", session.isAuthenticated, placesController.getPlaceByTag);
router.get(
  "/tags/:tag",
  session.isAuthenticated,
  placesController.getPlaceByTag
);

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
router.get(
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

router.get("/", (req, res) => res.redirect("tours"));

router.get("/tours/start", (req, res, next) => {
  res.render("tours/start");
});

// router.get("/tours/form", (req, res, next) => {
//   res.render("tours/form-1");
// });

router.post(
  "/tours",
  session.isAuthenticated,
  upload.single("image"),
  tourController.addTour);

router.get(
  "/tours/form",
  session.isAuthenticated,
  tourController.createTourStep
);


router.get(
  "/tours/form-2",
  session.isAuthenticated,
  tourController.createTourStep2
);

router.post(
  "/tours/form-2",
  session.isAuthenticated,
  placesController.addPlace
);

router.get(
  "/tours",
  session.isAuthenticated,
  tourController.list
);

router.get("/tours", (req, res, next) => {
  res.render("tours/list");
});

router.get("/tours/tour", (req, res, next) => {
  res.render("tours/tour", { layout: 'layout-nofooter' });
});

router.get("/tours/places", (req, res, next) => {
  res.render("tours/places");
});

module.exports = router;
