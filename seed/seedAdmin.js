import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedAdmin = async () => {
  const admin = await User.findOne({ role: "ADMIN" });

  if (!admin) {
    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "System Admin",
      email: "admin@campus.com",
      password: hashed,
      role: "ADMIN",
    });

    console.log("Admin seeded");
  }
};