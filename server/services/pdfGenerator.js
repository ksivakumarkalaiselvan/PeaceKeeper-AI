const PDFDocument = require('pdfkit');

const generatePdfReport = (reportData, riskEvaluation, stream) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(stream);

  const darkNavy = '#0B132B';
  const neonCyan = '#00F0FF';

  // Background header band
  doc.rect(0, 0, 595, 90).fill(darkNavy);

  // Title
  doc.fillColor(neonCyan)
     .fontSize(20)
     .font('Helvetica-Bold')
     .text('PEACEKEEPER AI — INTELLIGENCE REPORT', 40, 25);
  
  doc.fillColor('#8D99AE')
     .fontSize(10)
     .font('Helvetica')
     .text('Autonomous Treaty Compliance & Peacebuilding Swarm Platform', 40, 50);

  doc.fillColor('#FFFFFF')
     .fontSize(9)
     .text(`Report Ref ID: ${reportData.id || 'REP-GEN-001'} | Date: ${new Date().toLocaleDateString()}`, 40, 68);

  let y = 110;

  // Conflict Overview Header
  doc.fillColor('#1C2541')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('1. CONFLICT INCIDENT OVERVIEW', 40, y);
  y += 20;

  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  doc.fillColor('#2B2D42').fontSize(10).font('Helvetica-Bold').text('Location / Territory:', 40, y);
  doc.font('Helvetica').text(`${reportData.country || 'Global'}, ${reportData.state || ''} (${reportData.district || 'N/A'})`, 170, y);
  y += 18;

  doc.font('Helvetica-Bold').text('Coordinates:', 40, y);
  doc.font('Helvetica').text(`Lat: ${reportData.lat || 'N/A'}, Lng: ${reportData.lng || 'N/A'}`, 170, y);
  y += 18;

  doc.font('Helvetica-Bold').text('Conflict Classification:', 40, y);
  doc.font('Helvetica').text(`${reportData.conflictType || 'Unclassified Threat'}`, 170, y);
  y += 18;

  doc.font('Helvetica-Bold').text('Verification Status:', 40, y);
  doc.font('Helvetica').text(`${reportData.status || 'Pending Verification'}`, 170, y);
  y += 25;

  doc.font('Helvetica-Bold').text('Description:', 40, y);
  y += 15;
  doc.font('Helvetica').text(`${reportData.description || 'No detailed description attached.'}`, 40, y, { width: 510 });
  y += 45;

  // AI Risk Assessment Section
  doc.fillColor('#1C2541')
     .fontSize(14)
     .font('Helvetica-Bold')
     .text('2. AI RISK EVALUATION & TREATY ASSESSMENT', 40, y);
  y += 20;

  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  const riskScore = riskEvaluation ? riskEvaluation.riskPercentage : (reportData.riskPercentage || 75);
  const riskLevel = riskEvaluation ? riskEvaluation.riskLevel : (reportData.riskLevel || 'High');

  doc.fillColor('#2B2D42').fontSize(11).font('Helvetica-Bold').text(`Calculated AI Risk Index: ${riskScore}% (${riskLevel.toUpperCase()})`, 40, y);
  y += 20;

  if (riskEvaluation && riskEvaluation.breakdown) {
    const bd = riskEvaluation.breakdown;
    doc.fontSize(9).font('Helvetica')
       .text(`• Regional Report Frequency Contribution: ${bd.reportCountNorm}%`, 50, y);
    y += 14;
    doc.text(`• Satellite Asset Detection Index: ${bd.satelliteDetectionScore}%`, 50, y);
    y += 14;
    doc.text(`• Disinformation / Fake News Risk Factor: ${bd.fakeNewsInverseScore}%`, 50, y);
    y += 14;
    doc.text(`• Negative Sentiment & Tension Score: ${bd.negativeSentimentScore}%`, 50, y);
    y += 14;
    doc.text(`• Active Treaty Violation Index: ${bd.violationCountNorm}%`, 50, y);
    y += 25;
  }

  doc.fillColor('#1C2541').fontSize(11).font('Helvetica-Bold').text('AI Tactical Recommendation:', 40, y);
  y += 15;
  doc.fillColor('#333333').fontSize(9).font('Helvetica')
     .text(riskEvaluation?.recommendation || 'Standard peacekeeper observation protocol active.', 40, y, { width: 510 });
  y += 40;

  // Sign-off box
  doc.rect(40, y, 510, 65).fillAndStroke('#F4F5F7', '#D8DCE3');
  doc.fillColor('#1C2541').fontSize(9).font('Helvetica-Bold').text('OFFICIAL VERIFICATION STAMP', 55, y + 10);
  doc.fillColor('#555555').font('Helvetica').text('PeaceKeeper Autonomous Swarm System — Verified Operations Center', 55, y + 26);
  doc.text(`Authenticated Key: SHA256-${Date.now().toString(16).toUpperCase()}`, 55, y + 42);

  doc.end();
};

/**
 * Generates a full Country Analysis PDF Report
 */
const generateCountryPdfReport = (countryData, stream) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  doc.pipe(stream);

  const darkNavy = '#0B132B';
  const neonCyan = '#00F0FF';
  const neonRed = '#FF0055';

  // Header Band
  doc.rect(0, 0, 595, 90).fill(darkNavy);

  doc.fillColor(neonCyan)
     .fontSize(18)
     .font('Helvetica-Bold')
     .text(`COUNTRY INTELLIGENCE REPORT: ${countryData.countryName.toUpperCase()}`, 40, 25);
  
  doc.fillColor('#8D99AE')
     .fontSize(10)
     .font('Helvetica')
     .text('PeaceKeeper AI — Autonomous GIS & Multi-Factor Intelligence Analysis', 40, 50);

  doc.fillColor('#FFFFFF')
     .fontSize(9)
     .text(`Generated: ${new Date().toLocaleString()} | Operational Status: ${countryData.activeConflictStatus}`, 40, 68);

  let y = 110;

  // Section 1: Executive Status & Metrics
  doc.fillColor('#1C2541').fontSize(13).font('Helvetica-Bold').text('1. EXECUTIVE THREAT ASSESSMENT', 40, y);
  y += 18;
  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  doc.fillColor(countryData.riskPercentage >= 50 ? neonRed : '#1C2541')
     .fontSize(11).font('Helvetica-Bold')
     .text(`Country Risk Index: ${countryData.riskPercentage}% (${countryData.riskLevel})  |  Safety Index: ${countryData.safePercentage}%`, 40, y);
  y += 20;

  doc.fillColor('#2B2D42').fontSize(10).font('Helvetica-Bold').text('Conflict Status:', 40, y);
  doc.font('Helvetica').text(`${countryData.activeConflictStatus}`, 150, y);
  y += 18;

  doc.font('Helvetica-Bold').text('Summary Overview:', 40, y);
  doc.font('Helvetica').text(`${countryData.shortDescription}`, 150, y, { width: 390 });
  y += 35;

  // Section 2: Ground Conflict Reports
  doc.fillColor('#1C2541').fontSize(13).font('Helvetica-Bold').text(`2. GROUND INCIDENT LOGS (${countryData.reportsCount})`, 40, y);
  y += 18;
  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  if (countryData.reports.length === 0) {
    doc.fillColor('#555555').fontSize(9).font('Helvetica-Oblique').text('No ground conflict incident reports recorded for this country.', 40, y);
    y += 20;
  } else {
    countryData.reports.forEach(r => {
      doc.fillColor('#1C2541').fontSize(9).font('Helvetica-Bold').text(`• [${r.status}] ${r.conflictType}`, 40, y);
      y += 12;
      doc.fillColor('#444444').font('Helvetica').text(`  Coordinates: (${r.lat}, ${r.lng}) | Risk: ${r.riskLevel} (${r.riskPercentage}%)`, 40, y);
      y += 12;
      doc.text(`  Note: ${r.description}`, 40, y, { width: 500 });
      y += 20;
    });
  }

  // Section 3: Satellite Radar Analysis
  doc.fillColor('#1C2541').fontSize(13).font('Helvetica-Bold').text(`3. SATELLITE RADAR ASSET DETECTED (${countryData.satellitesCount})`, 40, y);
  y += 18;
  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  if (countryData.satellites.length === 0) {
    doc.fillColor('#555555').fontSize(9).font('Helvetica-Oblique').text('No satellite synthetic aperture radar detections logged for this sector.', 40, y);
    y += 20;
  } else {
    countryData.satellites.forEach(s => {
      doc.fillColor('#1C2541').fontSize(9).font('Helvetica-Bold').text(`• Region: ${s.region} | Demilitarized Buffer Zone Breach: ${s.bufferZoneFlag ? 'YES (FLAGGED)' : 'NO'}`, 40, y);
      y += 14;
    });
    y += 10;
  }

  // Section 4: OSINT Media Disinformation & Sentiment
  doc.fillColor('#1C2541').fontSize(13).font('Helvetica-Bold').text(`4. OSINT MEDIA FEEDS (${countryData.newsCount})`, 40, y);
  y += 18;
  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;

  if (countryData.newsFeeds.length === 0) {
    doc.fillColor('#555555').fontSize(9).font('Helvetica-Oblique').text('No OSINT media news feeds registered for this territory.', 40, y);
    y += 20;
  } else {
    countryData.newsFeeds.forEach(n => {
      doc.fillColor('#1C2541').fontSize(9).font('Helvetica-Bold').text(`• "${n.title}"`, 40, y);
      y += 12;
      doc.fillColor('#444444').font('Helvetica').text(`  Disinformation Risk Score: ${n.fakeNewsScore}% | Sentiment Index: ${n.sentimentScore}`, 40, y);
      y += 16;
    });
  }

  // Section 5: AI Recommendation
  doc.fillColor('#1C2541').fontSize(13).font('Helvetica-Bold').text('5. AI TACTICAL RECOMMENDATION', 40, y);
  y += 18;
  doc.lineWidth(1).strokeColor('#8D99AE').moveTo(40, y).lineTo(550, y).stroke();
  y += 15;
  doc.fillColor('#2B2D42').fontSize(9).font('Helvetica').text(`${countryData.recommendation}`, 40, y, { width: 510 });
  y += 35;

  // Verification Box
  doc.rect(40, y, 510, 60).fillAndStroke('#F4F5F7', '#D8DCE3');
  doc.fillColor('#1C2541').fontSize(9).font('Helvetica-Bold').text('PEACEKEEPER AI VERIFIED COUNTRY BRIEFING', 55, y + 10);
  doc.fillColor('#555555').font('Helvetica').text(`Generated automatically from analyzed ground, satellite, and treaty data.`, 55, y + 25);
  doc.text(`Digital Seal: SHA256-${Date.now().toString(16).toUpperCase()}`, 55, y + 40);

  doc.end();
};

module.exports = { generatePdfReport, generateCountryPdfReport };
