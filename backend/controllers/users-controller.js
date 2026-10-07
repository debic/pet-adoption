const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_KEY, isAdminEmail } = require("../util/auth-config");
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
      JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again..", 500);
    return next(error);
  }

  res
    .status(201)
    .json({
      userId: createdUser.id,
      email: createdUser.email,
      token: token,
      isAdmin: isAdminEmail(createdUser.email),
    });
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
    JWT_KEY,
    { expiresIn: "1h" }
  );
  }catch(err){
    const error = new HttpError("Login in up failed, please try again..", 500);
    return next(error);
  }

  res.json({
    userId:existingUser.id,
    email:existingUser.email,
    token:token,
    isAdmin: isAdminEmail(existingUser.email)
  });
};

// Admin only: every user with the animals they posted, fostered and adopted
const getAdminOverview = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password").populate(
      "postedAnimals fosteredAnimals adoptedAnimals",
      "name type gender status imageURL"
    );
  } catch (err) {
    const error = new HttpError("Fetching users failed, please try again.", 500);
    return next(error);
  }

  const toAnimal = (animal) => ({
    id: animal.id,
    name: animal.name,
    type: animal.type,
    gender: animal.gender,
    status: animal.status || "available",
    imageURL: animal.imageURL,
  });

  res.json({
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      imageURL: user.imageURL,
      isAdmin: isAdminEmail(user.email),
      posted: user.postedAnimals.map(toAnimal),
      fostered: user.fosteredAnimals.map(toAnimal),
      adopted: user.adoptedAnimals.map(toAnimal),
    })),
  });
};

// Public info of a single user (no email, no password)
const getUserById = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.uid, "name imageURL");
  } catch (err) {
    return next(new HttpError("Fetching user failed, please try again.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find a user for the provided id.", 404));
  }

  res.json({ user: { id: user.id, name: user.name, imageURL: user.imageURL } });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getAdminOverview = getAdminOverview;
exports.signup = signup;
exports.login = login;
