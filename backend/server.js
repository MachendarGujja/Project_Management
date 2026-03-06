const express = require('express');
const connectDB =  require('./config/db');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const projectRoutes = require('./routes/projectRoutes');
const TaskRoutes = require('./routes/TaskRoutes');
const compression = require('compression');
const cors = require('cors');
require("dotenv").config();

// Temporary fix for casing conflict
// console.log('Starting server...');

const allowedOrigins = [
    "http://localhost:5173",
    "https://project-management-pink-five.vercel.app"
]

const app = express();
app.use(cors({
    origin: allowedOrigins,
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
}));
app.use(express.json());
app.use(compression());

const PORT = process.env.PORT || 4000;
connectDB();

// for health check
app.get('/', (req,res) => {
    res.send("Project Management API is running");
});

app.use("/api/auth",authRoutes);

app.use("/api/admin",adminRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/tasks",TaskRoutes);

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
})