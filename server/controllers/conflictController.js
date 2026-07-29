const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reportRepo = require('../repositories/reportRepo');
const alertRepo = require('../repositories/alertRepo');
const notificationRepo = require('../repositories/notificationRepo');
const activityRepo = require('../repositories/activityRepo');
const { calculateRisk } = require('../services/riskEngine');

const getReports = asyncHandler(async (req, res) => {
  const { page, limit, search, country, riskLevel, status } = req.query;

  let filterFn = null;
  if (country || riskLevel || status) {
    filterFn = (item) => {
      let matches = true;
      if (country && item.country?.toLowerCase() !== country.toLowerCase()) matches = false;
      if (riskLevel && item.riskLevel !== riskLevel) matches = false;
      if (status && item.status !== status) matches = false;
      return matches;
    };
  }

  const result = await reportRepo.paginate({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search: search || '',
    filterFn,
    sortField: 'createdAt',
    sortOrder: 'desc'
  });

  return ApiResponse.success(res, 'Reports list retrieved', result);
});

const getReportById = asyncHandler(async (req, res) => {
  const report = await reportRepo.findById(req.params.id);
  if (!report) {
    return ApiResponse.error(res, 'Report not found', 404);
  }
  return ApiResponse.success(res, 'Report details', { report });
});

const createReport = asyncHandler(async (req, res) => {
  const { country, state, district, lat, lng, conflictType, description, status } = req.body;

  if (!country || !conflictType || !description) {
    return ApiResponse.error(res, 'Please provide country, conflictType, and description', 400);
  }

  // Pre-calculate risk score
  const riskEval = await calculateRisk(country);

  const newReport = await reportRepo.create({
    reportedBy: req.user.id,
    country,
    state: state || '',
    district: district || '',
    lat: parseFloat(lat) || 0.0,
    lng: parseFloat(lng) || 0.0,
    conflictType,
    description,
    evidenceImages: req.files && req.files.evidenceImages ? req.files.evidenceImages.map(f => `/uploads/evidence/${f.filename}`).join(',') : '',
    videos: '',
    documents: '',
    status: status || 'Pending Verification',
    riskLevel: riskEval.riskLevel,
    riskPercentage: riskEval.riskPercentage
  });

  await activityRepo.logActivity(req.user.id, 'CREATE_REPORT', 'REPORT', newReport.id, `Created conflict report in ${country}`);

  // Create alert if high risk
  if (riskEval.riskPercentage >= 75) {
    const alert = await alertRepo.create({
      level: 'Critical',
      title: `Critical Threat Alert: ${country}`,
      message: `High risk conflict incident (${riskEval.riskPercentage}%) logged in ${country}: ${conflictType}`,
      relatedReport: newReport.id,
      region: `${country}, ${state || ''}`,
      emailSent: true,
      acknowledged: false
    });

    await notificationRepo.create({
      userId: 'usr_admin01',
      type: 'CRITICAL_ALERT',
      message: `CRITICAL RISK (${riskEval.riskPercentage}%): New report in ${country}`,
      read: false,
      link: `/conflicts.html?id=${newReport.id}`
    });
  }

  return ApiResponse.success(res, 'Report created successfully', { report: newReport }, 201);
});

const updateReport = asyncHandler(async (req, res) => {
  const report = await reportRepo.findById(req.params.id);
  if (!report) {
    return ApiResponse.error(res, 'Report not found', 404);
  }

  const updated = await reportRepo.updateById(req.params.id, req.body);
  await activityRepo.logActivity(req.user.id, 'UPDATE_REPORT', 'REPORT', updated.id, `Updated report ${updated.id}`);

  return ApiResponse.success(res, 'Report updated', { report: updated });
});

const deleteReport = asyncHandler(async (req, res) => {
  const deleted = await reportRepo.deleteById(req.params.id);
  if (!deleted) {
    return ApiResponse.error(res, 'Report not found', 404);
  }

  await activityRepo.logActivity(req.user.id, 'DELETE_REPORT', 'REPORT', req.params.id, `Deleted report ${req.params.id}`);

  return ApiResponse.success(res, 'Report deleted');
});

const uploadEvidence = asyncHandler(async (req, res) => {
  const report = await reportRepo.findById(req.params.id);
  if (!report) {
    return ApiResponse.error(res, 'Report not found', 404);
  }

  let imageUrls = report.evidenceImages ? report.evidenceImages.split(',') : [];
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach(f => imageUrls.push(`/uploads/evidence/${f.filename}`));
    } else if (req.files.evidence) {
      req.files.evidence.forEach(f => imageUrls.push(`/uploads/evidence/${f.filename}`));
    }
  }

  const updated = await reportRepo.updateById(req.params.id, {
    evidenceImages: imageUrls.filter(Boolean).join(',')
  });

  return ApiResponse.success(res, 'Evidence uploaded successfully', { report: updated });
});

module.exports = {
  getReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport,
  uploadEvidence
};
