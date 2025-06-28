import mongoose from "mongoose";

const LabelSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mail" }],
});

const Label = mongoose.model("Label", LabelSchema);
export default Label;
