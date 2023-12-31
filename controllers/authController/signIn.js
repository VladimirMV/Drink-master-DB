import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import { HttpError, ctrlWrapper } from "../../helpers/index.js";
import User from "../../models/user.js";

const { JWT_SECRET } = process.env;

const signIn = async ({ body }, res) => {
  const { email, password } = body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  user.tokenCount += 1;
  await user.save();

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
      subscription: user.subscription,
      avatarURL: user.avatarURL,
      _id: user._id,
      tokenCount: user.tokenCount,
    },
  });
};

export default ctrlWrapper(signIn);
