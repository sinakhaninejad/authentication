const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const RTdb = require("../models/RefreshToken");

// Register a new user
const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res.status(400).json({ message: "email already in use" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.json({ message: "Registration successful" });
  } catch (error) {
    next(error);
  }
};

// Login with an existing user
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    //creating access token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15min",
    });
    //creating refreshtoken
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_SECRET_KEY
    );

    //save refresh token in db for compare
    const rTdb = new RTdb({ refreshtoken: refreshToken });
    await rTdb.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
    });

    //sending back access token
    res.json({ token: token });
  } catch (error) {
    next(error);
  }
};

const refreshthetoken = async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];

  if (refreshToken == null) return res.sendStatus(401);
  if (!(await RTdb.findOne({ refreshtoken: refreshToken })))
    return res.status(403).json({ message: "access not allowed!" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m", // Set an appropriate expiration time
      }
    );

    res.json({ accessToken: newAccessToken });
  });
};

const logOut = async (req, res, next) => {
  const refreshToken = req.cookies["refreshToken"];
  try {
    await RTdb.deleteOne({ refreshtoken: refreshToken });
    res.status(203).json("loged out!");
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refreshthetoken, logOut };
