
import { Request, Response } from "express";
import Pet from "../models/pet.model.js";
import User from "../models/user.model.js";
import AWS from 'aws-sdk';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const s3 = new AWS.S3();
const storage = multer.memoryStorage();
export const upload = multer({ storage });

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Create a new pet
 *     description: Creates a new pet entry with an optional image upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Pet's name
 *               breed:
 *                 type: string
 *                 description: Pet's breed
 *               status:
 *                 type: string
 *                 description: Pet's status (e.g., available, adopted)
 *               category:
 *                 type: string
 *                 description: Pet's category (e.g., dog, cat)
 *               description:
 *                 type: string
 *                 description: Pet's description
 *               owner:
 *                 type: string
 *                 description: ID of the pet's owner
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the pet
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Owner not found
 *       500:
 *         description: Server error
 */
export const createPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, breed, status, category, description, owner } = req.body;
    let imageUrl = '';

    const user = await User.findById(new mongoose.Types.ObjectId(owner));
    if (!user) {
      res.status(404).json({ error: "Owner (User) not found" });
      return;
    }

    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${uuidv4()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };
      const data = await s3.upload(params).promise();
      imageUrl = data.Location;
    }

    const pet = new Pet({
      name,
      breed,
      status,
      description,
      category,
      owner,
      images: imageUrl ? [imageUrl] : [] // Guarda como arreglo si existe
    });
    await pet.save();
    res.status(201).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     description: Retrieves a pet's details by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet's ID
 *     responses:
 *       200:
 *         description: Pet found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pet not found
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
export const getPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id);
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/owner:
 *   post:
 *     summary: Get pets by owner
 *     description: Retrieves all pets owned by a specific user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The owner's ID
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: List of pets owned by the user (empty array if none found)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
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
export const getPetByOwner = async (req: Request, res: Response): Promise<void> => {
  try {
    const pets = await Pet.find({ owner: req.body.id });
    // if (!pets || pets.length === 0) {
    //   res.status(404).json({ error: "No pets found" });
    //   return;
    // }
    res.status(200).json(pets || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/category:
 *   post:
 *     summary: Get pets by category and status
 *     description: Retrieves all pets of a specific category and status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: The pet category (e.g., dog, cat)
 *               status:
 *                 type: string
 *                 description: The pet status (e.g., available, adopted)
 *             required:
 *               - category
 *               - status
 *     responses:
 *       200:
 *         description: List of pets matching the category and status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       404:
 *         description: No pets found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No pets found
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
export const getPetByCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const pets = await Pet.find({ category: req.body.category, status: req.body.status });
    if (!pets || pets.length === 0) {
      res.status(404).json({ error: "No pets found" });
      return;
    }
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     description: Retrieves a list of all pets
 *     responses:
 *       200:
 *         description: List of all pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       404:
 *         description: No pets found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No pets found
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
export const getAllPets = async (req: Request, res: Response): Promise<void> => {
  try {
    const pets = await Pet.find();
    if (!pets || pets.length === 0) {
      res.status(404).json({ error: "No pets found" });
      return;
    }
    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     description: Updates a pet's details by its ID, with optional image upload to AWS S3
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet's ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Pet's name
 *               breed:
 *                 type: string
 *                 description: Pet's breed
 *               status:
 *                 type: string
 *                 description: Pet's status
 *               category:
 *                 type: string
 *                 description: Pet's category
 *               description:
 *                 type: string
 *                 description: Pet's description
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Optional new image file for the pet (uploaded to S3)
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pet not found
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
export const updatePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (req.file) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: `${uuidv4()}-${req.file.originalname}`,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: 'public-read',
      };
      const data = await s3.upload(params).promise();
      req.body.images = [data.Location];
    }
    const updatedPet = await Pet.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json(updatedPet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     description: Deletes a pet by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet's ID
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pet deleted successfully
 *       404:
 *         description: Pet not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pet not found
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
export const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedPet = await Pet.findByIdAndDelete(id);
    if (!deletedPet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /pets/nearby:
 *   get:
 *     summary: Get pets near a location
 *     description: Retrieves pets within a specified distance from a given latitude and longitude
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude of the location
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude of the location
 *       - in: query
 *         name: maxDistance
 *         required: false
 *         schema:
 *           type: number
 *         description: Maximum distance in meters (default: 5000)
 *     responses:
 *       200:
 *         description: List of nearby pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Missing lat or lng parameters
 *       500:
 *         description: Server error
 */
export const getPetsNearby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { lat, lng, maxDistance } = req.query;
    if (!lat || !lng) {
      res
        .status(400)
        .json({ error: "lat and lng query parameters are required" });
      return;
    }
    const maxDist = maxDistance ? parseInt(maxDistance as string, 10) : 5000; // default 5km

    const pets = await Pet.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: maxDist,
        },
      },
    }).populate("owner");

    res.status(200).json(pets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};