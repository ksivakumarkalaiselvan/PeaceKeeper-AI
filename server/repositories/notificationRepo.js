const SheetRepository = require('./SheetRepository');

const initialNotifications = [
  {
    id: 'not_001',
    userId: 'usr_admin01',
    type: 'ALERT_CRITICAL',
    message: 'CRITICAL ALERT: Shelling near Zaporizhzhia Nuclear Facility.',
    read: false,
    link: '/alerts.html',
    createdAt: '2026-07-28T14:22:00.000Z'
  },
  {
    id: 'not_002',
    userId: 'usr_obs01',
    type: 'REPORT_STATUS',
    message: 'Your report rep_001 has been verified by Admin.',
    read: true,
    link: '/conflicts.html',
    createdAt: '2026-07-28T15:00:00.000Z'
  }
];

class NotificationRepository extends SheetRepository {
  constructor() {
    super('notifications', initialNotifications);
  }

  async markAsRead(id) {
    return await this.updateById(id, { read: true });
  }

  async markAllAsReadForUser(userId) {
    const userNotes = await this.find(n => n.userId === userId && !n.read);
    for (const note of userNotes) {
      await this.updateById(note.id, { read: true });
    }
    return true;
  }
}

module.exports = new NotificationRepository();
