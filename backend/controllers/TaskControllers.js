const Tasks = require('../models/Tasks');
const Project = require('../models/Project');

const CreateTask = async(req,res) => {
    const {title, description, status} = req.body;
    try {
        const project = await Project.findById(req.params.projectId);
        if(!project) {
            return res.status(404).json({message : "Project not found"});
        }
        if(project.owner.toString() !== req.user._id.toString() && req.user.role.trim() !== "admin") {
            return res.status(403).json({message : "Not allowed"});
        }
        const taskRes = await Tasks.create({
            title,
            description,
            status,
            project : project._id,
            owner : req.user._id
        });
        res.status(201).json(taskRes);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
};

const DisplayTask = async(req,res) => {
    try {
        const projectData = await Project.findById(req.params.projectId);
        if(!projectData) {
            return res.status(404).json({message : "Project not found"});
        }
        // console.log("ProjectId param:", req.params.projectId);
        // console.log("User:", req.user);
    //     console.log("User ID:", req.user);
    // console.log("User Role:", req.user.role);
    // console.log("Project Owner:", projectData.owner.toString());
        if(projectData.owner.toString() !== req.user._id.toString() && req.user.role.trim() !== "admin") {
            return res.status(403).json({message : "Not Allowed"});
        }
        let tasks;
        // if(req.user.role === 'admin') {
        //     tasks = await Tasks.find({
        //         project : req.params.projectId
        //     });
        // }
        // else {
        //     tasks = await Tasks.find({
        //         project : req.params.projectId,
        //         owner : req.user.id
        //     });
        // }
        tasks = await Tasks.find({
            project : req.params.projectId
        });
        // const taskData = await Tasks.find({
        //     project : req.params.projectId,
        //     owner : req.user.id
        // });
        res.status(200).json({projectData,tasks});
    }
    catch(err) {
        res.status(500).json({message : err.message});
    }
};

const EditTask = async(req,res) => {
    try {
        const task = await Tasks.findById(req.params.taskId);
        if(!task) {
            return res.status(404).json({message : "Task not found"});
        }
        const project = await Project.findById(task.project);
        if(project.owner.toString() !== req.user._id.toString() && req.user.role.trim() !== "admin") {
            return res.status(403).json({message : "Not Allowed"});
        }
        task.title = req.body.title ?? task.title;
        task.status = req.body.status ?? task.status;
        await task.save();
        res.status(200).json(task);
    }
    catch(err) {
        res.status(500).json({message : err.message});
    }
};

const DeleteTask = async(req,res) => {
    try {
        const task = await Tasks.findById(req.params.taskId);
        if(!task) {
            return res.status(404).json({message : "task not found"});
        }
        const project = await Project.findById(task.project);
        if(project.owner.toString() !== req.user._id.toString() && req.user.role.trim() !== "admin") {
            return res.status(403).json({message : "Not allowed"});
        }
        await task.deleteOne();
        res.status(200).json({message : "deleted successfully"});
    }
    catch(err) {
        res.status(500).json({message : err.message});
    }
}

module.exports = {CreateTask,DisplayTask,EditTask,DeleteTask};