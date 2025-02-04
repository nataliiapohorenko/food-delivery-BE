const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const restaurantRoutes = require('./routes/restaurantRoutes');

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception thrown:', error);
    process.exit(1);
});

const app = express();

app.use(cors({
    origin: '*',
    methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  }));
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', restaurantRoutes);

const PORT = process.env.PORT || 8080

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT);
    })
    .catch(err => console.log(err));