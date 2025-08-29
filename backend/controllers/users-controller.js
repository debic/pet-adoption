const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getUsers = async (req, res, next) => {
  let users;

  try {
    //find everything but not the password
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching users failed", 500);
    return next(error);
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead.",
      422
    );
    return next(error);
  }

  let cryptPassword;
  try {
    cryptPassword = await bycrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("Couldnt create user, please try again", 500);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    imageURL: req.file.path,
    password: cryptPassword,
    animals: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("Signing up failed, please try again..", 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret_token_key_dont_share",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again..", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, toke: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin up failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bycrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError("Couldnt log in, please try again", 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid crredentials, please try again", 500);
    return next(error);
  }

   let token;
  try{
  token = jwt.sign(
    { userId: existingUser.id, email: existingUser.email },
    "secret_token_key_dont_share",
    { expiresIn: "1h" }
  );
  }catch(err){
    const error = new HttpError("Login in up failed, please try again..", 500);
    return next(error);
  }

  res.json({
    userId:existingUser.id,
    email:existingUser.email,
    token:token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
