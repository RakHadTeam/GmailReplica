import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String, required: true },
        picture: { type: String, default: null },
        labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
        mails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mail" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
