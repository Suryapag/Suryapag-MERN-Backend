import { Schema, model } from 'mongoose';
import { ref } from 'node:process';

const userSchema = new Schema({
  useruid : { type: String, auto: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  address: { type: String, required: true },
  profile: { type: String, required: true },
  status: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  roles: { type: Schema.Types.ObjectId, ref: 'Roles' },
  sassionTime: { type: Date, default: null },
  refreshToken: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const RoleSchema = new Schema({
  roleName: { type: String, required: true },
  roleuid: { type: String, auto: true, unique: true },
  description: { type: String, required: true },
  room: { type: Object, default: {} },
  user: { type: Object, default: {} },
  booking: { type: Object, default: {} },
  inventory: { type: Object, default: {} },
  reports: { type: Object, default: {} },
});

export const Roles = model('Roles', RoleSchema);
export const User = model('User', userSchema);