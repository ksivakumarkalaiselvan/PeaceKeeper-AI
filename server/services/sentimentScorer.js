const groqService = require('./groqService');
const logger = require('../utils/logger');

/**
 * AI & Heuristic Sentiment Analyzer (-1.0 to +1.0)
 */
const scoreSentiment = async (text = '') => {
  // 1. Try Groq AI Geopolitical Sentiment Engine first
  try {
    if (groqService.isConfigured()) {
      const groqResult = await groqService.analyzeGeopoliticalSentiment(text);
      if (groqResult && typeof groqResult.sentimentScore === 'number') {
        logger.info(`[Groq AI Sentiment Scored]: ${groqResult.sentimentScore} (${groqResult.escalationCategory})`);
        return groqResult.sentimentScore;
      }
    }
  } catch (err) {
    logger.warn(`[Groq Sentiment Scorer Notice]: Falling back to local heuristic - ${err.message}`);
  }

  // 2. Resilient Heuristic Fallback
  const negativeWords = ['shelling', 'war', 'attack', 'breach', 'violation', 'killed', 'clash', 'artillery', 'casualty', 'missile', 'threat'];
  const positiveWords = ['peace', 'accord', 'truce', 'humanitarian', 'aid', 'dialogue', 'agreement', 'compliance', 'ceasefire', 'relief'];

  const words = text.toLowerCase().split(/\W+/);
  let negCount = 0;
  let posCount = 0;

  words.forEach(w => {
    if (negativeWords.includes(w)) negCount++;
    if (positiveWords.includes(w)) posCount++;
  });

  const total = negCount + posCount;
  if (total === 0) return -0.15; // neutral-slightly tense baseline

  const rawScore = (posCount - negCount) / total;
  return Math.max(-1.0, Math.min(1.0, parseFloat(rawScore.toFixed(2))));
};

module.exports = { scoreSentiment };
