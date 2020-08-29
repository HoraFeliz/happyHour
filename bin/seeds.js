require("dotenv").config();
require("../config/db.config");

const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Place = require("../models/place.model");
const Like = require("../models/like.model");
const Review = require("../models/review.model");
const Tour = require("../models/tour.model");
const faker = require("faker");

const users = [];
const tourNames = [
  "Ruta Malasaña",
  "Routa La Movida",
  "Ruta 80's",
  "Vinos y más",
];

function createReview(place) {
  const review = new Review({
    autorName: faker.name.findName(),
    autorUrl: faker.internet.url(),
    autorPhoto: faker.image.image(),
    rating: Math.round(Math.random() * 5 * 10) / 10,
    relativeTimeDesc: createTextDateDescription(),
    text: faker.lorem.paragraph(),
    time: faker.date.past(),
    place: place._id,
  });
  return review.save();
}
function createUser(staff = false) {
  const user = new User({
    name: faker.name.findName(),
    email: faker.internet.email(),
    avatar: faker.internet.avatar(),
    password: "123456789A",
    bio: faker.lorem.paragraph(),
    staff,
    avtivation: {
      active: true,
    },
  });

  return user.save();
}

function createTour(user) {
  const tour = new Tour({
    name: tourNames[Math.floor(Math.random() * tourNames.length)],
    description: faker.lorem.paragraph(),
    city: faker.address.city(),
    rating: Math.round(Math.random() * 5 * 10) / 10,
    owner: user._id,
  });

  return tour.save();
}
function createPlace(user, tour) {
  const place = new Place({
    name: faker.company.companyName(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    github: faker.internet.url(),
    image: faker.image.image(),
    owner: user._id,
    tour: tour._id,
    tags: createTags(),
  });

  return place.save();
}

function createComment(place) {
  const comment = new Comment({
    text: faker.lorem.paragraph(),
    user: users[Math.floor(Math.random() * users.length)]._id,
    place: place._id,
  });

  return comment.save();
}

function createLike(place) {
  const like = new Like({
    user: users[Math.floor(Math.random() * users.length)]._id,
    place: place._id,
  });

  return like.save();
}

function createTags() {
  const keywords = ["party", "bar", "coffee", "dinner", "fast food", "fancy"];
  const randomMax = Math.floor(Math.random() * keywords.length);
  const tags = [];
  for (let i = 0; i <= randomMax; i++) {
    const randomIndex = Math.floor(Math.random() * keywords.length);
    const newTag = keywords[randomIndex];
    if (tags.indexOf(newTag) === -1) {
      tags.push(newTag);
    }
  }
  return tags;
}

function createTextDateDescription() {
  const dateTextDesc = [
    "a month ago",
    "a year ago",
    "a week ago",
    "last week",
    "today",
    "more than one year ago",
  ];
  return dateTextDesc[Math.floor(Math.random() * dateTextDesc.length)];
}

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    Place.deleteMany({}),
    Like.deleteMany({}),
    Review.deleteMany({}),
  ]);
}

function seeds() {
  restoreDatabase().then(() => {
    console.log("Database restored!");
    createUser(true).then(() => {
      console.log();

      for (let i = 0; i < 3; i++) {
        createUser().then((user) => {
          console.log(user.email);
          users.push(user);
          createTour(user).then((tour) => {
            for (let j = 0; j < 3; j++) {
              createPlace(user, tour).then((place) => {
                for (let k = 0; k < 5; k++) {
                  createReview(place);
                  createComment(place);
                  createLike(place);
                }
              });
            }
          });
        });
      }
    });
  });
}

seeds();
