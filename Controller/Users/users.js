import User from "../../Model/auth/auth.js";
import nodemailer from 'nodemailer';
import bcrypt from "bcrypt";

export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    return res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const UpdateUserRole = async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "User ID and role are required" });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    return res.status(200).json({
      message: "User role updated successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const DeleteUserRole = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    await User.findByIdAndDelete(userId);
    return res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


export const SendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP to reset your password is ${otp}`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("SendResetOtp error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetOtpExpiry && user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("ResetPassword error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
