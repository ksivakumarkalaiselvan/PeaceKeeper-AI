const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reportRepo = require('../repositories/reportRepo');
const { calculateRisk } = require('../services/riskEngine');
const { generatePdfReport } = require('../services/pdfGenerator');

const exportPdf = asyncHandler(async (req, res) => {
  const reportId = req.params.id;
  const report = await reportRepo.findById(reportId);

  if (!report) {
    return ApiResponse.error(res, 'Report not found', 404);
  }

  const riskEval = await calculateRisk(report.country || report.id);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=peacekeeper-intelligence-report-${report.id}.pdf`);

  generatePdfReport(report, riskEval, res);
});

const downloadPdf = asyncHandler(async (req, res) => {
  return exportPdf(req, res);
});

module.exports = { exportPdf, downloadPdf };
