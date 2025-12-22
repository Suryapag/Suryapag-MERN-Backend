const mongoose = require('mongoose');

export const db = mongoose.connect('mongodb+srv://suryapa9092_db_user:oDxRzukuwECvTdw1@nodebackend.hrwosrp.mongodb.net/HotelManagementSystem')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err: String) => console.error('MongoDB connection error:', err));