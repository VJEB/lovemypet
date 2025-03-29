import { Router } from 'express';
import * as petController from '../controllers/pet.controller.js';

const router = Router();
router.get('/pets', petController.getAllPets);

router.post('/', petController.upload.single('image'), petController.createPet);
router.get('/:id', petController.getPet);
router.put('/:id', petController.upload.single('image'), petController.updatePet);
router.delete('/:id', petController.deletePet);
router.post('/byOwner', petController.getPetByOwner);
router.post('/byCategory', petController.getPetByCategory);
router.get('/', petController.getPetsNearby); // For fe

export default router;