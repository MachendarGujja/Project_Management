const express = require('express');
const connectDB =  require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
const cors = require('cors');
require("dotenv").config();

// Temporary fix for casing conflict
// console.log('Starting server...');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
connectDB();

// app.get('/', (req,res) => {
//     res.send("Home Page")
// });
app.use("/api/auth",authRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/tasks",TaskRoutes);

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
})