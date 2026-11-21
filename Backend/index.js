import express from "express";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import pool from "./config/db.js";
import validateUser from "./routes/userRoutes.js";
import handleUsers from "./routes/users.js";
import handleConversations from "./routes/conversations.js";
import handleMessages from "./routes/messages.js";

const app = express();

//TODO: Implement : user's data storage(statefull or stateless)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later!" },
});

app.use(limiter);

// async function test_connection() {
//   try {
//     const result = await pool.query("SELECT NOW()");
//     console.log("connected");
//     console.log("database time ", result.rows[0].now);
//   } catch (error) {
//     console.log(error.message);
//   } finally {
//     await pool.end();
//   }
// }

// test_connection();

app.use(cors());
app.use(express.json());

app.use("/authentication", validateUser(pool));
app.use("/users", handleUsers(pool));
app.use("/conversations", handleConversations(pool));
app.use("/messages", handleMessages(pool));

export default app;
