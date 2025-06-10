const mongoose = require('mongoose');
const uri = 'mongodb+srv://kunalsur2001:n7ikiJ0KZ4XC9EGv@cluster0.tlqin68.mongodb.net/youtube-clone?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
