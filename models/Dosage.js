import mongoose from 'mongoose';

const DosageSchema = new mongoose.Schema({
    uid: String,
    medication: String,
    animal: String,
    organ: String,
    method: String,
    enteredDose: String,
    weight: String,
    dose: String,
    requiredCc: String,
    concentration: String,
    date: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Dosage || mongoose.model('Dosage', DosageSchema);