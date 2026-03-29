import userModle from "../models/userModel.js";
import foodPartnerModle from "../models/foodPartnerModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


async function registerUser(req, res) {

  const { fullName, email, password } = req.body;

  const isUserAlreadyExists = await userModle.findOne({ email });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModle.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({
    id: user._id,
  }, process.env.JWT_SECRET);

  res.cookie("token", token)

  return res.status(201).json({ 
    message: "User registered successfully",
    user:{
      id: user._id,
      email: user.email,
      fullName: user.fullName
    }
   });
}

async function LoginUser(req, res) {

  const { email, password } = req.body;

  const user = await userModle.findOne({ email });

  if (!user) {
    return res.status(400).json({
       message: "Invalid Password or Email" 
      });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({
       message: "Invalid Password or Email" 
      });
  }

  const token = jwt.sign({
    id: user._id,
  }, process.env.JWT_SECRET);

  res.cookie("token", token)

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName
    }
  });
}

 function logoutUser(req, res) {

  res.clearCookie("token");
  return res.status(200).json({
     message: "User logged out successfully"
     });
}


async function registerFoodPartner(req, res) {

  const { name, email, password,phone, address, contactName } = req.body;

  const isAccountAlreadyExists = await foodPartnerModle.findOne({ email });

  if (isAccountAlreadyExists) {
    return res.status(400).json({
       message: "Account already exists" 
      });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const foodPartner = await foodPartnerModle.create({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    contactName
  });

  const token = jwt.sign({
    id: foodPartner._id,
  }, process.env.JWT_SECRET);

  res.cookie("token", token)

  return res.status(201).json({ 
    message: "Food Partner registered successfully",
    foodPartner:{
      id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name,
      contactName:foodPartner.contactName,
      phone:foodPartner.phone,
      address:foodPartner.address
    }
   });
}

async function LoginFoodPartner(req, res) {

  const { email, password } = req.body;

  const foodPartner = await foodPartnerModle.findOne({ email });

  if (!foodPartner) {
    return res.status(400).json({
       message: "Invalid Password or Email" 
      });
  }

  const isPasswordValid = await bcrypt.compare(password, foodPartner.password);

  if (!isPasswordValid) {
    return res.status(400).json({
       message: "Invalid Password or Email" 
      });
  }

  const token = jwt.sign({
    id: foodPartner._id,
  }, process.env.JWT_SECRET);

  res.cookie("token", token)

  res.status(200).json({
    message: "Food Partner logged in successfully",
    foodPartner: {
      id: foodPartner._id,
      email: foodPartner.email,
      name: foodPartner.name
    }
  });
}

function logoutFoodPartner(req, res) {

  res.clearCookie("token");
  return res.status(200).json({
     message: "Food Partner logged out successfully"
     });
}

export default {
  registerUser,
  LoginUser,
  logoutUser,
  registerFoodPartner,
  LoginFoodPartner,
  logoutFoodPartner
}