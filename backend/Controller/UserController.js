import { UserModel } from '../Model/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
//user signup
export const signup = async (req, res) => {
    try {
        const { email, password, username, confirmPassword } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({ message: "password does not match" });
        }

        const existingUser = await UserModel.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 7);

        const newUser = new UserModel({
            username,
            email,
            password: hashPassword,
            role: "user"
        });

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "Signup successful",
            token,
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        res.status(500).json({ message: "Signup error", error });
        console.log(error);
    }
};



//user login
 export const login = async (req, res) => {
 try{
     const {email, password} = req.body;
       const user = await UserModel.findOne({email});
       if(!user){
        return  res.status(400).json({message:"user does not exist"})}

      const validpassword = await bcrypt.compare(password, user.password);
      if(!validpassword){
        return res.status(400).json({message:"invalid password"})
      }

      //generate token
      const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
 }
 catch(error){
    res.status(500).json({message: "login error", error});
}
 }
 // logic for get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();  // <-- sab users laa raha hai

    res.status(200).json({
      success: true,
      users: users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};