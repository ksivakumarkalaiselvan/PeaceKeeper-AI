const SheetRepository = require('./SheetRepository');

const initialActivities = [
  {
    id: 'act_001',
    actorId: 'usr_obs01',
    action: 'CREATE_REPORT',
    targetType: 'REPORT',
    targetId: 'rep_001',
    description: 'Submitted conflict report regarding Zaporizhzhia nuclear perimeter shelling.',
    timestamp: '2026-07-28T14:20:00.000Z'
  },
  {
    id: 'act_002',
    actorId: 'usr_admin01',
    action: 'TRIGGER_ALERT',
    targetType: 'ALERT',
    targetId: 'alt_101',
    description: 'Issued Critical system alert for Zaporizhzhia demilitarized zone breach.',
    timestamp: '2026-07-28T14:22:00.000Z'
  },
  {
    id: 'act_003',
    actorId: 'usr_admin01',
    action: 'ANALYZE_SATELLITE',
    targetType: 'SATELLITE',
    targetId: 'sat_001',
    description: 'Ran object detection model on Zaporizhzhia satellite image.',
    timestamp: '2026-07-28T12:05:00.000Z'
  }
];

class ActivityRepository extends SheetRepository {
  constructor() {
    super('activities', initialActivities);
  }

  async logActivity(actorId, action, targetType, targetId, description) {
    return await this.create({
      actorId,
      action,
      targetType,
      targetId,
      description,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new ActivityRepository();
