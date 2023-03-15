const Story = require("../models/stories.model");

const createStories = async (params) => {
  const data = await Story.insertMany(params);
  return data;
};

const getStories = async (params, sortQuery, limit = 10) => {
  const data = await Story.find(params).sort(sortQuery).limit(limit).exec();
  return data;
};

module.exports = {
  createStories,
  getStories,
};
