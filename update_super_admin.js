const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://mt7592546_db_user:Onvdl75ubLyEqoxg@cluster0.x1amah0.mongodb.net/winter-summer?retryWrites=true&w=majority&appName=Cluster0';

async function updateSuperAdminPassword() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const newPassword = await bcrypt.hash('123456', 12);
  await db.collection('users').updateOne(
    { email: 'admin@wintersummer.com' },
    { $set: { password: newPassword } }
  );
  console.log('Super Admin Password updated successfully.');
  process.exit(0);
}

updateSuperAdminPassword();
