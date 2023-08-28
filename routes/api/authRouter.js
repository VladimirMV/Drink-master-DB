import express from "express";
import {
  signIn,
  signOut,
  signUp,
} from "../../controllers/authController/index.js";
import { userSchema } from "../../schemas/index.js";
import { validateBody } from "../../decorators/index.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

authRouter.post("/signup", validateBody(userSchema.userSignUpSchema), signUp);

authRouter.post("/signin", validateBody(userSchema.userSignInSchema), signIn);

authRouter.post("/signout", authenticate, signOut);

export default authRouter;