const SheetRepository = require('./SheetRepository');

const initialSatelliteImages = [
  {
    id: 'sat_001',
    imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=1200&q=80',
    region: 'Zaporizhzhia Nuclear Perimeter',
    lat: 47.5085,
    lng: 34.6241,
    uploadedBy: 'usr_admin01',
    detectionStatus: 'Analyzed',
    objectDetectionResult: JSON.stringify({
      tanks: 6,
      artilleryUnits: 4,
      fortifications: 2,
      confidenceScore: 0.94
    }),
    bufferZoneFlag: true,
    capturedAt: '2026-07-28T12:00:00.000Z'
  },
  {
    id: 'sat_002',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    region: 'Khartoum Sector 4 Corridor',
    lat: 15.6500,
    lng: 32.4800,
    uploadedBy: 'usr_obs01',
    detectionStatus: 'Analyzed',
    objectDetectionResult: JSON.stringify({
      armoredPersonnelCarriers: 12,
      trucks: 18,
      confidenceScore: 0.89
    }),
    bufferZoneFlag: true,
    capturedAt: '2026-07-27T08:30:00.000Z'
  },
  {
    id: 'sat_003',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    region: 'Taiwan Strait Patrol Transit',
    lat: 24.2000,
    lng: 119.5000,
    uploadedBy: 'usr_admin01',
    detectionStatus: 'Pending Review',
    objectDetectionResult: JSON.stringify({
      frigates: 3,
      destroyers: 2,
      confidenceScore: 0.87
    }),
    bufferZoneFlag: false,
    capturedAt: '2026-07-26T16:45:00.000Z'
  }
];

class SatelliteRepository extends SheetRepository {
  constructor() {
    super('satellite_images', initialSatelliteImages);
  }
}

module.exports = new SatelliteRepository();
