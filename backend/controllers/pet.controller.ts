import { Request, Response } from "express";
import Pet from "../models/pet.model";
import User from "../models/user.model";

export const createPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, breed, status, images, description, owner, location } =
      req.body;

    // Validate that the owner (user) exists
    const user = await User.findById(owner);
    if (!user) {
      res.status(404).json({ error: "Owner (User) not found" });
      return;
    }

    const pet = new Pet({
      name,
      breed,
      status,
      images,
      description,
      owner,
      location,
    });
    await pet.save();
    res.status(201).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await Pet.findById(id).populate("owner");
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndUpdate(id, req.body, { new: true });
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json(pet);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const pet = await Pet.findByIdAndDelete(id);
    if (!pet) {
      res.status(404).json({ error: "Pet not found" });
      return;
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get pets near a given location.
 * Query parameters:
 *   - lat: latitude
 *   - lng: longitude
 *   - maxDistance: maximum distance in meters (optional, default is 5000m)
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
