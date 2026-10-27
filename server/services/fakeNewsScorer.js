const groqService = require('./groqService');
const logger = require('../utils/logger');

/**
 * AI & Heuristic Disinformation Detector
 */
const scoreFakeNews = async (text = '', sourceUrl = '') => {
  // 1. Try Groq AI Intelligence Engine first
  try {
    if (groqService.isConfigured()) {
      const groqResult = await groqService.analyzeDisinformation(text, sourceUrl);
      if (groqResult && typeof groqResult.fakeNewsScore === 'number') {
        logger.info(`[Groq AI Disinfo Scored]: ${groqResult.fakeNewsScore}% (Rating: ${groqResult.credibilityRating})`);
        return groqResult.fakeNewsScore;
      }
    }
  } catch (err) {
    logger.warn(`[Groq Disinformation Scorer Notice]: Falling back to local heuristic - ${err.message}`);
  }

  // 2. Resilient Heuristic Fallback
  const suspiciousKeywords = ['unconfirmed', 'secret plot', 'shocking', 'leak', 'traitor', 'hidden truth', 'viral'];
  const reputableDomains = ['un.org', 'reuters.com', 'apnews.com', 'bbc.com', 'icrc.org', 'ctbto.org'];
  
  let score = 20; // default low suspicion
  const lowerText = text.toLowerCase();
  const lowerUrl = sourceUrl.toLowerCase();

  suspiciousKeywords.forEach(kw => {
    if (lowerText.includes(kw)) score += 15;
  });

  const isReputable = reputableDomains.some(domain => lowerUrl.includes(domain));
  if (isReputable) {
    score -= 30;
  } else if (lowerUrl.includes('.net') || lowerUrl.includes('social-wire')) {
    score += 25;
  }

  return Math.min(100, Math.max(5, Math.round(score)));
};

module.exports = { scoreFakeNews };
