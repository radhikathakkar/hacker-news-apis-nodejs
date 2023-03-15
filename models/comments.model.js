const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  commentId: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  storyId: {
    type: Number,
  }
});

const Commnet = mongoose.model("Commnet", commentSchema);

module.exports = Commnet;
