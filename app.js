var express = require('express');
var app = express();
var MongoStore = require('connect-mongo');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var dbconnect = require('./backend/lib/connectLib');
var config = require('./backend/config/config');
var user=require('./backend/models/registrationModel');
const formatMessage=require('./public/utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./public/utils/users');
//require('./backend/lib/dbUsersBootstrap').createUsers();
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var userLib=require('./backend/lib/userLib');

const http=require('http');
const socketio=require('socket.io');
const server=http.createServer(app);
const io= socketio(server);
const botName='Chat Bot';
io.on('connection',socket=>{

    socket.on('joinRoom',({username,room})=>{
        console.log("room");
       const user=userJoin(socket.id,username,room);
       socket.join(user.room);

        socket.emit('message',formatMessage(botName,'welcome to chat'));
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`)); 
io.to(user.room).emit('roomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
});
    
});  

    socket.on('chatMessage',(msg)=>{
        //const user=userJoin(socket.id,username,room);
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    });
    socket.on('disconnect',()=>{
const user=userLeave(socket.id);

if(user){
    io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
}
    });
});



dbconnect.connect();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/login',function(req,res){
    htmlBase=__dirname+'/public/index.html';
    res.sendFile(htmlBase);
})
app.use(session({
    secret: 'goutham',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECT_STRING })
  
  }))

  app.get("/api/search:user",function(req,res){
      var user=req.params.user;
      //console.log(user);
    userLib.search(user,function(resultJson){
        res.json(resultJson);
       })
  })
  app.post('/api/login', function(req, res) {
    user.find(req.body, function(err, data) {
        var response = {success: false, message: 'Login Failed', user: null };
        if (err) { res.status(400).json({ msg: "Failed" }); } else if (data.length == 1) {
            //req.session.user=data
            req.session.userid = data[0]._id
            req.session.username = data[0].username
            console.log(req.session)
            response.success = true;
        response.message = 'Login Successful';
        response.user = {username: req.session.username};
            res.json(response);
        } else {

            res.redirect("/login");

        }
    });
})
var isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userid)
        next();
    else
        return res.redirect("/login");
}
var isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userid)
        next();
    else
        return res.redirect("/");
}
app.get("/", isAuthenticated, (req, res) => {
    res.sendFile(__dirname + "/public/sample.html")
})
app.post("/api/loggedout", (req, res) => {
    var response = {success: false, message: 'Login Failed', user: null };
    req.session.destroy(err => {
        if (err)
            return res.status(404).json({
                err: "error"
            }) 
    })

    res.json(response);

})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/check',function(req,res){
    path=__dirname+'/public/sample.html';
    res.sendFile(path);
})
app.get('/register',function(req,res){
    path=__dirname+'/public/registration.html';
    res.sendFile(path);
})
app.get('/test',function(req,res){
    path=__dirname+'/public/test.html';
    res.sendFile(path);
})
app.get('/chat',function(req,res){
    path=__dirname+'/public/chat.html';
    res.sendFile(path);
})
app.get('/searchbox',function(req,res){
    path=__dirname+'/public/searchbox.html';
    res.sendFile(path);
})
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Socket.IO server running at http://localhost:${port}/`);
  });
module.exports = app;
