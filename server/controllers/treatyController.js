const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const treatyRepo = require('../repositories/treatyRepo');
const activityRepo = require('../repositories/activityRepo');

const getTreaties = asyncHandler(async (req, res) => {
  const treaties = await treatyRepo.find();
  return ApiResponse.success(res, 'Treaties list', { treaties });
});

const getTreatyById = asyncHandler(async (req, res) => {
  const treaty = await treatyRepo.findById(req.params.id);
  if (!treaty) {
    return ApiResponse.error(res, 'Treaty record not found', 404);
  }
  return ApiResponse.success(res, 'Treaty details', { treaty });
});

const createTreaty = asyncHandler(async (req, res) => {
  const { name, countries, startDate, expiryDate, status, violationCount, documentUrl } = req.body;

  if (!name) {
    return ApiResponse.error(res, 'Treaty name is required', 400);
  }

  const newTreaty = await treatyRepo.create({
    name,
    countries: countries || 'Global',
    startDate: startDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || 'Indefinite',
    status: status || 'Active Monitoring',
    violationCount: parseInt(violationCount) || 0,
    documentUrl: documentUrl || ''
  });

  await activityRepo.logActivity(req.user.id, 'CREATE_TREATY', 'TREATY', newTreaty.id, `Created treaty tracker: ${name}`);

  return ApiResponse.success(res, 'Treaty created', { treaty: newTreaty }, 201);
});

const updateTreaty = asyncHandler(async (req, res) => {
  const treaty = await treatyRepo.findById(req.params.id);
  if (!treaty) {
    return ApiResponse.error(res, 'Treaty record not found', 404);
  }

  const updated = await treatyRepo.updateById(req.params.id, req.body);
  await activityRepo.logActivity(req.user.id, 'UPDATE_TREATY', 'TREATY', updated.id, `Updated treaty: ${updated.name}`);

  return ApiResponse.success(res, 'Treaty updated', { treaty: updated });
});

const deleteTreaty = asyncHandler(async (req, res) => {
  const deleted = await treatyRepo.deleteById(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 'Treaty record not found', 404);
  }

  await activityRepo.logActivity(req.user.id, 'DELETE_TREATY', 'TREATY', req.params.id, `Deleted treaty record`);

  return ApiResponse.success(res, 'Treaty record deleted');
});

module.exports = {
  getTreaties,
  getTreatyById,
  createTreaty,
  updateTreaty,
  deleteTreaty
};
