const Project = require('../models/Project');

const CreateProjects = async(req,res) => {
    const {name,description,status} = req.body;
    try {
        const verifyName = await Project.findOne({name, owner: req.user.id});
        if(verifyName) {
            return res.status(400).json({msg : "Project Name already exsisted"});
        }
        const newProject = await Project.create({
            name,
            description,
            status,
            owner : req.user.id
        });
        res.status(201).json(newProject);
    }
    catch(err) {
        res.status(500).json({Error : err.message});
    }
};

const DisplayProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === "admin") {
            projects = await Project.find({ owner: req.params.userId });
        } else {
            projects = await Project.find({ owner: req.user._id });
        }

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
};

// const DisplayOneProject = async(req,res) => {
//     try {
//         const project = await Project.findById(req.params.id);
//         if(!project) {
//             return res.status(404).json({message : "project not found"});
//         }
//         if(project.owner.toString() !== req.user.id) {
//             return res.status(403).json({message : "Not allowed"});
//         }
//         res.status(200).json(project);
//     }
//     catch(err){
//         res.status(500).json({message : err.message});
//     }
// }

const EditProjects = async(req,res) => {
    try {
        const project = await Project.findById(req.params.id);
        if(!project) {
            res.status(404).json({message: "project not found"});
        }
        if(project.owner.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(403).json({message: "Not Allowed"});
        }
        if(req.body.name !== undefined){
            project.name = req.body.name || project.name;
        }
        if(req.body.status !== undefined) {
            project.status = req.body.status || project.status;
        }
        project.save();
        res.json(project);
    }
    catch(err) {
        res.status(500).json({Error : err.message});
    }
}

const DeleteProjects = async(req,res) => {
    try {
        const projectData = await Project.findById(req.params.id);
        if(!projectData) {
            res.status(404).json({message: "project not found"});
        }
        if(projectData.owner.toString() !== req.user.id && req.user.role !== "admin") {
            res.status(403).json({message: "not allowed"});
        }
        await projectData.deleteOne();
        res.status(200).json({message: "project deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

module.exports = {CreateProjects, DisplayProjects, EditProjects, DeleteProjects};