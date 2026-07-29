const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reportRepo = require('../repositories/reportRepo');
const alertRepo = require('../repositories/alertRepo');
const treatyRepo = require('../repositories/treatyRepo');
const satelliteRepo = require('../repositories/satelliteRepo');
const newsRepo = require('../repositories/newsRepo');
const activityRepo = require('../repositories/activityRepo');

const getSummary = asyncHandler(async (req, res) => {
  const reports = await reportRepo.find();
  const alerts = await alertRepo.find();
  const treaties = await treatyRepo.find();
  const satellites = await satelliteRepo.find();
  const newsItems = await newsRepo.find();
  const recentActivities = await activityRepo.paginate({ page: 1, limit: 5, sortField: 'timestamp', sortOrder: 'desc' });

  const totalReports = reports.length;
  const criticalReports = reports.filter(r => r.riskLevel === 'Critical').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const totalViolations = treaties.reduce((acc, t) => acc + (t.violationCount || 0), 0);
  const avgRiskScore = Math.round(reports.reduce((acc, r) => acc + (r.riskPercentage || 50), 0) / (totalReports || 1));

  return ApiResponse.success(res, 'Dashboard summary data', {
    metrics: {
      totalReports,
      criticalReports,
      activeAlerts,
      totalViolations,
      avgRiskScore,
      satelliteScans: satellites.length,
      newsSources: newsItems.length
    },
    topAlerts: alerts.filter(a => a.level === 'Critical' || a.level === 'High').slice(0, 4),
    recentReports: reports.slice(0, 5),
    recentActivities: recentActivities.items
  });
});

module.exports = { getSummary };
