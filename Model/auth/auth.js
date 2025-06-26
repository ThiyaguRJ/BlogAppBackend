import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetOtp: {
    type: String,
  },
  resetOtpExpiry: {
    type: Date,
  },
},
{
  timestamps: true,
}
);

const Auth = mongoose.models.Auth || mongoose.model("Auth", authSchema);
export default Auth;

