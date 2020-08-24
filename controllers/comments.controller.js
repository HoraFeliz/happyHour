const Comment = require("../models/comment.model");

module.exports.create = (req, res, next) => {
  const comment = new Comment({
    ...req.body,
    user: req.currentUser._id,
  });

  const redirect = () => {
    res.redirect(`/places/${comment.place}#comments`);
  };

  comment.save().then(redirect).catch(redirect);
};

module.exports.delete = (req, res, next) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      if (comment.user.toString() === req.currentUser._id.toString()) {
        Comment.findByIdAndDelete(comment._id)
          .then(() => {
            res.redirect(`/places/${comment.place}#comments`);
          })
          .catch(next);
      } else {
        res.redirect(`/places/${comment.place}#comments`);
      }
    })
    .catch(next);
};
