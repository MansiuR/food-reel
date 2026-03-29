import foodModel from "../models/fooditemModel.js"; 
import storageService from "../services/storage.service.js";
import likeModel from "../models/likeModel.js";
import saveModel from "../models/saveModel.js";
import {v4 as uuid} from "uuid";

async function createFood(req,res){
  try {
    const videoFile = req.files && req.files.video ? req.files.video[0] : null;
    const thumbnailFile = req.files && req.files.thumbnail ? req.files.thumbnail[0] : null;

    if (!videoFile) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const fileUploadResult = await storageService.uploadFile(videoFile.buffer, uuid());

    let thumbnailUrl = null;
    if(thumbnailFile){
      const thumbUploadResult = await storageService.uploadFile(thumbnailFile.buffer, uuid());
      thumbnailUrl = thumbUploadResult.url;
    }

    const foodItem = await foodModel.create({
      name:req.body.name,
      description:req.body.description,
      video:fileUploadResult.url,
      thumbnail:thumbnailUrl,
      foodPartner:req.foodPartner._id
    })
    
    res.status(201).json({
      message:"Food Created Successfully!!",
      food:foodItem
    })
  } catch (error) {
    console.error("Error creating food:", error);
    res.status(500).json({ message: "Failed to create food item" });
  }
}

async function getFoodItems(req, res) {
    try {
        // 1. Use .lean() to convert MongoDB documents into standard Javascript objects
        // This allows us to easily add 'isLiked' and 'isSaved' to them.
        const foodItems = await foodModel.find({}).lean();

        let likedFoodIds = [];
        let savedFoodIds = [];

        // 2. Check if a user is logged in (assuming your middleware sets req.user)
        if (req.user) {
            // Find all likes made by this specific user
            const userLikes = await likeModel.find({ user: req.user._id });
            // Map them to an array of just the food IDs (as strings for easy comparison)
            likedFoodIds = userLikes.map(like => like.food.toString());

            // Find all saves made by this specific user
            const userSaves = await saveModel.find({ user: req.user._id });
            savedFoodIds = userSaves.map(save => save.food.toString());
        }

        // 3. Loop through the videos and check if their ID is in the user's liked/saved lists
        const updatedFoodItems = foodItems.map(item => ({
            ...item,
            // If the item's ID is in the likedFoodIds array, set to true, else false
            isLiked: likedFoodIds.includes(item._id.toString()),
            // If the item's ID is in the savedFoodIds array, set to true, else false
            isSaved: savedFoodIds.includes(item._id.toString())
        }));

        // 4. Send the newly updated items to the React frontend
        res.status(200).json({
            message: "Food items fetched successfully",
            foodItems: updatedFoodItems
        });

    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: "Failed to fetch food items" });
    }
}


async function likeFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { likeCount: -1 }
            })

            return res.status(200).json({
                message: "Food unliked successfully",
                like: false
            })
        }

        const like = await likeModel.create({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: 1 }
        })

        res.status(201).json({
            message: "Food liked successfully",
            like: true
        })
    } catch (error) {
        console.error("Error in likeFood:", error);
        res.status(500).json({ message: "Failed to like food", error: error.message });
    }
}

async function isLiked(req, res) {
    try {
        const user = req.user;
        const vdoId = req.body.vdoId;

        if (!vdoId) {
            return res.status(400).json({ message: "vdoId is required" });
        }

        const liked = await likeModel.exists({ user: user._id, food: vdoId });

        if (liked != null) {
            res.status(200).json({
                isLiked: true
            });
        } else {
            res.status(200).json({
                isLiked: false
            });
        }
    } catch (error) {
        console.error("Error in isLiked:", error);
        res.status(500).json({ message: "Failed to check if liked", error: error.message });
    }
}

async function saveFood(req, res) {
    try {
        const { foodId } = req.body;
        const user = req.user;

        if (!foodId) {
            return res.status(400).json({ message: "foodId is required" });
        }

        const isAlreadySaved = await saveModel.findOne({
            user: user._id,
            food: foodId
        })

        if (isAlreadySaved) {
            await saveModel.deleteOne({
                user: user._id,
                food: foodId
            })

            await foodModel.findByIdAndUpdate(foodId, {
                $inc: { savesCount: -1 }
            })

            return res.status(200).json({
                message: "Food unsaved successfully",
                save: false
            })
        }

        const save = await saveModel.create({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { savesCount: 1 }
        })

        res.status(201).json({
            message: "Food saved successfully",
            save: true
        })
    } catch (error) {
        console.error("Error in saveFood:", error);
        res.status(500).json({ message: "Failed to save food", error: error.message });
    }
}

async function getSavedFood(req, res) {
    try {
        const user = req.user;

        const savedFoods = await saveModel.find({ user: user._id }).populate('food');

        if (!savedFoods || savedFoods.length === 0) {
            return res.status(200).json({ 
                message: "No saved foods found",
                savedFoods: []
            });
        }

        res.status(200).json({
            message: "Saved foods retrieved successfully",
            savedFoods
        });
    } catch (error) {
        console.error("Error in getSavedFood:", error);
        res.status(500).json({ message: "Failed to get saved foods", error: error.message });
    }
}


export default {
  createFood,
  getFoodItems,
  likeFood,
  saveFood,
  getSavedFood,
  isLiked
}