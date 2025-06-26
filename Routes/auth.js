import express from 'express';
import { CheckAuth, Login, Logout, Register } from '../Controller/authController/authController.js';
import { DeleteUserRole, GetAllUsers, ResetPassword, SendResetOtp, UpdateUserRole } from '../Controller/Users/users.js';

const AuthRouter = express.Router();

AuthRouter.post("/register", Register)
AuthRouter.post("/login", Login)
AuthRouter.post("/logout", Logout)
AuthRouter.get("/check-auth", CheckAuth)

AuthRouter.get("/getallusers", GetAllUsers);
AuthRouter.put("/updateroleuser/:id", UpdateUserRole);
AuthRouter.delete("/deleteuser/:id", DeleteUserRole);

AuthRouter.post("/sendotp", SendResetOtp);
AuthRouter.post("/resetpassword", ResetPassword);
export default AuthRouter;