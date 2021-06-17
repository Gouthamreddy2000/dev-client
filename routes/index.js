var express = require('express');
var router = express.Router();
var userLib=require('../backend/lib/userLib');
var user=require('../backend/models/registrationModel');
var user1=require('../backend/models/userModel');
const CLIENT_ID= '445093466494-u1c7jg8178j553gv6o6ao8uohia3cja6.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
var session = require('express-session');
const client = new OAuth2Client(CLIENT_ID);
const cookieParser=require('cookie-parser');
router.use(cookieParser());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/sample',checkAuthenticated,function(req,res){
  let user=req.user;
  res.render('sample',{user});
})
router.post('/api/login',function(req,res){
  userLib.isUserValid(req.body,function(resultJson){
      if(resultJson.success==true){
        //console.log("Session for User Initialized");
        //req.session.user = {username: resultJson.username};
      }
      res.json(resultJson);
     })
})
router.post('/loggedin',function(req,res){
  let token=req.body.token;
  console.log(token);
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(payload);
}
verify()
.then(()=>{
    res.cookie('session-token',token);
    res.send('success');
}).catch(console.error);
})
router.post("/regis",function(req,res){
  var username=req.body.username;
  var password=req.body.password;
  var birthday=req.body.birthday;
  var gender=req.body.gender;
  //var first=req.body.username;
  var email=req.body.email;
  var phonenumber=req.body.phonenumber;
  var data={
      "username":username,
      "password":password,
      "birthday":birthday,
      "gender":gender,
      "email":email,
      "phonenumber":phonenumber
  }
  user.insertMany(data,(err,collection)=>{
      if(err)
      {
          throw err;
      }
      console.log(data);
      res.json(data);
  });
//   user1.insertMany(data,(err,collection)=>{
//     if(err)
//     {
//         throw err;
//     }
//     console.log(data);
//     res.json(data);
// });
  
});
router.put("/edit:username", userLib.update);
router.post('/api/logout',function(req,res){
  //console.log("hi");
  var response = {success: false, message: 'Login Failed', user: null };
  //res.clearCookie('session-token');
  res.json(response);
})
router.get('/mailbox', function(req, res) {
  // if this is a valid user having session, return his mailbox
  if(req.session && req.session.username){
      // User is authenticated and his session table has an entry, so we know his username
      // Can we get his details from db?
      // Can we make a db call using userLib or mailboxLib to get his data and return back?
      res.json({success:true, username:req.session.username});
  }
  else{
      // Redirect him to login page
      res.json({success:false, message:'Need to be logged in to get mailbox'});
  }
});
function checkAuthenticated(req,res,next){
  let token=req.cookies['session-token'];
  let user={};
  async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  
  });
  const payload = ticket.getPayload();
  user.name=payload.name;
  user.email=payload.email;
  user.picture=payload.picture;
  //console.log(payload);
}
verify()
.then(()=>{
    req.user=user;
    next();
}).catch(err=>{
    res.redirect('/login');
})
}

module.exports = router;
