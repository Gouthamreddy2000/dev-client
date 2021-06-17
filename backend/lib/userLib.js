var userModel=require('../models/registrationModel');
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
        response.user = {username: collections[0].username,phonenumber: collections[0].phonenumber,date:collections[0].date,email:collections[0].email};
        cb(response);
    })
}
module.exports.update = function(req,res)
{
   // console.log(req);
   var username=req.body.username;
    var obj = userModel.find({username: username},function(err,obj){
        console.log(obj);
        console.log(username);
    userModel.findByIdAndUpdate(obj[0]._id, {username: JSON.stringify(req.body.username),date: JSON.stringify(req.body.date),email: JSON.stringify(req.body.email),phonenumber: JSON.stringify(req.body.phonenumber),profilePicUrl:JSON.stringify(req.body.profilepicurl)},
     function (err, docs) {
    if (err){
console.log(err)
}
else{
console.log("Updated User : ", docs);
}
});
    })
}