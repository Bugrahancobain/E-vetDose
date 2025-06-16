import mongoose from 'mongoose';

const DosageSchema = new mongoose.Schema({
    medication: String,
    animal: String,
    organ: String,
    method: String,
    weight: String,
    dose: String,
    requiredCc: String,
    concentration: String,
    date: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
}, { _id: false }); // nested schema'da _id üretmesin

const UserSchema = new mongoose.Schema({
    uid: String,
    fullName: String,
    email: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    dosages: [DosageSchema]
});

export default mongoose.models.User || mongoose.model('User', UserSchema);