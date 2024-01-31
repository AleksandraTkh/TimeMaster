import pool from "../db.js";

export const registerUser = async (request, response) => {
  const { username, email, password } = request.body;

  try {
    // Check if the email already exists
    const checkResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      // If email already exists, return an error
      return response.status(400).json({ error: "Email already exists" });
    }

    // If email is unique, proceed with the registration
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id",
      [username, email, password]
    );

    const newUserId = result.rows[0].user_id;
    response.status(201).json({ user_id: newUserId, username, email });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

// Log in an existing user
export const loginUser = async (request, response) => {
  const { email, password } = request.body;

  try {
    // Check if the user exists
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      response.status(401).json({ error: "Invalid credentials" });
    } else {
      response.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
