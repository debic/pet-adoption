const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const animalSchema = new Schema({
    name: {type: String, required: true},
    gender: {type: String, required: true},
    type: {type: String, required: true},
    info: {type: String, required: true},
    age: {type: String, required: true},
    weight: {type: String, required: true},
    imageURL: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},

})

//ref helps to connects diferent scheemas
module.exports = mongoose.model('Animal', animalSchema);