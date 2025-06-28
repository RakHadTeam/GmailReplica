import mongoose from "mongoose";

const LabelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mail" }],
});

LabelSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});

const Label = mongoose.model("Label", LabelSchema);
export default Label;
