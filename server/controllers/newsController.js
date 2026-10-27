const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const newsRepo = require('../repositories/newsRepo');
const activityRepo = require('../repositories/activityRepo');
const { scoreFakeNews } = require('../services/fakeNewsScorer');
const { scoreSentiment } = require('../services/sentimentScorer');

const getNews = asyncHandler(async (req, res) => {
  const { page, limit, search, region } = req.query;

  let filterFn = null;
  if (region) {
    filterFn = (item) => item.relatedRegion && item.relatedRegion.toLowerCase().includes(region.toLowerCase());
  }

  const result = await newsRepo.paginate({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search: search || '',
    filterFn,
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  return ApiResponse.success(res, 'OSINT News feed retrieved', result);
});

const createNews = asyncHandler(async (req, res) => {
  const { title, sourceUrl, content, relatedRegion } = req.body;

  if (!title || !content) {
    return ApiResponse.error(res, 'Title and content are required', 400);
  }

  const fakeNewsScore = await scoreFakeNews(title + ' ' + content, sourceUrl || '');
  const sentimentScore = await scoreSentiment(title + ' ' + content);

  const newNews = await newsRepo.create({
    title,
    sourceUrl: sourceUrl || '',
    content,
    submittedBy: req.user.id,
    verified: fakeNewsScore < 30,
    fakeNewsScore,
    sentimentScore,
    relatedRegion: relatedRegion || 'Global'
  });

  await activityRepo.logActivity(req.user.id, 'INGEST_NEWS', 'NEWS', newNews.id, `Ingested news feed: ${title}`);

  return ApiResponse.success(res, 'News story ingested', { news: newNews }, 201);
});

const verifyNews = asyncHandler(async (req, res) => {
  const newsItem = await newsRepo.findById(req.params.id);
  if (!newsItem) {
    return ApiResponse.error(res, 'News item not found', 404);
  }

  const updated = await newsRepo.updateById(req.params.id, {
    verified: req.body.verified !== undefined ? req.body.verified : true,
    fakeNewsScore: req.body.fakeNewsScore !== undefined ? req.body.fakeNewsScore : 10
  });

  await activityRepo.logActivity(req.user.id, 'VERIFY_NEWS', 'NEWS', updated.id, `Verified OSINT news item`);

  return ApiResponse.success(res, 'News verification updated', { news: updated });
});

const getFakeScore = asyncHandler(async (req, res) => {
  const newsItem = await newsRepo.findById(req.params.id);
  if (!newsItem) {
    return ApiResponse.error(res, 'News item not found', 404);
  }

  return ApiResponse.success(res, 'Fake news score details', {
    id: newsItem.id,
    title: newsItem.title,
    fakeNewsScore: newsItem.fakeNewsScore,
    sentimentScore: newsItem.sentimentScore,
    verified: newsItem.verified
  });
});

module.exports = { getNews, createNews, verifyNews, getFakeScore };
