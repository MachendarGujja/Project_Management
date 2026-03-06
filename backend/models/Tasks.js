const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String
    },
    status : {
        type : String,
        enum : ["todo","in-progress","done"],
        default : "todo"
    },
    project : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project",
        required : true
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},
{
    timestamp : true
});

module.exports = mongoose.model("Tasks", TasksSchema);