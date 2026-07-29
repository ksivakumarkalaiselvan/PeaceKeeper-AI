const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reportRepo = require('../repositories/reportRepo');
const treatyRepo = require('../repositories/treatyRepo');

const getMonthlyTrends = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, 'Monthly conflict trends', {
    labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      { label: 'Conflict Incidents', data: [12, 19, 15, 24, 18, 29] },
      { label: 'Treaty Violations', data: [4, 7, 5, 9, 11, 14] }
    ]
  });
});

const getByCountry = asyncHandler(async (req, res) => {
  const reports = await reportRepo.find();
  const countryCounts = {};
  reports.forEach(r => {
    const c = r.country || 'Unknown';
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  return ApiResponse.success(res, 'Reports breakdown by country', {
    labels: Object.keys(countryCounts),
    data: Object.values(countryCounts)
  });
});

const getRiskDistribution = asyncHandler(async (req, res) => {
  const reports = await reportRepo.find();
  const dist = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  reports.forEach(r => {
    if (r.riskLevel && dist[r.riskLevel] !== undefined) {
      dist[r.riskLevel]++;
    } else {
      dist['Medium']++;
    }
  });

  return ApiResponse.success(res, 'Risk distribution breakdown', {
    labels: Object.keys(dist),
    data: Object.values(dist)
  });
});

const getViolations = asyncHandler(async (req, res) => {
  const treaties = await treatyRepo.find();
  return ApiResponse.success(res, 'Treaty violation metrics', {
    labels: treaties.map(t => (t.name || 'Treaty').split(' ')[0]),
    data: treaties.map(t => t.violationCount || 0)
  });
});

module.exports = {
  getMonthlyTrends,
  getByCountry,
  getRiskDistribution,
  getViolations
};
