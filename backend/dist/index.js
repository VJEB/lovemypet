import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import petRoutes from './routes/pet.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
console.log(process.env.MONGODB_URI, 'uri');
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.use('/users', userRoutes);
app.use('/pets', petRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
