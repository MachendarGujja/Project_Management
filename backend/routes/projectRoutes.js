const express = require("express");
const {
  CreateProjects,
  DisplayProjects,
  EditProjects,
  DeleteProjects,
} = require("../controllers/projectController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// create project for logged-in user OR selected user by admin
router.post("/", auth, CreateProjects);

// get logged-in user's projects
router.get("/", auth, DisplayProjects);

// get selected user's projects for admin
router.get("/:userId", auth, DisplayProjects);

// edit project
router.put("/:id", auth, EditProjects);

// delete project
router.delete("/:id", auth, DeleteProjects);

module.exports = router;