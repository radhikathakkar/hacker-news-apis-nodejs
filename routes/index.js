const express = require("express");
const {
  getTopStories,
  getPastStories,
  getComments,
} = require("../controllers/stories.controller");
const router = express.Router();

// router to fetch top 10 stories 
router.get("/top-stories", getTopStories);

// router to fetch past stories 
router.get("/past-stories", getPastStories);

// router to fetch comments by storyId
router.get("/comments", getComments);

module.exports = router;
