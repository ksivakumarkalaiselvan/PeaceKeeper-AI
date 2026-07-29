/**
 * Heuristic Fake News Disinformation Detector
 */
const scoreFakeNews = (text = '', sourceUrl = '') => {
  const suspiciousKeywords = ['unconfirmed', 'secret plot', 'shocking', 'leak', 'traitor', 'hidden truth', 'viral'];
  const reputableDomains = ['un.org', 'reuters.com', 'apnews.com', 'bbc.com', 'icrc.org', 'ctbto.org'];
  
  let score = 20; // default low suspicion
  const lowerText = text.toLowerCase();
  const lowerUrl = sourceUrl.toLowerCase();

  // Check suspicious words
  suspiciousKeywords.forEach(kw => {
    if (lowerText.includes(kw)) score += 15;
  });

  // Check domain credibility
  const isReputable = reputableDomains.some(domain => lowerUrl.includes(domain));
  if (isReputable) {
    score -= 30;
  } else if (lowerUrl.includes('.net') || lowerUrl.includes('social-wire')) {
    score += 25;
  }

  // Bound score 0-100
  return Math.min(100, Math.max(5, Math.round(score)));
};

module.exports = { scoreFakeNews };
