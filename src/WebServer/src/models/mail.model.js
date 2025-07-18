import mongoose from "mongoose";

const MailSchema = new mongoose.Schema(
    {
        subject: { type: String, default: "" },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        draft: { type: Boolean, default: false },
        body: { type: String, default: "" },
    },
    { timestamps: true }
);

MailSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});

const Mail = mongoose.model("Mail", MailSchema);
export default Mail;
