const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
  },
  user: {
    type: String,
  },
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
