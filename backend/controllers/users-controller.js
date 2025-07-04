const {validationResult} = require('express-validator')
const HttpError = require('../models/http-error')
const User = require('../models/user')


const getUsers = async(req, res, next) =>{
    let users;

    try{
        //find everything but not the password
        users = await User.find({}, '-password');
    }catch(err){
        const error = new HttpError(
            'Fetching users failed',
            500
        )
        return next(error)
    }

    res.json({users: users.map(user => user.toObject({getters:true}))})
}





const signup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const { name, email, password, imageURL } = req.body;
  
    let existingUser
    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Signing up failed, please try again later.',
        500
      );
      return next(error);
    }
    
    if (existingUser) {
      const error = new HttpError(
        'User exists already, please login instead.',
        422
      );
      return next(error);
    }
    
    const createdUser = new User({
      name,
      email,
      imageURL: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
      password,
      animals:[]
    });
  
    try {
      await createdUser.save();
    } catch (err) {
        console.log(err)
      const error = new HttpError(
        'Signing up failed, please try again..',
        500
      );
      return next(error);
    }
  
    res.status(201).json({user: createdUser.toObject({ getters: true })});
  };






const login = async (req, res, next) =>{
    const {email, password} = req.body;

    let existingUser

    try {
      existingUser = await User.findOne({ email: email })
    } catch (err) {
      const error = new HttpError(
        'Loggin up failed, please try again later.',
        500
      );
      return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials',
            401
        );
        return next(error);
    }

    res.json({message: 'Logged in!', user:existingUser.toObject({getters: true}) })
}




exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
