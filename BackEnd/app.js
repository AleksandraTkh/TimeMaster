import express from "express";
import cors from "cors";
import {
  getAllUsers,
  getUserById,
  addUser,
  deleteUser,
  updateUser,
} from "./controllers/userController.js";

import { registerUser, loginUser } from "./controllers/authController.js";

import {
  getPlanForUser,
  getAllPlans,
  addPlan,
  deletePlan,
  updatePlan,
  deleteAllUserPlans,
} from "./controllers/planController.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// User routes
app.get("/users", getAllUsers);
app.get("/users/:id", getUserById);
app.post("/users", addUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);

// Authentication routes
app.post("/register", registerUser);
app.post("/login", loginUser);

//Plan routes
app.get("/users/:userId/plans/:planId", getPlanForUser);
app.get("/users/:userId/plans/", getAllPlans);
app.post("/users/:userId/plans", addPlan);
app.put("/users/:userId/plans/:planId", updatePlan);
app.delete("/users/:userId/plans/:planId", deletePlan);
app.delete("/users/:userId/plans", deleteAllUserPlans);

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
