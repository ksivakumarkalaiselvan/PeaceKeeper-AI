const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const reportRepo = require('../repositories/reportRepo');
const satelliteRepo = require('../repositories/satelliteRepo');
const { analyzeCountryData } = require('../services/countryAnalysisService');
const { generateCountryPdfReport } = require('../services/pdfGenerator');

// GeoJSON Country Polygons Dataset (Simplified boundaries for key global countries)
const countryPolygonsData = [
  {
    name: 'Ukraine',
    coordinates: [
      [[22.1, 48.4], [31.5, 52.3], [40.2, 49.3], [37.8, 45.1], [33.5, 46.1], [29.6, 45.3], [22.1, 48.4]]
    ]
  },
  {
    name: 'Sudan',
    coordinates: [
      [[21.8, 22.0], [38.6, 18.0], [35.5, 12.0], [32.0, 9.5], [23.5, 9.5], [21.8, 22.0]]
    ]
  },
  {
    name: 'Taiwan Strait',
    coordinates: [
      [[119.0, 26.0], [122.5, 26.0], [122.5, 21.5], [119.0, 21.5], [119.0, 26.0]]
    ]
  },
  {
    name: 'Somalia',
    coordinates: [
      [[41.0, 0.0], [51.4, 11.8], [48.0, 8.0], [42.0, 4.0], [41.0, 0.0]]
    ]
  },
  {
    name: 'Syria',
    coordinates: [
      [[35.7, 32.3], [38.8, 33.3], [42.3, 37.3], [36.0, 36.8], [35.7, 32.3]]
    ]
  },
  {
    name: 'United States',
    coordinates: [
      [[-125.0, 49.0], [-67.0, 49.0], [-67.0, 25.0], [-125.0, 25.0], [-125.0, 49.0]]
    ]
  },
  {
    name: 'Russia',
    coordinates: [
      [[28.0, 70.0], [180.0, 70.0], [140.0, 42.0], [40.0, 42.0], [28.0, 70.0]]
    ]
  },
  {
    name: 'China',
    coordinates: [
      [[73.5, 53.5], [135.0, 48.0], [120.0, 22.0], [100.0, 21.0], [73.5, 30.0], [73.5, 53.5]]
    ]
  },
  {
    name: 'India',
    coordinates: [
      [[68.0, 37.0], [97.0, 28.0], [92.0, 20.0], [77.0, 8.0], [68.0, 20.0], [68.0, 37.0]]
    ]
  },
  {
    name: 'France',
    coordinates: [
      [[-4.8, 48.4], [8.2, 49.0], [7.5, 43.7], [-1.8, 43.4], [-4.8, 48.4]]
    ]
  },
  {
    name: 'Germany',
    coordinates: [
      [[5.9, 54.9], [15.0, 54.0], [13.8, 47.3], [5.9, 47.3], [5.9, 54.9]]
    ]
  },
  {
    name: 'United Kingdom',
    coordinates: [
      [[-8.1, 58.6], [1.8, 52.5], [0.3, 50.7], [-5.7, 50.0], [-8.1, 58.6]]
    ]
  },
  {
    name: 'Israel',
    coordinates: [
      [[34.2, 33.3], [35.8, 33.3], [35.5, 29.5], [34.2, 31.2], [34.2, 33.3]]
    ]
  },
  {
    name: 'Yemen',
    coordinates: [
      [[42.5, 16.5], [53.0, 16.5], [52.0, 12.5], [43.0, 12.5], [42.5, 16.5]]
    ]
  }
];

const getMapLocations = asyncHandler(async (req, res) => {
  const reports = await reportRepo.find();
  const satellites = await satelliteRepo.find();

  const reportPins = reports.map(r => ({
    id: r.id,
    type: 'REPORT',
    title: r.conflictType,
    country: r.country,
    lat: r.lat,
    lng: r.lng,
    riskLevel: r.riskLevel,
    riskPercentage: r.riskPercentage,
    description: r.description
  }));

  const satellitePins = satellites.map(s => ({
    id: s.id,
    type: 'SATELLITE',
    title: `Satellite Scan: ${s.region}`,
    region: s.region,
    lat: s.lat,
    lng: s.lng,
    bufferZoneFlag: s.bufferZoneFlag,
    imageUrl: s.imageUrl
  }));

  return ApiResponse.success(res, 'GIS map pins retrieved', {
    pins: [...reportPins, ...satellitePins]
  });
});

const getCountriesGeoJSON = asyncHandler(async (req, res) => {
  const features = [];

  for (const c of countryPolygonsData) {
    const analysis = await analyzeCountryData(c.name);

    // Leaflet GeoJSON polygon ring format (Lng, Lat)
    const rings = c.coordinates.map(ring => 
      ring.map(([lng, lat]) => [lng, lat])
    );

    features.push({
      type: 'Feature',
      properties: {
        name: c.name,
        riskPercentage: analysis.riskPercentage,
        riskLevel: analysis.riskLevel,
        safePercentage: analysis.safePercentage,
        hasActiveConflict: analysis.hasActiveConflict,
        activeConflictStatus: analysis.activeConflictStatus,
        shortDescription: analysis.shortDescription
      },
      geometry: {
        type: 'Polygon',
        coordinates: rings
      }
    });
  }

  return res.json({
    type: 'FeatureCollection',
    features
  });
});

const getCountryAnalysis = asyncHandler(async (req, res) => {
  const countryName = req.params.countryName;
  const analysis = await analyzeCountryData(countryName);
  return ApiResponse.success(res, `Country analysis for ${countryName}`, { analysis });
});

const exportCountryPdf = asyncHandler(async (req, res) => {
  const countryName = req.params.countryName;
  const analysis = await analyzeCountryData(countryName);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=peacekeeper-country-analysis-${countryName.toLowerCase().replace(/\s+/g, '-')}.pdf`);

  generateCountryPdfReport(analysis, res);
});

module.exports = {
  getMapLocations,
  getCountriesGeoJSON,
  getCountryAnalysis,
  exportCountryPdf
};
