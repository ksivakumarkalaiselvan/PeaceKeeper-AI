const SheetRepository = require('./SheetRepository');

const initialReports = [
  {
    id: 'rep_001',
    reportedBy: 'usr_obs01',
    country: 'Ukraine',
    state: 'Zaporizhzhia',
    district: 'Enerhodar Sector',
    lat: 47.5085,
    lng: 34.6241,
    conflictType: 'Artillery Shelling Near Nuclear Infrastructure',
    description: 'Multiple heavy artillery impacts observed within 3km demilitarized buffer zone near cooling towers.',
    evidenceImages: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
    videos: '',
    documents: 'field_scan_001.pdf',
    status: 'Verified',
    riskLevel: 'Critical',
    riskPercentage: 92,
    createdAt: '2026-07-28T14:20:00.000Z'
  },
  {
    id: 'rep_002',
    reportedBy: 'usr_admin01',
    country: 'Sudan',
    state: 'Khartoum',
    district: 'Omdurman Sector B',
    lat: 15.6500,
    lng: 32.4800,
    conflictType: 'Troop Movement & Ceasefire Violation',
    description: 'Armored column movement detected breaking Sector 4 humanitarian corridor agreement.',
    evidenceImages: 'https://images.unsplash.com/photo-1579912437766-78900662d5aa?auto=format&fit=crop&w=800&q=80',
    videos: '',
    documents: '',
    status: 'Under Investigation',
    riskLevel: 'High',
    riskPercentage: 78,
    createdAt: '2026-07-27T09:45:00.000Z'
  },
  {
    id: 'rep_003',
    reportedBy: 'usr_obs01',
    country: 'Taiwan Strait',
    state: 'Maritime Zone',
    district: 'Median Line Sector 7',
    lat: 24.2000,
    lng: 119.5000,
    conflictType: 'Naval Exclusion Zone Crossing',
    description: 'Unannounced naval patrol flotilla crossing maritime boundary line with active fire control radars.',
    evidenceImages: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
    videos: '',
    documents: '',
    status: 'Verified',
    riskLevel: 'High',
    riskPercentage: 74,
    createdAt: '2026-07-26T18:10:00.000Z'
  },
  {
    id: 'rep_004',
    reportedBy: 'usr_obs01',
    country: 'Somalia',
    state: 'Banadir',
    district: 'Mogadishu North',
    lat: 2.0469,
    lng: 45.3182,
    conflictType: 'Illegal Munitions Cache Discovered',
    description: 'UN peacekeepers uncovered illicit anti-personnel landmines banned under Ottawa Convention.',
    evidenceImages: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    videos: '',
    documents: 'mine_inspection_log.pdf',
    status: 'Resolved',
    riskLevel: 'Medium',
    riskPercentage: 48,
    createdAt: '2026-07-25T11:15:00.000Z'
  },
  {
    id: 'rep_005',
    reportedBy: 'usr_admin01',
    country: 'Syria',
    state: 'Idlib',
    district: 'Northern Border Strip',
    lat: 35.9306,
    lng: 36.6339,
    conflictType: 'Drone Reconnaissance Incursion',
    description: 'Unidentified tactical UAV flying low altitude over refugee camp perimeter.',
    evidenceImages: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
    videos: '',
    documents: '',
    status: 'Pending Verification',
    riskLevel: 'Medium',
    riskPercentage: 42,
    createdAt: '2026-07-24T16:00:00.000Z'
  }
];

class ReportRepository extends SheetRepository {
  constructor() {
    super('reports', initialReports);
  }
}

module.exports = new ReportRepository();
