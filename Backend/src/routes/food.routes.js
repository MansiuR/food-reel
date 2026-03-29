import express from 'express';
import foodController from '../controller/food.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
})

const router = express.Router();

//POST:- api/food/ [protected]
router.post('/', 
  authMiddleware.authFoodPartnerMiddleware, 
  upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]), 
  foodController.createFood)

  /* GET /api/food/ [protected] */
router.get("/",
    authMiddleware.authUserOrPartnerMiddleware,
    foodController.getFoodItems)


router.post('/like',
    authMiddleware.authUserOrPartnerMiddleware,
    foodController.likeFood)


router.post('/save',
    authMiddleware.authUserOrPartnerMiddleware,
    foodController.saveFood
)


router.get('/get-saved-videos',
    authMiddleware.authUserOrPartnerMiddleware,
    foodController.getSavedFood
)

router.get('/isUserLikedVdo',
    authMiddleware.authUserOrPartnerMiddleware,
    foodController.isLiked
)

export default router