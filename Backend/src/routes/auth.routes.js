import express from 'express';
import authController from '../controller/auth.controller.js';

const router = express.Router();

//User Auth API's
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.LoginUser);
router.get('/user/logout', authController.logoutUser);

//Food Partner Auth API's
router.post('/food-partner/register', authController.registerFoodPartner);
router.post('/food-partner/login', authController.LoginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);

export default router