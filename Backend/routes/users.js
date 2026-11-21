import express from "express";

export default function handleUsers(pool) {
  const router = express.Router();

  router.get("/search", async (req, res) => {
    const { user_id, username } = req.query;
    try {
      const result = await pool.query(
        "SELECT id, username FROM users WHERE username ILIKE $1 AND id != $2 LIMIT 10;",
        [`%${username}%`, user_id],
      );

      return res
        .status(200)
        .json({ message: "Found the user.", data: result.rows });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error." });
    }
  });

  return router;
}
