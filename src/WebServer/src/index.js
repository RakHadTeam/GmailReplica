import customenv from "custom-env";
import app from "./app.js";

customenv.env();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
