require("dotenv").config();
require("../config/db.config");

const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const Place = require("../models/place.model");
const Like = require("../models/like.model");
const faker = require("faker");

const users = [];

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

function createPlace(user) {
  const place = new Place({
    name: faker.company.companyName(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    github: faker.internet.url(),
    image: faker.image.image(),
    owner: user._id,
    address: faker.address.city(),
    city: faker.address.city(),
    location: {
      type: "Point",
      coordinates: [faker.address.latitude(), faker.address.longitude()],
    },
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

function restoreDatabase() {
  return Promise.all([
    User.deleteMany({}),
    Comment.deleteMany({}),
    Place.deleteMany({}),
    Like.deleteMany({}),
  ]);
}

function seeds() {
  restoreDatabase().then(() => {
    console.log("Database restored!");

    createUser(true).then(() => {
      console.log();

      for (let i = 0; i < 10; i++) {
        createUser().then((user) => {
          console.log(user.email);

          users.push(user);

          for (let j = 0; j < 3; j++) {
            createPlace(user).then((place) => {
              for (let k = 0; k < 10; k++) {
                createComment(place);
                createLike(place);
              }
            });
          }
        });
      }
    });
  });
}

seeds();
