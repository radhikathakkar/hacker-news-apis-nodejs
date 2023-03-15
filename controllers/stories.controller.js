const responseHelper = require("../helper/response");
const moment = require("moment");

const { getHandler } = require("../helper/axios");
const { errorMessages, DATA } = require("../helper/responseMessage");
const cacheHelper = require("../helper/cache");
const { createStories, getStories } = require("../services/stories.service");

const getTopStories = async (req, res) => {
  // get top stories from cache
  const cachedStories = cacheHelper.get("top-stories");

  if (cachedStories) {
    return responseHelper.success(res, DATA.FETCH_SUCCESS, cachedStories);
  }
  try {
    // Fetch stories from the Hacker News API
    const storyIds = await getHandler("/topstories.json");
    if (!storyIds) {
      return responseHelper.badRequestError(res, errorMessages.BAD_REQUEST);
    }

    // Fetch details of story from the Hacker News API
    const storyRequests = storyIds.map((id) => getHandler(`/item/${id}.json`));
    const stories = await Promise.all(storyRequests);

    // Filter stories by the last 15 minutes
    const fifteenMinutesAgo = getFifteenMinutes();
    let filteredStories = stories.filter(
      (story) => story.time > fifteenMinutesAgo
    );

    // generate data which needs to insert into db
    let dataToInsert = [];
    for (let index = 0; index < filteredStories.length; index++) {
      const el = filteredStories[index];
      dataToInsert.push({
        id: el.id,
        title: el.title,
        url: el.url,
        score: el.score,
        time: el.time,
        user: el.by,
      });
    }

    // Save the stories to the database
    await createStories(dataToInsert);

    // Return the top 10 stories by score
    const params = { time: { $gt: fifteenMinutesAgo } };
    const sortQuery = { score: -1 };
    const limit = 10;
    const topStories = await getStories(params, sortQuery, limit);

    const response = {
      count: topStories.length,
      rows: topStories,
    };

    // set top stories in cache
    cacheHelper.set("top-stories", response);

    return responseHelper.success(res, DATA.FETCH_SUCCESS, response);
  } catch (error) {
    return responseHelper.badRequestError(res, errorMessages.SERVER_ERROR);
  }
};

const getPastStories = async (req, res) => {
  // get top stories from cache
  const topCachedStories = cacheHelper.get("top-stories");

  if (topCachedStories) {
    return responseHelper.success(res, DATA.FETCH_SUCCESS, topCachedStories);
  }

  // get past stories from cache
  const pastCachedStories = cacheHelper.get("past-stories");

  if (pastCachedStories) {
    return responseHelper.success(res, DATA.FETCH_SUCCESS, pastCachedStories);
  }

  try {
    // Fetch stories from the database by last created time
    const sortQuery = { time: "desc" };
    const stories = await getStories({}, sortQuery);
    if (!stories.length) {
      return responseHelper.badRequestError(res, DATA.NOT_FOUND);
    }

    const response = {
      count: stories.length,
      rows: stories,
    };

    // set past stories to cache
    cacheHelper.set("past-stories", response);
    return responseHelper.success(res, DATA.FETCH_SUCCESS, response);
  } catch (err) {
    return responseHelper.badRequestError(res, errorMessages.SERVER_ERROR);
  }
};

const getComments = async (req, res) => {
  const { storyId } = req.query;

  // get comments from cache
  const cachedComments = cacheHelper.get(`comments-${storyId}`);

  if (cachedComments) {
    return responseHelper.success(res, DATA.FETCH_SUCCESS, cachedComments);
  }

  try {
    // get story detail from the hacker news api
    const data = await getHandler(`/item/${storyId}.json`);

    if (data.type !== "story") {
      return responseHelper.badRequestError(res, "Invalid story ID");
    }

    // get comment details by story id from the hacker news api
    const commentsId = data.kids;
    const commentsData = commentsId.map((id) => getHandler(`/item/${id}.json`));
    const comments = await Promise.all(
      commentsData.map(async (el) => {
        const data = await el;
        const { text, by, kids } = data;
        const totalChildren = kids ? kids.length : 0;
        return { text, by, totalChildren };
      })
    );

    // sort comments a total number of child comments
    const sortedComments = comments
      .sort((a, b) => b.totalChildren - a.totalChildren)
      .slice(0, 10);

    // set sorted comments to cache
    cacheHelper.set(`comments-${storyId}`, sortedComments);
    return responseHelper.success(res, DATA.FETCH_SUCCESS, sortedComments);
  } catch (error) {
    return responseHelper.badRequestError(res, errorMessages.SERVER_ERROR);
  }
};

// get fifteen minutes 
function getFifteenMinutes() {
  return moment().subtract(15, "minutes").unix();
}

module.exports = {
  getTopStories,
  getPastStories,
  getComments,
};
