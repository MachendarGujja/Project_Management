const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description : String,
    status : {
        type : String,
        enum : ["pending","in-progress","completed"],
        default : "pending"
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{
    timestamps : true
});

module.exports = mongoose.model("Project", ProjectSchema);