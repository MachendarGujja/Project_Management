const {CreateTask,DisplayTask,EditTask,DeleteTask} = require('../controllers/TaskControllers');
const auth = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.post("/:projectId", auth, CreateTask);

router.get("/:projectId", auth, DisplayTask);

router.put("/:taskId", auth, EditTask);

router.delete("/:taskId", auth, DeleteTask);

module.exports = router;