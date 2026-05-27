const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;


const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  imageURL: { type: String, required: true },
  postedAnimals: [{ type: mongoose.Types.ObjectId, ref: 'Animal', default: [] }],
  fosteredAnimals: [{ type: mongoose.Types.ObjectId, ref: 'Animal', default: [] }],
  adoptedAnimals: [{ type: mongoose.Types.ObjectId, ref: 'Animal', default: [] }]
});


userSchema.plugin(uniqueValidator);
//ref helps to connects diferent scheemas

module.exports = mongoose.model('User', userSchema);


