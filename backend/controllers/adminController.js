const User = require('../models/User');
const Project = require('../models/Project');
const Tasks = require('../models/Tasks');

const DisplayUsers = async(req,res) => {
    try {
        if(req.user.role !== "admin") {
            return res.status(403).json({message : "Admin only access"});
        }
        const users = await User.find({role : "user"}).select("-password");
        if(users.length === 0) {
            return res.status(404).json({message : "Users not found"});
        }
        const projects = await Project.find();
        const tasks = await Tasks.find();
        res.status(200).json({users,projects,tasks});
    }
    catch(err) {
        res.status(500).json({message : err.message});
    }
};


module.exports = DisplayUsers;