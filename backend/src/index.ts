import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/user.routes.js';
import petRoutes from './routes/pet.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc'; // Default import
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
console.log(process.env.MONGODB_URI, 'uri');

// Swagger configuration
const swaggerOptions = { // No explicit type needed; TypeScript infers it
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Management API',
      version: '1.0.0',
      description: 'API for managing users and their pets',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            phoneNumber: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['Point'] },
                coordinates: { type: 'array', items: { type: 'number' }, minItems: 2, maxItems: 2 },
              },
            },
            profilePicture: { type: 'string' },
          },
        },
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            breed: { type: 'string' },
            status: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            owner: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Adjust path as necessary
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);
app.use('/pets', petRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});