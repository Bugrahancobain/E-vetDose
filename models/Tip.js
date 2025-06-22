import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
    tip: String,
    createdAt: {
        type: Date,
        default: () => new Date(),
    }
});

export default mongoose.models.Tip || mongoose.model("Tip", TipSchema);