const adminMiddleware = (req,res,next) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({message : "Admin only access"});
        }
        next();
    }
    catch(err) {
        res.status(500).json({message : err.message});
    }
}
module.exports = adminMiddleware;