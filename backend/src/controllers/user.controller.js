import { comparePassword, hashPassword } from "../helpers/user.helper.js";
import { MessageModel } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function getUserDataFromRequest(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    } else {
      reject("no token");
    }
  });
}

const checkApi = (req, res) => {
  res.json("test ok");
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name) {
      return res.status(201).send({
        status: 404,
        message: "name is required",
      });
    }
    if (!password || password.length < 6) {
      return res.status(201).send({
        status: 404,
        message: "password is required and must be at least 6 characters",
      });
    }
    const existedUser = await User.findOne({
      email,
    });
    if (existedUser) {
      return res.send({
        status: 404,
        message: "email already exists",
      });
    }

    const hashedPassword = await hashPassword(password);
    const createNewUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    jwt.sign(
      { userId: createNewUser._id, name },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .status(201)
          .json({
            id: createNewUser._id,
            message: "Register Successfully",
          });
      }
    );
  } catch (error) {
    console.log("User registration failed", error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(201).send({
        status: 404,
        message: "User not found",
      });
    }
    const checkPassword = await comparePassword(password, user.password);
    if (checkPassword) {
      jwt.sign(
        { userId: user._id, name },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .status(201)
            .json({
              id: user._id,
              message: "Login Successfully",
            });
        }
      );
    }
  } catch (error) {
    console.log("Login error", error);
  }
};

const getProfile = (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(201).send({
      status: 401,
      message: "Please login to access this page",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) {
      console.log("Token verification error", err);
      return res.status(403).json({
        status: 403,
        message: "Invalid token",
      });
    }
    res.json(user);
  });
};

const messageOfUser = async (req, res) => {
  const { userId } = req.params;
  const userData = await getUserDataFromRequest(req);
  const ourUserId = userData.userId;
  const messages = await MessageModel.find({
    sender: { 
        $in: [userId, ourUserId] 
    },
    recipient: { 
        $in: [userId, ourUserId] 
    },
  }).sort({ createdAt: 1 });
  res.json(messages);
};

const allUsers = async (req, res) =>{
    const users = await User.find({}, {'_id': 1, name: 1});
    res.json(users);
}

const logoutUser = (req, res) =>{
  res.cookie("token", '', { sameSite: "none", secure: true }).json('ok');
}

export { checkApi, registerUser, getProfile, loginUser, messageOfUser, allUsers, logoutUser };
