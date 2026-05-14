const mongoose = require('mongoose');

const uri = 'mongodb+srv://mt7592546_db_user:Onvdl75ubLyEqoxg@cluster0.x1amah0.mongodb.net/winter-summer?retryWrites=true&w=majority&appName=Cluster0';

async function getAdmin() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({ role: 'admin' }).toArray();
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
}

getAdmin();
