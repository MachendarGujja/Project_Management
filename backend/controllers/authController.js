const User = require('../models/User');
const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

const FetchMe = async(req,res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) {
            res.status(404).json({message: "user not found"});
        }
        res.json(user);
    }
    catch(err) {
        res.status(500).json({message: err.message});
    }
}

const RegisterUser = async(req,res) => {
    const {name,email,password,role} = req.body;
    try {
        const UserData = await User.findOne({email});
        if(UserData) {
            return res.status(400).json({msg: "User Already Registered"});
        }
        const HashPassword = await bcrypt.hash(password,10);
        const NewUser = User.create({
                name,
                email,
                password: HashPassword,
                role
        });
        res.status(201).json({
            _id: NewUser._id,
            name: NewUser.name,
            email: NewUser.email
        }).select("-password");
    }
    catch(err){
        res.status(500).json({Error : err.message});
    }
}

const LoginUser = async(req,res) => {
    const {email,password} = req.body;
    try {
        const UserData = await User.findOne({email});
        if(!email) {
            return res.status(400).json({msg: "User Not Found"});
        }

        const comparePassword = await bcrypt.compare(password,UserData.password);

        if(!comparePassword) {
            return res.status(400).json({msg: "Password Wrong"});
        }
        const token = generateToken(UserData._id,UserData.role);
        res.status(201).json({
            token,
            user : {
                _id : UserData._id,
                name : UserData.name,
                email : UserData.email,
                role : UserData.role
            }
        })
    }
    catch(err) {
        res.json(500).json({Error : err.message});
    }
}


module.exports = { FetchMe, RegisterUser, LoginUser };