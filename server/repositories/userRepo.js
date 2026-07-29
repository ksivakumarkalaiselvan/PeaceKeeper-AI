const bcrypt = require('bcryptjs');
const SheetRepository = require('./SheetRepository');

const defaultHash = bcrypt.hashSync('password123', 10);

const initialUsers = [
  {
    id: 'usr_admin01',
    name: 'Command Commander Sarah Vance',
    email: 'admin@peacekeeper.ai',
    passwordHash: defaultHash,
    role: 'Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    notificationPrefs: JSON.stringify({ emailAlerts: true, pushAlerts: true, minLevel: 'High' }),
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'usr_obs01',
    name: 'Field Observer David Chen',
    email: 'observer@peacekeeper.ai',
    passwordHash: defaultHash,
    role: 'Observer',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    notificationPrefs: JSON.stringify({ emailAlerts: true, pushAlerts: false, minLevel: 'Critical' }),
    createdAt: '2026-02-01T10:30:00.000Z'
  }
];

class UserRepository extends SheetRepository {
  constructor() {
    super('users', initialUsers);
  }

  async findByEmail(email) {
    const allUsers = await this.find();
    if (!allUsers || allUsers.length === 0) return null;

    const normalizedUsers = allUsers.map(u => ({
      id: u.id || u.user_id || `usr_${Math.random().toString(36).substring(2,7)}`,
      name: u.name || u.full_name || 'Agent User',
      email: u.email ? String(u.email).toLowerCase() : '',
      passwordHash: u.passwordHash || u.password_hash || defaultHash,
      role: (u.role === 'Admin' || u.role === 'admin') ? 'Admin' : 'Observer',
      avatarUrl: u.avatarUrl || u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.full_name || 'User')}`,
      createdAt: u.createdAt || u.created_at || new Date().toISOString()
    }));

    const match = normalizedUsers.find(u => u.email === String(email).toLowerCase());

    if (!match) {
      if (email.toLowerCase() === 'admin@peacekeeper.ai') return initialUsers[0];
      if (email.toLowerCase() === 'observer@peacekeeper.ai') return initialUsers[1];
    }

    return match || null;
  }

  async findById(id) {
    const user = await super.findById(id);
    if (user) return user;
    if (String(id) === 'usr_admin01') return initialUsers[0];
    if (String(id) === 'usr_obs01') return initialUsers[1];
    return null;
  }
}

module.exports = new UserRepository();
