import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullname: { type: String, required: true },
        picture: { type: String, default: null },
        darkTheme: { type: Boolean, default: false },
        labels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Label" }],
        mails: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mail" }],
    },
    { timestamps: true }
);

UserSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    },
});

const User = mongoose.model("User", UserSchema);
export default User;
