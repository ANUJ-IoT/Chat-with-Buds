import express from "express";

export default function handleConversations(pool) {
  const router = express.Router();

  router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
      const result = await pool.query(
        `SELECT
          c.*,
          (
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', u.id,
                'username', u.username
              )
            )
            FROM conversation_members cm2
            JOIN users u ON u.id = cm2.user_id
            WHERE cm2.conversation_id = c.id
            AND cm2.user_id != $1
          ) AS participants,
          (
            SELECT m.content
            FROM messages m
            WHERE m.conversation_id = c.id
            ORDER BY m.created_at DESC
            LIMIT 1
          ) AS last_message
        FROM conversations c
        JOIN conversation_members cm
          ON c.id = cm.conversation_id
        WHERE cm.user_id = $1
        ORDER BY (
          SELECT m.created_at
          FROM messages m
          WHERE m.conversation_id = c.id
          ORDER BY m.created_at DESC
          LIMIT 1
        ) DESC NULLS LAST,
        c.created_at DESC;`,
        [user_id],
      );

      return res.status(200).json({
        message: "Successful.",
        data: result.rows,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server side error.",
      });
    }
  });

  router.post("/", async (req, res) => {
    let connection;
    try {
      const { participant_id, created_by } = req.body;
      connection = await pool.connect();
      await connection.query("BEGIN");

      const existing = await connection.query(
        `SELECT c.id
        FROM conversations c
        JOIN conversation_members cm1
            ON c.id = cm1.conversation_id
        JOIN conversation_members cm2
            ON c.id = cm2.conversation_id
        WHERE c.conversation_type = 'private'
        AND cm1.user_id = $1
        AND cm2.user_id = $2;`,
        [created_by, participant_id],
      );

      if (existing.rows.length > 0) {
        await connection.query("COMMIT");

        return res.status(200).json({
          message: "Conversation already exists.",
          conversation_id: existing.rows[0].id,
        });
      }

      const result = await connection.query(
        "INSERT INTO conversations (conversation_type, created_by) VALUES ($1, $2) RETURNING *;",
        ["private", created_by],
      );

      const conversation_id = result.rows[0].id;

      await connection.query(
        "INSERT INTO conversation_members (conversation_id, user_id, roleIs) VALUES ($1, $2, $3), ($1, $4, $5);",
        [conversation_id, created_by, "admin", participant_id, "member"],
      );
      await connection.query("COMMIT");

      return res.status(201).json({
        message: "The conversation has been created.",
        data: result.rows[0],
      });
    } catch (error) {
      if (connection) await connection.query("ROLLBACK");

      if (error.code === "23503") {
        return res.status(404).json({
          message: "One or both users do not exist.",
        });
      }
      return res.status(500).json({ message: "Server side error." });
    } finally {
      connection?.release();
    }
  });
  return router;
}
