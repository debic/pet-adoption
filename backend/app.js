const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const fs = require("fs");
const animalsRoutes = require('./routes/animals-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error')
const path = require("path")
const app = express();

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads','images')))

app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next()
})

app.use('/api/animals', animalsRoutes);
app.use('/api/users', usersRoutes);

app.use((req,re,next) =>{
    const error = new HttpError('Could not find this route', 404);
    throw error
});

//error handler middleware
app.use((error ,req, res, next) => {
 if(req.file){
    fs.unlink(req.file.path, (err)=>{
        console.log(err);
    })
 }
    
 if (res.headersSent){
    return next(error)
 }
 res.status(error.code || 500)
 res.json({message: error.message || "An unknown error ocurred"})
});

mongoose
    .connect("mongodb+srv://debi:ddaA3sPXTvxNL-C@cluster0.ryy6u.mongodb.net/animals?retryWrites=true&w=majority&appName=Cluster0")
    //in case the conection was succesfull we start
    .then(()=>{
        app.listen(4000);
    })
    .catch();
