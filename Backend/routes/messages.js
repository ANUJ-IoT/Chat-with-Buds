import express from "express";

export default function handleMessages(pool) {
  const router = express.Router();

  router.get("/:conversation_id", async (req, res) => {
    try {
      const { conversation_id } = req.params;

      const result = await pool.query(
        `SELECT
          m.id,
          m.conversation_id,
          m.sender_id,
          u.username,
          m.content,
          m.message_type,
          m.created_at
       FROM messages m
       JOIN users u
       ON u.id = m.sender_id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC;`,
        [conversation_id],
      );

      return res.status(200).json({
        message: "Messages retrieved successfully.",
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server side error.",
      });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const { conversation_id, content, sender_id } = req.body;
      const result = await pool.query(
        "INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING id, conversation_id, sender_id, content, message_type, created_at;",
        [conversation_id, sender_id, content],
      );
      return res.status(201).json({
        message: "Message Sent Successfully.",
        data: result.rows[0],
      });
    } catch (error) {
      if (error.code === "23503") {
        return res.status(403).json({
          message: "Invalid conversation or sender is not a member.",
        });
      }
      return res.status(500).json({ message: "Server side error" });
    }
  });

  return router;
}
