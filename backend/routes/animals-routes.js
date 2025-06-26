const express = require('express');
const router = express.Router();
const animalsControllers = require('../controllers/animal-controller')
const {check} = require("express-validator")

router.get('/:aId', animalsControllers.getAnimalById);

router.get('/', animalsControllers.getAllAnimals);


router.get('/user/posted/:uId', animalsControllers.getPostedAnimalsByUserId);
router.get('/user/fostered/:uId', animalsControllers.getFosteredAnimalsByUserId);
router.get('/user/adopted/:uId', animalsControllers.getAdoptedAnimalsByUserId);

router.post(
    '/', 
    [
        check('name')
            .not()
            .isEmpty(),
        check('info').isLength({min:5}),
        check('type')
            .not()
            .isEmpty(),

        ] ,
    animalsControllers.addAnimal
)

router.patch(
    '/:aid',
    [
        check('name')
            .not()
            .isEmpty(),
         check('info').isLength({min:5}),
    ], animalsControllers.updateAnimalById)

router.delete('/:aid', animalsControllers.deleteAnimalById)

module.exports = router;