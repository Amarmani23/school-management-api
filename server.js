const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDatabase } = require('./src/config/database');
const schoolRoutes = require('./src/routes/schoolRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/', schoolRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'School Management API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`Add School: POST http://localhost:${PORT}/addSchool`);
            console.log(`List Schools: GET http://localhost:${PORT}/listSchools?latitude=X&longitude=Y`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();