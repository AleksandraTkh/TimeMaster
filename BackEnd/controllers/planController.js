import pool from "../db.js";

// Get all plans for a user by user Id
export const getAllPlans = async (req, res) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId)) {
    console.error("Invalid user ID:", req.params.id);
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }
  try {
    const result = await pool.query("SELECT * FROM plans WHERE user_id = $1", [
      userId,
    ]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a plan for a user by user Id
export const getPlanForUser = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const planId = parseInt(req.params.planId);
  try {
    const result = await pool.query(
      "SELECT * FROM plans WHERE user_id = $1 AND plan_id = $2",
      [userId, planId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Plan not found for the user" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add a new plan for a user
export const addPlan = async (req, res) => {
  const { user_id, description, start_time, end_time, date } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO plans (user_id, description, start_time, end_time, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [user_id, description, start_time, end_time, date]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Update a plan for a user by Id
export const updatePlan = async (req, res) => {
  const plan_id = parseInt(req.params.planId);
  const { description, start_time, end_time, date } = req.body;

  try {
    const result = await pool.query(
      "UPDATE plans SET description = $1, start_time = $2, end_time = $3, date = $4 WHERE plan_id = $5 RETURNING *",
      [description, start_time, end_time, date, plan_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Plan not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Delete a plan for a user by plan Id
export const deletePlan = async (req, res) => {
  const plan_id = parseInt(req.params.planId);

  try {
    const result = await pool.query(
      "DELETE FROM plans WHERE plan_id = $1 RETURNING *",
      [plan_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Plan not found" });
    } else {
      res.json({ message: "Plan deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Delete All Plans for a User
export const deleteAllUserPlans = async (req, res) => {
  const user_id = parseInt(req.params.userId);

  try {
    const result = await pool.query(
      "DELETE FROM plans WHERE user_id = $1 RETURNING *",
      [user_id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "No plans found for the user" });
    } else {
      res.json({ message: "All plans deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
