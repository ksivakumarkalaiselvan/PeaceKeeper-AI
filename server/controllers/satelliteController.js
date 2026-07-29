const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const satelliteRepo = require('../repositories/satelliteRepo');
const activityRepo = require('../repositories/activityRepo');

const getSatelliteImages = asyncHandler(async (req, res) => {
  const images = await satelliteRepo.find();
  return ApiResponse.success(res, 'Satellite imagery list', { images });
});

const getSatelliteById = asyncHandler(async (req, res) => {
  const image = await satelliteRepo.findById(req.params.id);
  if (!image) {
    return ApiResponse.error(res, 'Satellite record not found', 404);
  }
  return ApiResponse.success(res, 'Satellite record details', { image });
});

const uploadSatelliteImage = asyncHandler(async (req, res) => {
  const { region, lat, lng, bufferZoneFlag } = req.body;
  let imageUrl = req.file ? `/uploads/satellite/${req.file.filename}` : req.body.imageUrl;

  if (!imageUrl || !region) {
    return ApiResponse.error(res, 'Image and region region name are required', 400);
  }

  // Run mock object detection
  const mockDetection = {
    tanks: Math.floor(Math.random() * 8),
    artilleryUnits: Math.floor(Math.random() * 5),
    armoredVehicles: Math.floor(Math.random() * 10),
    confidenceScore: 0.91
  };

  const newSat = await satelliteRepo.create({
    imageUrl,
    region,
    lat: parseFloat(lat) || 0.0,
    lng: parseFloat(lng) || 0.0,
    uploadedBy: req.user.id,
    detectionStatus: 'Analyzed',
    objectDetectionResult: JSON.stringify(mockDetection),
    bufferZoneFlag: bufferZoneFlag === 'true' || bufferZoneFlag === true,
    capturedAt: new Date().toISOString()
  });

  await activityRepo.logActivity(req.user.id, 'UPLOAD_SATELLITE', 'SATELLITE', newSat.id, `Uploaded satellite image for ${region}`);

  return ApiResponse.success(res, 'Satellite imagery uploaded and analyzed', { satellite: newSat }, 201);
});

const updateDetection = asyncHandler(async (req, res) => {
  const { detectionStatus, objectDetectionResult, bufferZoneFlag } = req.body;
  const image = await satelliteRepo.findById(req.params.id);

  if (!image) {
    return ApiResponse.error(res, 'Satellite record not found', 404);
  }

  const updated = await satelliteRepo.updateById(req.params.id, {
    detectionStatus: detectionStatus || image.detectionStatus,
    objectDetectionResult: typeof objectDetectionResult === 'object' ? JSON.stringify(objectDetectionResult) : objectDetectionResult || image.objectDetectionResult,
    bufferZoneFlag: bufferZoneFlag !== undefined ? bufferZoneFlag : image.bufferZoneFlag
  });

  await activityRepo.logActivity(req.user.id, 'UPDATE_DETECTION', 'SATELLITE', updated.id, `Updated satellite object detection results`);

  return ApiResponse.success(res, 'Satellite detection updated', { satellite: updated });
});

module.exports = {
  getSatelliteImages,
  getSatelliteById,
  uploadSatelliteImage,
  updateDetection
};
