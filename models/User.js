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

const SubscriptionSchema = new mongoose.Schema({
    status: { type: String, enum: ["trial", "active", "expired"], default: "trial" },
    plan: { type: String, enum: ["basic", "pro", "enterprise", null], default: null },
    billingCycle: { type: String, enum: ["monthly", "yearly", null], default: null },
    trialStart: { type: Date, default: Date.now },
    trialEnd: { type: Date },
    subscriptionStart: { type: Date, default: null },
    subscriptionEnd: { type: Date, default: null },
    subscriptionId: { type: String, default: null },
    customerId: { type: String, default: null }
});


const UserSchema = new mongoose.Schema({
    uid: String,
    fullName: String,
    email: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    },
    profileImage: {
        type: String,
        default: "", // opsiyonel
    }, // 👈 base64 formatında fotoğraf için eklendi
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
    subscription: {
        type: SubscriptionSchema,
        default: () => ({})
    }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);