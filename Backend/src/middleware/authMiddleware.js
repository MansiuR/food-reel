import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import foodPartnerModel from "../models/foodPartnerModel.js";

async function authFoodPartnerMiddleware(req,res,next){

  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({
      message:"Login First!!!"
    })
  }

  try{

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const foodPartner = await foodPartnerModel.findById(decoded.id)

    req.foodPartner = foodPartner

    next();

  }catch (err){
    return res.status(401).json({
      message:"Invalid Token"
    })
  }
}

async function authUserMiddleware(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        req.user = user

        next()

    } catch (err) {

        return res.status(401).json({
            message: "Invalid token"
        })

    }

}

async function authUserOrPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Please login first"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Try to find as user first
        let user = await userModel.findById(decoded.id);
        
        if (user) {
            req.user = user;
            return next();
        }

        // If not a user, try to find as food partner
        let foodPartner = await foodPartnerModel.findById(decoded.id);
        
        if (foodPartner) {
            // Set user based on food partner for consistency
            req.user = {
                _id: foodPartner._id,
                email: foodPartner.email,
                name: foodPartner.name
            };
            req.foodPartner = foodPartner;
            return next();
        }

        return res.status(401).json({
            message: "User or partner not found"
        })

    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

export default {
  authFoodPartnerMiddleware,
  authUserMiddleware,
  authUserOrPartnerMiddleware
}