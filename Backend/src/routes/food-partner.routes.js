import express from 'express';
import foodPartnerController from '../controller/food-partner.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();


/* /api/food-partner/:id */
router.get("/:id",
    authMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById)


export default router