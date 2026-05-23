import { UserModel } from '../Model/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//user signup
export const signup = async (req, res) => {
  try {
    const { email, password, username, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "password does not match" });
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
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
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" })
    }

    const validpassword = await bcrypt.compare(password, user.password);
    if (!validpassword) {
      return res.status(400).json({ message: "invalid password" })
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
  catch (error) {
    res.status(500).json({ message: "login error", error });
  }
}
// logic for get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();

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




// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error
    });
  }
};

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { username, phone, gender, dob } = req.body;
    let profileImage = req.body.profileImage;
    if (req.file) {
      profileImage = req.file.filename;
    }
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dob) user.dob = dob;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};


// Add Address
export const addAddress = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error adding address", error });
  }
};

// Update Address
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Merge existing address with new data
    user.addresses[addressIndex] = { ...user.addresses[addressIndex].toObject(), ...req.body };
    await user.save();

    res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error updating address", error });
  }
};

// Delete Address
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: "Error deleting address", error });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    // return populated wishlist for immediate update
    const updatedUser = await UserModel.findById(req.user.id).populate("wishlist");
    res.status(200).json({ message: "Added to wishlist", wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishlist", error });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await UserModel.findById(req.user.id).populate("wishlist");
    res.status(200).json({ message: "Removed from wishlist", wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error removing from wishlist", error });
  }
};

// Get wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching wishlist", error });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};
// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP - HairCare",
      text: `Your password reset OTP is: ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserModel.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};
