import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    uid: String,
    fullName: String,
    email: String,
    createdAt: Date,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);