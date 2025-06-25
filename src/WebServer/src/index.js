import customenv from "custom-env";
import mongoose from "mongoose";
import app from "./app.js";

customenv.env();

mongoose.connect(process.env.MONGO_URI);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
