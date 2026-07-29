const reportRepo = require('../repositories/reportRepo');
const satelliteRepo = require('../repositories/satelliteRepo');
const newsRepo = require('../repositories/newsRepo');
const treatyRepo = require('../repositories/treatyRepo');

/**
 * Calculates AI Risk Score based on multi-factor intelligence inputs
 */
const calculateRisk = async (regionOrReportId) => {
  // Try to load specific report if ID passed
  let targetReport = null;
  let regionName = regionOrReportId;

  if (regionOrReportId) {
    targetReport = await reportRepo.findById(regionOrReportId);
    if (targetReport) {
      regionName = targetReport.country || targetReport.state;
    }
  }

  // 1. Fetch reports matching region
  const allReports = await reportRepo.find();
  const regionalReports = regionName 
    ? allReports.filter(r => (r.country && r.country.toLowerCase().includes(regionName.toLowerCase())) || 
                             (r.state && r.state.toLowerCase().includes(regionName.toLowerCase())))
    : allReports;
  
  const reportCount = regionalReports.length;
  // Normalize report count (max baseline = 10 reports = 100%)
  const reportCount_norm = Math.min(100, (reportCount / 5) * 100);

  // 2. Fetch satellite detection scores in region
  const allSats = await satelliteRepo.find();
  const regionalSats = regionName
    ? allSats.filter(s => s.region && s.region.toLowerCase().includes(regionName.toLowerCase()))
    : allSats;
  
  let satelliteDetection = 30; // default baseline
  if (regionalSats.length > 0) {
    let totalScore = 0;
    regionalSats.forEach(sat => {
      let score = 50;
      try {
        const parsed = typeof sat.objectDetectionResult === 'string' 
          ? JSON.parse(sat.objectDetectionResult) 
          : sat.objectDetectionResult;
        if (parsed.tanks || parsed.artilleryUnits || parsed.armoredPersonnelCarriers) {
          score += 35;
        }
      } catch (e) {}
      if (sat.bufferZoneFlag) score += 15;
      totalScore += Math.min(100, score);
    });
    satelliteDetection = totalScore / regionalSats.length;
  }

  // 3. Fetch OSINT fake news score (inverse: higher fake news credibility risk -> higher conflict instability)
  const allNews = await newsRepo.find();
  const regionalNews = regionName
    ? allNews.filter(n => n.relatedRegion && n.relatedRegion.toLowerCase().includes(regionName.toLowerCase()))
    : allNews;

  let fakeNewsInverse = 50;
  if (regionalNews.length > 0) {
    const avgFakeScore = regionalNews.reduce((acc, n) => acc + (n.fakeNewsScore || 50), 0) / regionalNews.length;
    fakeNewsInverse = avgFakeScore; // high disinformation indicates volatile war theater
  }

  // 4. Social / News Sentiment Score (-1 to +1 -> converted to 0 to 100 negative sentiment impact)
  let negativeSentiment = 50;
  if (regionalNews.length > 0) {
    const avgSentiment = regionalNews.reduce((acc, n) => acc + (n.sentimentScore || 0), 0) / regionalNews.length;
    // Map sentiment (-1 = 100% negative, +1 = 0% negative)
    negativeSentiment = Math.min(100, Math.max(0, (( -avgSentiment + 1 ) / 2) * 100));
  }

  // 5. Treaty Violations in area
  const treaties = await treatyRepo.find();
  const totalViolations = treaties.reduce((acc, t) => acc + (t.violationCount || 0), 0);
  const violationCount_norm = Math.min(100, (totalViolations / 30) * 100);

  // Apply Formula
  const rawPercentage = (
    (reportCount_norm * 0.30) +
    (satelliteDetection * 0.25) +
    (fakeNewsInverse * 0.15) +
    (negativeSentiment * 0.15) +
    (violationCount_norm * 0.15)
  );

  const riskPercentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));

  let riskLevel = 'Low';
  let recommendation = 'Standard observation protocol active.';
  if (riskPercentage >= 76) {
    riskLevel = 'Critical';
    recommendation = 'EMERGENCY: Immediate UN Security Council dispatch and conflict de-escalation intervention required.';
  } else if (riskPercentage >= 51) {
    riskLevel = 'High';
    recommendation = 'HIGH ALERT: Deploy peacekeeper monitoring teams and activate satellite synthetic aperture radar tracking.';
  } else if (riskPercentage >= 26) {
    riskLevel = 'Medium';
    recommendation = 'ELEVATED: Increase OSINT social media sentiment tracking and issue formal treaty compliance notice.';
  }

  const breakdown = {
    reportCountNorm: Math.round(reportCount_norm),
    satelliteDetectionScore: Math.round(satelliteDetection),
    fakeNewsInverseScore: Math.round(fakeNewsInverse),
    negativeSentimentScore: Math.round(negativeSentiment),
    violationCountNorm: Math.round(violationCount_norm)
  };

  return {
    region: regionName || 'Global Defense Perimeter',
    riskPercentage,
    riskLevel,
    recommendation,
    breakdown,
    evaluatedAt: new Date().toISOString()
  };
};

module.exports = { calculateRisk };
