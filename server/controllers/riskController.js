const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { calculateRisk } = require('../services/riskEngine');
const activityRepo = require('../repositories/activityRepo');

const getRiskByRegionOrId = asyncHandler(async (req, res) => {
  const targetParam = req.params.regionOrReportId;
  const evaluation = await calculateRisk(targetParam);
  return ApiResponse.success(res, 'AI Risk evaluation completed', { evaluation });
});

const recalculateRisk = asyncHandler(async (req, res) => {
  const { region } = req.body;
  const evaluation = await calculateRisk(region || '');

  await activityRepo.logActivity(req.user.id, 'RECALCULATE_RISK', 'RISK', region || 'GLOBAL', `Triggered AI risk recalculation for ${region || 'Global'}`);

  return ApiResponse.success(res, 'Risk index updated', { evaluation });
});

module.exports = { getRiskByRegionOrId, recalculateRisk };
