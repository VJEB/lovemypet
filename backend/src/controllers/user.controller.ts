import { Request, Response } from "express";
import User from "../models/user.model.js";

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phoneNumber, profilePicture } = req.body;
    console.log('Paso aqui')
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).json({ message: 'User already exists' });
        return 
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({ name, email, password: hashedPassword, phoneNumber, profilePicture });
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { ...user, location: [] } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user){
        res.status(400).json({ message: 'User not found.' });
        return 
    } 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401).json({ message: 'Invalid credentials.' });
        return 
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

    const { password: userPassword, __v, ...userData } = user;
    const infoUser = {
     id: user._id,
     name: user.name,
     email: user.email,
     phoneNumber: user.phoneNumber,
    }

    res.json({ token, userData: { ...userData, location: [], data: infoUser} });
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
    const { password: userPassword, __v, ...userData } = user;

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
    const { password: userPassword, __v, ...userData } = updatedUser;

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
