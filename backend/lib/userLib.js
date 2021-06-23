const { response } = require('express');
var userModel=require('../models/registrationModel');
const multer= require('multer');
const fs =require('fs');
module.exports.isUserValid=function(userJson,cb){
    var query = {username: userJson.username, password:userJson.password, isDeleted:{$ne : true}};

    userModel.find(query, function(err, collections){
        var response = {success: false, message: 'Login Failed', user: null };
        if(err){
            response.message = 'Server Side Error Occured, Try again after some time';
            return cb(response);
        }
        if(collections.length==0){
            response.message = 'Invalid username/password';
            return cb(response);
        }
        response.success = true;
        response.message = 'Login SuccessFul';
        response.user = {username: collections[0].username,phonenumber: collections[0].phonenumber,birthday:collections[0].birthday,email:collections[0].email};
        cb(response);
    })
}
module.exports.update = function(req,res)
{
   // console.log(req);
   var username=req.body.username;
    var obj = userModel.find({username: username},function(err,obj){
        // console.log(obj);
        // console.log(username);
    userModel.findByIdAndUpdate(obj[0]._id, {username: req.body.username,birthday:req.body.birthday,email: req.body.email,phonenumber: req.body.phonenumber,profilePicUrl:req.body.profilePicUrl},
     function (err, docs) {
    if (err){
console.log(err)
}
else{
// console.log("Updated User : ", docs);
}
});
    })
}
module.exports.getallusers=function(req,res)
{
    var query = { isDeleted:{$ne : true}};
    userModel.find(query, function(err, collections){
         res.json(collections);
    })

}
module.exports.profile=function(req,res){
    console.log(req.body.username);
    var username=req.body.username;
    var obj = userModel.find({username: username},function(err,obj){
        console.log(obj);
        res.json(obj);
    })
}
module.exports.upload=function(req,res,next){
    const file=req.file;
    console.log(file);
    if (!file){
        const error =new Error('please chosse files');
        error.httpStatusCode=400;
        return next(error)
    }
    let img=fs.readFileSync(file.path);
    let encoded_img=img.toString('base64');
    let filename1 = file.originalname;
    let contenttype = file.mimetype;
    let immageb4= encoded_img;

    var obj = userModel.find({username: "bharath"},function(err,obj){
        // console.log(obj);
        // console.log(username);
    userModel.findByIdAndUpdate(obj[0]._id, {filename:filename1,contentType:contenttype,image:immageb4},
     function (err, docs) {
    if (err){
console.log(err)
}
else{
// console.log("Updated User : ", docs);
}
});
    
    
     res.json(file);
    })

};