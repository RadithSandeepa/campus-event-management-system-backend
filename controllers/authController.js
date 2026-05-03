import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { bucket } from "../config/firebase.js";

// REGISTER (optional - mostly admin will create users)
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "STUDENT",
    });

    res.json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err)
  }
};

//GET PROFILE
export const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
  
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

//CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.id);
  
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match)
        return res.status(400).json({ message: "Old password incorrect" });
  
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

//UPLOAD PROFILE PIC
export const uploadProfilePic = async (req, res) => {
    try {
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
  
      const fileName = `profiles/${Date.now()}_${file.originalname}`;
  
      const fileUpload = bucket.file(fileName);
  
      const stream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });
  
      stream.on("error", (err) => {
        res.status(500).json({ message: err.message });
      });
  
      stream.on("finish", async () => {
        await fileUpload.makePublic();
  
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
  
        const user = await User.findById(req.user.id);
        user.profilePic = publicUrl;
        await user.save();
  
        res.json({
          message: "Uploaded successfully",
          url: publicUrl,
        });
      });
  
      stream.end(file.buffer);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};