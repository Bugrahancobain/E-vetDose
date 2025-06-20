import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    _id: String,
    text: String,
    sender: String,
    timestamp: Number,
    image: String,
    typing: Boolean,
});

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

const AlarmSchema = new mongoose.Schema({
    patientName: String,
    description: String,
    time: String, // "HH:mm" formatlı saat bilgisi
    isDaily: Boolean,
    alarmTime: Date,
});


const UserSchema = new mongoose.Schema({
    uid: String,
    fullName: String,
    email: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    fcmToken: String,
    alarms: [AlarmSchema],
    messages: [MessageSchema],
    dosages: [DosageSchema],
    images: [
        {
            fileName: String,
            base64Image: String,
            uploadedAt: Date,
        }
    ],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);