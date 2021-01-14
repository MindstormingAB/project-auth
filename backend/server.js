import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/authAPI";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5
  },
  password: {
    type: String,
    required: true,
    minlength: 5
  },
  accessToken: {
    type: String,
    default: () => crypto.randomBytes(128).toString("hex"),
    unique: true
  }
});

userSchema.pre("save", async function (next) {
  const user = tis;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

const authenticateUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ accessToken: req.header('Authorization') });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ loggedOut: true });
  }
};

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({ title: "Max & Sandrine's API", endpoints: listEndpoints(app) });
});

// Create user
app.post("/users", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await new User({ email, password }).save();
    res.status(200).json({ userId: user._id, accessToken: user.accessToken });
  } catch (err) {
    res.status(400).json({ message: "Could not create user", errors: err });
  };
});

// Login
app.post("/sessions", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    res.status(200).json({ userId: user._id, accessToken: user.accessToken });
  } else {
    res.status(404).json({ notFound: true });
  };
});

// Authenticated endpoint
app.get("/users/:userId/profile", authenticateUser);
app.get("/users/:userId/profile", async (req, res) => {
  const userId = req.params.userId;
  if (userId != req.user._id) {
    res.status(403).json({ error: 'Access Denied' });
  } else {
    res.status(200).json({ userId: req.user._id, email: req.user.email, accessToken: req.user.accessToken })
  };
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});
