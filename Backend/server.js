import dotenv from "dotenv/config";
import app from "./index.js";

app.listen(process.env.PORT, () => {
  console.log("Running on port : ", process.env.PORT);
});
