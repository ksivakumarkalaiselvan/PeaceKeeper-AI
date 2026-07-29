const SheetRepository = require('./SheetRepository');

const initialAlerts = [
  {
    id: 'alt_101',
    level: 'Critical',
    title: 'Nuclear Facility Buffer Zone Impact',
    message: 'Artillery shell landed inside 3km safety ring around Zaporizhzhia plant. Risk score elevated to 92%.',
    relatedReport: 'rep_001',
    region: 'Zaporizhzhia, Ukraine',
    emailSent: true,
    acknowledged: false,
    createdAt: '2026-07-28T14:22:00.000Z'
  },
  {
    id: 'alt_102',
    level: 'High',
    title: 'Ceasefire Corridor Breach',
    message: 'Armored columns entering non-combat zone near Omdurman humanitarian hub.',
    relatedReport: 'rep_002',
    region: 'Khartoum, Sudan',
    emailSent: true,
    acknowledged: true,
    createdAt: '2026-07-27T10:00:00.000Z'
  },
  {
    id: 'alt_103',
    level: 'High',
    title: 'Maritime Boundary Radar Lock',
    message: 'Multiple surface vessels active fire lock in Taiwan Strait sector 7.',
    relatedReport: 'rep_003',
    region: 'Taiwan Strait',
    emailSent: true,
    acknowledged: false,
    createdAt: '2026-07-26T18:15:00.000Z'
  },
  {
    id: 'alt_104',
    level: 'Medium',
    title: 'Banned Munitions Discovery',
    message: 'Ottawa Convention violation detected. 45 antipersonnel mines seized.',
    relatedReport: 'rep_004',
    region: 'Mogadishu, Somalia',
    emailSent: false,
    acknowledged: true,
    createdAt: '2026-07-25T11:30:00.000Z'
  }
];

class AlertRepository extends SheetRepository {
  constructor() {
    super('alerts', initialAlerts);
  }
}

module.exports = new AlertRepository();
