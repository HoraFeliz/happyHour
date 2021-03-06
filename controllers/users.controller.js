const mongoose = require("mongoose");
const User = require("../models/user.model");
const mailer = require("../config/mailer.config");
const passport = require("passport");

module.exports.login = (req, res, next) => {
  res.render("users/login-purple", { layout: "layout-purple" });
};

module.exports.doGoogleLogin = (req, res, next) => {
  const passportController = passport.authenticate(
    "google",
    {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    },
    (error, user) => {
      if (error) {
        next(error);
      } else {
        req.session.userId = user._id;
        res.redirect("/");
      }
    }
  );

  passportController(req, res, next);
};

module.exports.googleCallback = (req, res, next) => {
  const passportGoogleCallback = passport.authenticate(
    "google",
    {
      successRedirect: "/tours",
      failureRedirect: "/login",
    },
    (error, user) => {
      req.session.userId = user._id;
      res.redirect("/");
    }
  );
  passportGoogleCallback(req, res, next);
};

module.exports.doSlackLogin = (req, res, next) => {
  const passportController = passport.authenticate("slack", (error, user) => {
    if (error) {
      next(error);
    } else {
      req.session.userId = user._id;
      res.redirect("/");
    }
  });

  passportController(req, res, next);
};

module.exports.doLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        user.checkPassword(req.body.password).then((match) => {
          if (match) {
            if (user.activation.active) {
              req.session.userId = user._id;

              res.redirect("/tours");
            } else {
              res.render("users/login", {
                error: {
                  validation: {
                    message: "Your account is not active, check your email!",
                  },
                },
              });
            }
          } else {
            res.render("users/login", {
              error: {
                email: {
                  message: "user not found",
                },
              },
            });
          }
        });
      } else {
        res.render("users/login", {
          error: {
            email: {
              message: "user not found",
            },
          },
        });
      }
    })
    .catch(next);
};

module.exports.new = (req, res, next) => {
  res.render("users/new");
};

module.exports.edit = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      res.render("users/edit", { user });
    })
    .catch(next);
};

module.exports.update = (req, res, next) => {
  const body = req.body;

  if (req.file) {
    body.avatar = req.file.path;
  }

  User.findByIdAndUpdate(req.params.id, body, {
    runValidators: true,
    new: true,
  })
    .then((user) => {
      if (user) {
        res.redirect(`/users/${user._id}`);
      } else {
        res.redirect("/tours");
      }
    })
    .catch(next);
};

module.exports.show = (req, res, next) => {
  User.findById(req.params.id)
    .populate("tours")
    .then((user) => {
      console.log("user", user);
      res.render("users/show", { user });
    })
    .catch(next);
};

module.exports.create = (req, res, next) => {
  console.log("req user", req);
  const user = new User({
    ...req.body,
    staff: false,
    avatar: req.file ? req.file.path : undefined,
  });

  user
    .save()
    .then((user) => {
      mailer.sendValidationEmail({
        name: user.name,
        email: user.email,
        id: user._id.toString(),
        activationToken: user.activation.token,
      });

      res.render("users/login", {
        message: "Check your email for activation",
      });
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.render("users/new", { error: error.errors, user });
      } else if (error.code === 11000) {
        // error when duplicated user
        res.render("users/new", {
          user,
          error: {
            email: {
              message: "user already exists",
            },
          },
        });
      } else {
        next(error);
      }
    })
    .catch(next);
};

module.exports.activateUser = (req, res, next) => {
  User.findOne({ _id: req.params.id, "activation.token": req.params.token })
    .then((user) => {
      if (user) {
        user.activation.active = true;

        user
          .save()
          .then((user) => {
            res.render("users/login", {
              message: "Your account has been activated, log in below!",
            });
          })
          .catch((e) => next);
      } else {
        res.render("users/login", {
          error: {
            validation: {
              message: "Invalid link",
            },
          },
        });
      }
    })
    .catch((e) => next);
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();

  res.redirect("/login");
};

module.exports.delete = (req, res, next) => {
  if (req.params.id.toString() === req.currentUser.id.toString()) {
    req.currentUser
      .remove()
      .then(() => {
        req.session.destroy();
        res.redirect("/login");
      })
      .catch(next);
  } else {
    res.redirect("/tours");
  }
};
