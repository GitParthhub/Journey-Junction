const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  notifications: [{
    id: { type: String, required: true },
    type: { type: String, enum: ['trip_approved', 'trip_rejected', 'payment_required'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    actionRequired: { type: Boolean, default: false },
    actionType: { type: String, enum: ['payment', 'confirmation'] },
    actionData: { type: mongoose.Schema.Types.Mixed }
  }],
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
