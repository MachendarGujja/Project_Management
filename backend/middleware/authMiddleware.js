const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async(req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({msg: "Token is Invalid"});
    }
    const token = authHeader.split(" ")[1];

    try {
        const compare = jwt.verify(token,process.env.JWT_TOKEN);
        // console.log("Decoded user:", compare);
        const userData = await User.findById(compare.id).select("-password");
        if(!userData) {
            res.status(401).json({msg: "User Not Found"});
        }
        req.user = userData;
        // console.log(req.user);
        next();
    }
    catch(err) {
        res.status(401).json({Error: err.message})
    }
}

module.exports = authMiddleware;