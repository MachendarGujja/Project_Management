const express = require('express');
const router = express.Router();
const {RegisterUser, LoginUser, FetchMe} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

// Add your authentication routes here
// router.get('/', (req,res)=>{
//     res.send("Hello");
// });

router.get("/me", authMiddleware, FetchMe);

router.post('/signup', RegisterUser);

router.post('/login', LoginUser);

module.exports = router;