import customenv from "custom-env";
import mongoose from "mongoose";
import app from "./app.js";

customenv.env(process.env.NODE_ENV || "development", "config");

mongoose.connect(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
