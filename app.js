/* import modules */
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

/* connect mongoDB */
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open',function(){
  console.log("DataBase Connected!");
}).on('error',function(err){
  console.log("DataBase Error : ", err);
});

/* model setting */
var postSchema = mongoose.Schema({
  title : { type : String, required : true },
  body : { type : String, required : true },
  createdAt : { type : Date, default : Date.now },
  updatedAt : Date
});
var Post = mongoose.model('post',postSchema);

/* view setting */
var app = express();
app.set('view engine','ejs');
/* set middleware */
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json()); // request body 를 JSON으로 읽어!
/* set route */
app.get('/posts', function(req,res){
  Post.find({}, function(err,posts){
    if(err) return res.json({success:false, message: err});
    res.json({success:true, data:posts});
  });
});
app.post('/posts', function(req,res){
  Post.create(req.body.post, function(err,post){
    if(err) return res.json({success:false, message: err});
    res.json({success:true, data:post});
  });
});
app.get('/posts/:id',function(req,res){ //show
  Post.findOne(req.param.id, function(err, post){
      if(err) return res.json({success:false, message:err});
      res.json({sucess:true, data:post});
  });
});
app.put('/posts/:id', function(req,res){ //update
  req.body.post.updatedAt = Date.now();
  Post.findByIdAndUpdate(req.param.id, req.body.post, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({sucess:true, message:post._id+" updated"});
  });
});
app.delete('/posts/:id', function(req,res){ //destroy
  Post.findByIdAndRemove(req.param.id, function(err,post){
    if(err) return res.json({success:false, message:err});
    res.json({sucess:true, message:post._id+" deleted"});
  });
});
/* start server */
app.listen(3000, function(){
  console.log("Server Started!!");
});
