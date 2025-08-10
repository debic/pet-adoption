const fs = require('fs')
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const Animal = require("../models/animals");
const User = require('../models/user')
const mongoose = require('mongoose');


const getAnimalById = async (req, res, next) => {
  const animalId = req.params.aId;
  let animal;

  //This error is throw if there is something generaly wrong, like wrong format
  try {
    //findByid is a moongose method, doesnt return a promese. This can take a moment so we use async await
    animal = await Animal.findById(animalId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, couldnt find an animal",
      500
    );
    return next(error);
  }

  //This error is throw if the request was correct, but there wasnt find a animal with that id
  if (!animal) {
    const error = new HttpError(
      "couldnt find a animal for the provided id",
      404
    );
    return next(error);
  }

  //for returning it as a normal js object
  res.json({ animal: animal.toObject({ getters: true }) });
};



const getAllAnimals = async(req, res, next) =>{
  let animals;

  try{
      //find everything but not the password
      animals = await Animal.find({}, '-password');
  }catch(err){
      const error = new HttpError(
          'Fetching animals failed',
          500
      )
      return next(error)
  }
  res.json({animals: animals.map(animal => animal.toObject({getters:true}))})

}




const getPostedAnimalsByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  //let animal;
let userWithAnimals
  try {
    userWithAnimals = await User.findById(userId).populate('postedAnimals');
    
  } catch (err) {
    const error = new HttpError("fetching places faild", 500);
    return next(error);
  }
console.log(userWithAnimals.animals)
  if (!userWithAnimals) {
    return next(
      new HttpError("couldn find a animals for the provided user id", 404)
    );
  }

  res.json({
    animals: userWithAnimals.postedAnimals.map((animal) => animal.toObject({ getters: true })),
  });
};


const getFosteredAnimalsByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  //let animal;
let userWithAnimals
  try {
    userWithAnimals = await User.findById(userId).populate('fosteredAnimals');
    
  } catch (err) {
    const error = new HttpError("fetching places faild", 500);
    return next(error);
  }
console.log(userWithAnimals.animals)
  if (!userWithAnimals) {
    return next(
      new HttpError("couldn find a animals for the provided user id", 404)
    );
  }

  res.json({
    animals: userWithAnimals.fosteredAnimals.map((animal) => animal.toObject({ getters: true })),
  });
};

const getAdoptedAnimalsByUserId = async (req, res, next) => {
  const userId = req.params.uId;

  //let animal;
let userWithAnimals
  try {
    userWithAnimals = await User.findById(userId).populate('adoptedAnimals');
    
  } catch (err) {
    const error = new HttpError("fetching places faild", 500);
    return next(error);
  }
console.log(userWithAnimals.animals)
  if (!userWithAnimals ) {
    return next(
      new HttpError("couldn find a animals for the provided user id", 404)
    );
  }

  res.json({
    animals: userWithAnimals.adoptedAnimals.map((animal) => animal.toObject({ getters: true })),
  });
};




const addAnimal = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, info, type, creator, gender, age, weight, currentlyStyaingWith,status,} = req.body;

  //This structure is predifined by the scheema, if it doesnt have the same structure it will throw an error
  const newAnimal = new Animal({
    name,
    info,
    imageURL:req.file.path,
    type,
    age,
    weight,
    gender,
    creator,
    currentlyStyaingWith,
    status,
  });
  console.log(newAnimal)

//here we see if there is an user with the existing ID
let user;
try {
  user = await User.findById(creator);
} catch (err) {
  const error = new HttpError('Could not find user for the provided id', 500);
  return next(error);
}

if (!user) {
  const error = new HttpError('Could not find user for provided id', 404);
  return next(error);
}

try {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await newAnimal.save({ session: sess });
  user.postedAnimals.push(newAnimal);
  await user.save({ session: sess });
  await sess.commitTransaction();
} catch (err) {
  const error = new HttpError(
    'Creating animal failed, please try again.',
    500
  );
  return next(error);
}
console.log(newAnimal)
res.status(201).json({ animal: newAnimal });
};







const updateAnimalById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next (
      new HttpError("Invalid inputs, please check your data", 422)
    );
  }
  const { name, info, type, imageURL, currentlyStyaingWith, status, userId } = req.body;
  const animalId = req.params.aid;
  let animal;

  try {
    animal = await Animal.findById(animalId);
  } catch (err) {
    const error = new HttpError(
      "Soemthing went wrong, could not update place",
      500
    );
    return next(error);
  }

  //Here we change the data
  animal.name = name;
  animal.info = info;
  animal.type = type;
  animal.currentlyStyaingWith = currentlyStyaingWith;
  animal.status = status;


  //here the data animal is been update
  try {
    await animal.save();
  } catch (err) {
    const errpr = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  //here we see if there is an user with the existing ID
let user;
try {
  user = await User.findById(userId);
} catch (err) {
  const error = new HttpError('Could not find user for the provided id', 500);
  return next(error);
}

if (!user) {
  const error = new HttpError('Could not find user for provided id', 404);
  return next(error);
}
 console.log(animal)

try {
  const sess = await mongoose.startSession();
  sess.startTransaction();
  await animal.save({ session: sess });

  if (status === "adopt") {
    user.adoptedAnimals.push(animal._id);
  } else if (status === "foster") {
    user.fosteredAnimals.push(animal._id);
  }  await user.save({ session: sess });
  await sess.commitTransaction();
} catch (err) {
  const error = new HttpError(
    'Creating animal failed, please try again.',
    500
  );
  return next(error);
}


  res.status(200).json({ animal: animal.toObject({ getters: true }) });
};





// const deleteAnimalById = async (req, res, next) => {
//   const animalId = req.params.aid;

//   let animal;
// try {
//     animal = await Animal.findById(animalId).populate('creator');
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete animal.',
//       500
//     );
//     return next(error);
//   }

//  if (!animal) {
//     const error = new HttpError('Could not find animal for this id.', 404);
//     return next(error);
//   }

//  const imagePath = animal.image

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await animal.remove({session: sess});
//     animal.creator.animals.pull(animal);
//     await animal.creator.save({session:sess})
//     await sess.commitTransaction();
//   } catch (err) {
//     const error = new HttpError(
//       'Something went wrong, could not delete animal.',
//       500
//     );
    
//     return next(error);
//   }

//   fs.unlink(imagePath, err =>{
//     console.log(err, "hola")
//   })

//   res.status(200).json({ message: 'Deleted animal.' });
// };


const deleteAnimalById = async (req, res, next) => {
  const animalId = req.params.aid;

  let animal;
  try {
    animal = await Animal.findById(animalId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete animal.',
      500
    );
    return next(error);
  }

  if (!animal) {
    const error = new HttpError('Could not find animal for this id.', 404);
    return next(error);
  }

  const imagePath = animal.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await animal.remove({ session: sess });
    animal.creator.animals.pull(animal);
    await animal.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete animal.',
      500
    );
    return next(error);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).json({ message: 'Deleted place.' });
};



exports.getAnimalById = getAnimalById;
exports.getAllAnimals = getAllAnimals;
exports.getPostedAnimalsByUserId = getPostedAnimalsByUserId;
exports.getAdoptedAnimalsByUserId = getAdoptedAnimalsByUserId;
exports.getFosteredAnimalsByUserId = getFosteredAnimalsByUserId;

exports.addAnimal = addAnimal;
exports.updateAnimalById = updateAnimalById;
exports.deleteAnimalById = deleteAnimalById;
