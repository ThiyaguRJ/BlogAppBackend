import Auth from "../../Model/auth/auth.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await Auth.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Auth.create({
      username,
      email,
      password: hashedPassword,
      role: "reader", 
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        role: user.role,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const Logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    secure: false, 
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "Logout successful",
    success: true,
  });
};

export const CheckAuth = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ success: true });
};



