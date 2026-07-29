const express = require('express');
const router = express.Router();
const {
  getMapLocations,
  getCountriesGeoJSON,
  getCountryAnalysis,
  exportCountryPdf
} = require('../controllers/mapController');
const { protect } = require('../middlewares/auth');

router.get('/locations', protect, getMapLocations);
router.get('/countries-geojson', protect, getCountriesGeoJSON);
router.get('/country-analysis/:countryName', protect, getCountryAnalysis);
router.get('/country-analysis/:countryName/pdf', protect, exportCountryPdf);

module.exports = router;
