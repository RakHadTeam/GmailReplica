import mongoose from "mongoose";

const MailSchema = new mongoose.Schema(
    {
        subject: { type: String, required: true },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        draft: { type: Boolean, default: false },
        body: { type: String, required: true },
    },
    { timestamps: true }
);

const Mail = mongoose.model("Mail", MailSchema);
export default Mail;
