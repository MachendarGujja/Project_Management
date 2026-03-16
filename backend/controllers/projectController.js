const Project = require("../models/Project");

const CreateProjects = async (req, res) => {
  const { name, description, status, owner } = req.body;

  try {
    const ownerId =
      req.user.role === "admin" && owner ? owner : req.user.id;

    const verifyName = await Project.findOne({
      name: name.trim(),
      owner: ownerId,
    });

    if (verifyName) {
      return res.status(400).json({ msg: "Project name already existed" });
    }

    const newProject = await Project.create({
      name: name.trim(),
      description,
      status,
      owner: ownerId,
    });

    return res.status(201).json(newProject);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const DisplayProjects = async (req, res) => {
  try {
    let ownerId;

    if (req.user.role === "admin" && req.params.userId) {
      ownerId = req.params.userId;
    } else {
      ownerId = req.user.id;
    }

    const projects = await Project.find({ owner: ownerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json(projects);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const EditProjects = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      project.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (req.body.name !== undefined) {
      project.name = req.body.name.trim();
    }

    if (req.body.description !== undefined) {
      project.description = req.body.description;
    }

    if (req.body.status !== undefined) {
      project.status = req.body.status;
    }

    await project.save();

    return res.status(200).json(project);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const DeleteProjects = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (
      project.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await project.deleteOne();

    return res.status(200).json({
      message: "Project deleted successfully",
      deletedId: req.params.id,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateProjects,
  DisplayProjects,
  EditProjects,
  DeleteProjects,
};