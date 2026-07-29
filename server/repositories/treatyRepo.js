const SheetRepository = require('./SheetRepository');

const initialTreaties = [
  {
    id: 'trt_001',
    name: 'Ottawa Anti-Personnel Mine Ban Convention',
    countries: 'Global (164 State Parties)',
    startDate: '1999-03-01',
    expiryDate: 'Indefinite',
    status: 'Active Monitoring',
    violationCount: 14,
    documentUrl: 'https://www.un.org/disarmament/anti-personnel-landmines-convention/'
  },
  {
    id: 'trt_002',
    name: 'Geneva Convention (Protocol I - Protection of Civilian Infrastructure)',
    countries: 'Global (174 State Parties)',
    startDate: '1978-12-07',
    expiryDate: 'Indefinite',
    status: 'High Alert',
    violationCount: 29,
    documentUrl: 'https://www.icrc.org/en/doc/war-and-law/treaties-customary-law/geneva-conventions/overview-geneva-conventions.htm'
  },
  {
    id: 'trt_003',
    name: 'Black Sea Humanitarian Demilitarization Accord',
    countries: 'Regional Coalition',
    startDate: '2022-07-22',
    expiryDate: '2026-12-31',
    status: 'Under Review',
    violationCount: 8,
    documentUrl: 'https://www.un.org/en/black-sea-grain-initiative'
  },
  {
    id: 'trt_004',
    name: 'Comprehensive Nuclear-Test-Ban Treaty (CTBT)',
    countries: 'Global (187 Signatories)',
    startDate: '1996-09-24',
    expiryDate: 'Indefinite',
    status: 'Compliant',
    violationCount: 1,
    documentUrl: 'https://www.ctbto.org/'
  }
];

class TreatyRepository extends SheetRepository {
  constructor() {
    super('treaties', initialTreaties);
  }
}

module.exports = new TreatyRepository();
