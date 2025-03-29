import { Router } from 'express';
import * as petController from '../controllers/pet.controller.js';

const router = Router();

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Retrieve all pets
 *     description: Fetches a list of all pets in the system.
 *     responses:
 *       200:
 *         description: A list of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Server error
 */
router.get('/pets', petController.getAllPets);

/**
 * @swagger
 * /pets/:
 *   post:
 *     summary: Create a new pet
 *     description: Registers a new pet with an optional image upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               status:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               owner:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - name
 *               - owner
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', petController.upload.single('image'), petController.createPet);

/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     description: Retrieves a pet by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet ID
 *     responses:
 *       200:
 *         description: Pet details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.get('/:id', petController.getPet);

/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update a pet
 *     description: Updates an existing pet by ID, with an optional image upload.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               breed:
 *                 type: string
 *               status:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               owner:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.put('/:id', petController.upload.single('image'), petController.updatePet);

/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     description: Deletes a pet by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The pet ID
 *     responses:
 *       204:
 *         description: Pet deleted successfully
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', petController.deletePet);

/**
 * @swagger
 * /pets/byOwner:
 *   post:
 *     summary: Get pets by owner
 *     description: Retrieves all pets belonging to a specific owner.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               owner:
 *                 type: string
 *             required:
 *               - owner
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid owner ID
 *       500:
 *         description: Server error
 */
router.post('/byOwner', petController.getPetByOwner);

/**
 * @swagger
 * /pets/byCategory:
 *   post:
 *     summary: Get pets by category
 *     description: Retrieves all pets in a specific category.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *             required:
 *               - category
 *     responses:
 *       200:
 *         description: List of pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid category
 *       500:
 *         description: Server error
 */
router.post('/byCategory', petController.getPetByCategory);

/**
 * @swagger
 * /pets/:
 *   get:
 *     summary: Get nearby pets
 *     description: Retrieves pets near the user's location (for frontend use).
 *     responses:
 *       200:
 *         description: List of nearby pets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Server error
 */
router.get('/', petController.getPetsNearby);

export default router;