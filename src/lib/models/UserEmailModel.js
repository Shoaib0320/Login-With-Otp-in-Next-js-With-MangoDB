// models/User.js
import mongoose from 'mongoose';

const UserWithEmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiresAt: { type: Date, required: true }, // Make sure otpExpiresAt is required
});

export const UserEmailModal = 
    mongoose.models.UserWithEmail || mongoose.model('UserWithEmail', UserWithEmailSchema);
