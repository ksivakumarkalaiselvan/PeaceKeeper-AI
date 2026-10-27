const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const groqService = require('../services/groqService');
const { scoreFakeNews } = require('../services/fakeNewsScorer');
const { scoreSentiment } = require('../services/sentimentScorer');

const getAiStatus = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'AI Engine Status', {
    configured: groqService.isConfigured(),
    provider: 'Groq Cloud LPU Inference Engine',
    model: groqService.primaryModel,
    fallbackModel: groqService.fallbackModel,
    status: groqService.isConfigured() ? 'Active & Operational' : 'Offline / Missing Key'
  });
});

const analyzeIntel = asyncHandler(async (req, res) => {
  const { text, sourceUrl, mode } = req.body;

  if (!text) {
    return ApiResponse.error(res, 'Field "text" is required for intelligence analysis', 400);
  }

  if (mode === 'sentiment') {
    const sentiment = await scoreSentiment(text);
    return ApiResponse.success(res, 'Geopolitical sentiment analyzed', { sentimentScore: sentiment });
  }

  // Default: Disinformation analysis
  const fakeNewsScore = await scoreFakeNews(text, sourceUrl || '');
  const disinfoResult = await groqService.analyzeDisinformation(text, sourceUrl || '');

  return ApiResponse.success(res, 'Disinformation intelligence analyzed', {
    fakeNewsScore,
    aiAnalysis: disinfoResult
  });
});

const executePrompt = asyncHandler(async (req, res) => {
  const { prompt, context } = req.body;

  if (!prompt) {
    return ApiResponse.error(res, 'Field "prompt" is required', 400);
  }

  if (!groqService.isConfigured()) {
    return ApiResponse.error(res, 'Groq AI Engine is not configured', 503);
  }

  try {
    const reply = await groqService.runIntelligencePrompt(prompt, context || '');
    return ApiResponse.success(res, 'AI Strategic Intelligence Generated', { response: reply });
  } catch (err) {
    return ApiResponse.error(res, `Groq Inference Error: ${err.message}`, 500);
  }
});

module.exports = {
  getAiStatus,
  analyzeIntel,
  executePrompt
};
