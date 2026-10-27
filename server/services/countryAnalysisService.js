const reportRepo = require('../repositories/reportRepo');
const satelliteRepo = require('../repositories/satelliteRepo');
const newsRepo = require('../repositories/newsRepo');
const treatyRepo = require('../repositories/treatyRepo');
const alertRepo = require('../repositories/alertRepo');
const groqService = require('./groqService');
const { calculateRisk } = require('./riskEngine');

/**
 * Analyzes a specific country using database records augmented by Groq AI synthesis.
 */
const analyzeCountryData = async (countryName) => {
  if (!countryName) countryName = 'Global';

  // Normalize search name
  const nameLower = countryName.toLowerCase();

  // 1. Fetch AI Risk Evaluation
  const riskEval = await calculateRisk(countryName);
  const riskPercentage = riskEval.riskPercentage;
  const riskLevel = riskEval.riskLevel;
  const safePercentage = Math.max(0, 100 - riskPercentage);

  // 2. Fetch ground reports
  const allReports = await reportRepo.find();
  const reports = allReports.filter(r => 
    (r.country && r.country.toLowerCase().includes(nameLower)) ||
    (r.state && r.state.toLowerCase().includes(nameLower)) ||
    (r.district && r.district.toLowerCase().includes(nameLower))
  );

  // 3. Fetch satellite imagery scans
  const allSats = await satelliteRepo.find();
  const satellites = allSats.filter(s => 
    s.region && s.region.toLowerCase().includes(nameLower)
  );

  // 4. Fetch OSINT news feeds
  const allNews = await newsRepo.find();
  const newsFeeds = allNews.filter(n => 
    n.relatedRegion && n.relatedRegion.toLowerCase().includes(nameLower)
  );

  // 5. Fetch treaties
  const allTreaties = await treatyRepo.find();
  const treaties = allTreaties.filter(t => 
    t.countries && (t.countries.toLowerCase().includes(nameLower) || t.countries.toLowerCase().includes('global'))
  );

  // 6. Fetch alerts
  const allAlerts = await alertRepo.find();
  const alerts = allAlerts.filter(a => 
    a.region && a.region.toLowerCase().includes(nameLower)
  );

  // Determine active conflict status
  const hasActiveConflict = riskPercentage >= 40 || reports.length > 0 || alerts.length > 0;
  const activeConflictStatus = hasActiveConflict 
    ? 'ACTIVE WAR / HIGH CONFLICT ZONE' 
    : 'STABLE / LOW CONFLICT RISK';

  // 7. Request Groq AI Strategic Synthesis if available
  let aiBrief = null;
  if (groqService.isConfigured()) {
    try {
      aiBrief = await groqService.synthesizeCountryIntelligenceBrief(countryName, {
        activeConflictStatus,
        riskPercentage,
        riskLevel,
        reportsCount: reports.length,
        satellitesCount: satellites.length,
        newsCount: newsFeeds.length,
        treaties,
        reports
      });
    } catch (e) {
      // Groq brief failure is non-fatal; fallback to heuristic logic below
    }
  }

  // Formulate concise short description
  let shortDescription = '';
  if (aiBrief && aiBrief.strategicAssessment) {
    shortDescription = aiBrief.strategicAssessment;
  } else if (reports.length > 0) {
    shortDescription = `${reports.length} ground incident report(s) logged. Primary threat: ${reports[0].conflictType}.`;
  } else if (satellites.length > 0) {
    shortDescription = `Satellite radar scans logged active military asset detection in ${countryName}.`;
  } else if (newsFeeds.length > 0) {
    shortDescription = `OSINT media feed tracking active regional tension with ${newsFeeds[0].fakeNewsScore}% disinfo index.`;
  } else if (hasActiveConflict) {
    shortDescription = `Elevated regional risk index (${riskPercentage}%) detected by autonomous surveillance swarm.`;
  } else {
    shortDescription = `Region monitored as stable with low active conflict indicators.`;
  }

  // Synthesize complete detailed analysis paragraph using real data
  const reportDetails = reports.length > 0
    ? reports.map(r => `• [${r.status}] ${r.conflictType} at (${r.lat}, ${r.lng}): ${r.description}`).join('\n')
    : '• No direct ground conflict incident reports recorded in primary database.';

  const satelliteDetails = satellites.length > 0
    ? satellites.map(s => `• Scan Region: ${s.region} | Buffer Zone Breach: ${s.bufferZoneFlag ? 'YES (Flagged)' : 'NO'}`).join('\n')
    : '• No satellite synthetic aperture radar anomalies logged for this sector.';

  const osintDetails = newsFeeds.length > 0
    ? newsFeeds.map(n => `• "${n.title}" — Disinformation Risk: ${n.fakeNewsScore}%, Sentiment Index: ${n.sentimentScore}`).join('\n')
    : '• No OSINT media disinformation feeds matched to this territory.';

  const treatyDetails = treaties.length > 0
    ? treaties.map(t => `• ${t.name} (${t.status}): ${t.violationCount} total violations logged.`).join('\n')
    : '• Governed under standard international demilitarization accords.';

  const tacticalDirective = (aiBrief && aiBrief.peacekeeperDirective)
    ? aiBrief.peacekeeperDirective
    : riskEval.recommendation;

  const trajectory = (aiBrief && aiBrief.threatTrajectory)
    ? `\nThreat Trajectory: ${aiBrief.threatTrajectory}`
    : '';

  const fullAnalysisText = `
COUNTRY INTELLIGENCE SUMMARY: ${countryName.toUpperCase()}
Operational Status: ${activeConflictStatus}${trajectory}
AI Risk Index: ${riskPercentage}% (${riskLevel}) | Safety Rating: ${safePercentage}%

1. GROUND INCIDENT REPORTS LOGGED (${reports.length}):
${reportDetails}

2. SATELLITE RADAR ASSET DETECTED (${satellites.length}):
${satelliteDetails}

3. OSINT DISINFORMATION & SENTIMENT (${newsFeeds.length}):
${osintDetails}

4. APPLICABLE INTERNATIONAL TREATIES & VIOLATIONS (${treaties.length}):
${treatyDetails}

5. TACTICAL AI DIRECTIVE & DIRECTIVES:
${tacticalDirective}
  `.trim();

  return {
    countryName,
    riskPercentage,
    riskLevel,
    safePercentage,
    hasActiveConflict,
    activeConflictStatus,
    threatTrajectory: aiBrief?.threatTrajectory || 'Monitored',
    strategicAssessment: aiBrief?.strategicAssessment || shortDescription,
    peacekeeperDirective: tacticalDirective,
    keyVulnerabilities: aiBrief?.keyVulnerabilities || [],
    shortDescription,
    reportsCount: reports.length,
    satellitesCount: satellites.length,
    newsCount: newsFeeds.length,
    alertsCount: alerts.length,
    reports,
    satellites,
    newsFeeds,
    treaties,
    alerts,
    recommendation: tacticalDirective,
    breakdown: riskEval.breakdown,
    fullAnalysisText,
    evaluatedAt: new Date().toISOString()
  };
};

module.exports = { analyzeCountryData };
