const passport = require("passport");
const User = require("../models/user.model");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const randomPassword = () => Math.random().toString(36).substring(7);

const google = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.googleID": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: profile.user.email,
            avatar: profile.user.image_1024,
            password: profile.provider + randomPassword(),
            social: {
              slack: profile.id,
            },
            activation: {
              active: true,
            },
          });

          newUser
            .save()
            .then((user) => {
              next(null, user);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
);

const slack = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackUrl: "/auth/slack",
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.slack": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: profile.user.email,
            avatar: profile.user.image_1024,
            password: profile.provider + randomPassword(),
            social: {
              slack: profile.id,
            },
            activation: {
              active: true,
            },
          });

          newUser
            .save()
            .then((user) => {
              next(null, user);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
);

passport.use(slack);
passport.use(google);

module.exports = passport.initialize();
