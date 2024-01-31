import pool from "../db.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a user by Id
export const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new user
export const addUser = async (request, response) => {
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

    // If email is unique, proceed with the insertion
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

//Update a user by Id
export const updateUser = async (request, response) => {
  const userId = parseInt(request.params.id);
  const { username, email, password } = request.body;

  try {
    // Check if the user exists
    const checkUser = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );
    if (checkUser.rows.length === 0) {
      response.status(404).json({ error: "User not found" });
      return;
    }

    // Update the user
    const result = await pool.query(
      "UPDATE users SET username = $2, email = $3, password = $4 WHERE user_id = $1 RETURNING *",
      [userId, username, email, password]
    );

    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

//Delete a user by Id
export const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    // Check if the user with the specified ID exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete the user
    const result = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [userId]
    );

    // Check if there is a result after deletion
    if (result.rows.length > 0) {
      // Respond with the deleted user
      res.json(result.rows[0]);
    } else {
      // Respond with a message if there is no result after deletion
      res.json({ message: "User deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
