import express from "express";
import bcrypt from "bcrypt";

export default function validateUser(pool) {
  const router = express.Router();

  router.post("/register", async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const result = await pool.query(
        "SELECT id FROM users WHERE username = $1 OR email = $2",
        [name, email],
      );

      if (result.rows.length > 0)
        return res.status(400).json({ message: "Record Exists." });

      const dataOfUser = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1,$2,$3) RETURNING id, username, email, created_at",
        [name, email, hashedPassword],
      );

      return res.status(201).json({
        message: "Successfull.",
        data: {
          id: dataOfUser.rows[0].id,
          name: dataOfUser.rows[0].username,
          email: dataOfUser.rows[0].email,
          created_at: dataOfUser.rows[0].created_at,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { name, password } = req.body;
      const result = await pool.query(
        "SELECT u.* FROM users u WHERE email = $1",
        [name],
      );

      if (result.rows.length === 0)
        return res.status(400).json({ message: "User does not exists." });

      const isMatch = await bcrypt.compare(password, result.rows[0].password);

      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials." });

      return res.status(200).json({
        message: "Successfull.",
        data: {
          id: result.rows[0].id,
          name: result.rows[0].username,
          email: result.rows[0].email,
          created_at: result.rows[0].created_at,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Server side error." });
    }
  });

  return router;
}
