import { Router } from 'express';
import * as petController from '../controllers/pet.controller';

const router = Router();

router.post('/', petController.createPet);
router.get('/:id', petController.getPet);
router.put('/:id', petController.updatePet);
router.delete('/:id', petController.deletePet);
router.get('/', petController.getPetsNearby); // For fetching pets nearby

export default router;