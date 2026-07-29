const userRepo = require('../server/repositories/userRepo');

async function debug() {
  console.log('--- Debugging User Lookup in Google Sheets ---');
  const allUsers = await userRepo.find();
  console.log('All Users in Google Sheet:', allUsers);

  const admin = await userRepo.findByEmail('admin@peacekeeper.ai');
  console.log('Found Admin User:', admin);
}

debug().catch(console.error);
