
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

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phoneNumber } = req.body;

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
    user = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      profilePicture,
    });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { ...user.toObject(), location: [] } });
  } catch (error: any) {
    console.error("Error en registerUser:", error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

// export const loginUser = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       res.status(400).json({ message: 'User not found.' });
//       return;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       res.status(401).json({ message: 'Invalid credentials.' });
//       return;
//     }

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

//     const { password: userPassword, __v, ...userData } = user.toObject();
//     const infoUser = {
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       phoneNumber: user.phoneNumber,
//       profilePicture: user.profilePicture,
//     };

//     res.json({ token, userData: { ...userData, location: [], data: infoUser } });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
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
      profilePicture: user.profilePicture, 
    };

    res.json({ token, userData: { ...userData, location: [], data: infoUser } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { password: userPassword, __v, ...userData } = user.toObject();

    res.status(200).json({ ...userData, location: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    const { password: userPassword, __v, ...userData } = updatedUser.toObject();

    res.status(200).json({ ...userData, location: [] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
