const express = require('express');
const {CreateProjects, DisplayProjects, EditProjects, DeleteProjects} = require("../controllers/projectController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/",auth, DisplayProjects);

router.get("/:userId", auth, DisplayProjects);

// router.get("/:id",auth, DisplayOneProject);

router.post("/",auth, CreateProjects);

router.put("/:id", auth, EditProjects);

router.delete("/:id", auth, DeleteProjects);

module.exports = router;