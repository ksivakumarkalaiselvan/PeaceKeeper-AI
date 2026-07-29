/**
 * Simple Sentiment Analyzer (-1.0 to +1.0)
 */
const scoreSentiment = (text = '') => {
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
