const multer=require('multer');
 var storage = multer.diskStorage({
   
    destination: function(req,file,cb){
        console.log(req.body);
        console.log(cb);
        cb(null,'uploads')
        
    },
    filename:function(req,file,cb){
        var ext=file.originalname.substr(file.originalname.lastIndexOf('.'));
        console.log("hi");
        cb(null,file.fieldname+'-'+Date.now()+ext)

    }
})
module.exports=store=multer({storage:storage})