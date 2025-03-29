
import { Request, Response } from "express";
import User from "../models/user.model.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const s3 = new AWS.S3();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with an optional profile picture upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               location:
 *                 type: string
 *                 description: JSON string of GeoJSON Point (e.g., '{"type": "Point", "coordinates": [-73.935242, 40.730610]}')
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Optional profile picture file
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, location: locationStringified } = req.body;

    const location = JSON.parse(locationStringified);
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePicture = '';

    // Subir imagen si fue enviada
    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${uuidv4()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };

      const data = await s3.upload(params).promise();
      profilePicture = data.Location;
    }

    // Create new user
    user = new User({ name, email, password: hashedPassword, phoneNumber, profilePicture, location });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { ...user, location: user.location.coordinates } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 userData:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'User not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    const { password: userPassword, __v, ...userData } = user.toObject();
    const infoUser = {
     id: user._id,
     name: user.name,
     email: user.email,
     phoneNumber: user.phoneNumber,
     location: user.location,
     profilePicture: user.profilePicture,
    }

    res.json({ token, userData: { ...userData, location: [], data: infoUser } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieves a user's details by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);  
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const infoUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      location: user.location,
      profilePicture: user.profilePicture,
     }
    const { password: userPassword, __v, ...userData } = user;

    res.status(200).json(infoUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Updates a user's details by their ID, with optional profile picture upload to AWS S3
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 description: User's email address
 *               phoneNumber:
 *                 type: string
 *                 description: User's phone number
 *               location:
 *                 type: string
 *                 description: JSON string of GeoJSON Point (e.g., '{"type": "Point", "coordinates": [-73.935242, 40.730610]}')
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Optional new profile picture file (uploaded to S3)
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('Body Update', req.body)
    const { location: locationStringified } = req.body;
    const location = JSON.parse(locationStringified);
    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${uuidv4()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };

      const data = await s3.upload(params).promise();
      req.body.profilePicture = data.Location;
    }
    delete req.body.password
    const updatedUser = await User.findByIdAndUpdate(id, {...req.body, location}, {
      new: true,
    });
    console.log('Paso aqui')
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { password: userPassword, __v, ...userData } = updatedUser;
    console.log('Aqui tambien')
    res.status(200).json({ ...userData });
    console.log('Paso aqui 2')
  } catch (error: any) {
    console.log('Paso aqui error')
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

