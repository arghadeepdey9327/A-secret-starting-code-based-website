const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
app.set('view engine', 'ejs');
const mongoose=require("mongoose");
const bcr=require("bcrypt");

app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userCredential",{useNewUrlParser:true,useUnifiedTopology:true});

const toSchema=new mongoose.Schema({
    username:String,
    password:String,
    tok:Number
});

const Data=new mongoose.model("user",toSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.get("/",function(req,res){
    res.render("home");
});
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    bcr.hash(req.body.password,5,function(err,hash){
        if(err){
            res.render("register");
        }
        else{
            const user=new Data({
                    username:req.body.username,
                    password:hash,
                    tok:1
                 });
                 user.save(function(err,doc){
                         if(err){
                             res.render("register");
                         }
                         else{
                             res.render("login");
                         }
                });
            }
    });
    });
app.route("/login")
.get(
    function(req,res){
        res.render("login");
    })
.post(function(req,res){
Data.findOne({username:req.body.username},function(err,doc){
    if(!doc){
        res.render("login");
    }
    else{
        bcr.compare(req.body.password,doc.password,function(err,result){
                if(result===true){
                    Data.updateOne({username:req.body.username,password:doc.password,tok:1},{tok:2},function(err,docu){
                                if(!err){
                                        console.log(err);
                                        }else{
                                            res.render("secrets",{token:2,goken:doc._id});
                                        }
                                    });
                                    
                }else{
                    res.render("login");
                }
            });
    }
});
});
app.post("/logout",function(req,res){
            Data.updateOne({_id:req.body.po,tok:req.body.go},{tok:1},function(err,doc){
                if(!err){
                    res.render("login");
                }else{
                    res.render("secrets");
                }
            });
});
app.post("/submit",function(req,res){
    Data.findOne({_id:req.body.po,tok:req.body.go},function(err,doc){
        if(!doc){
            res.render("login");
        }
        else{
            res.send("<h1>Here is your secret.</h1>");
        }
});
});


app.listen(3000,function(){
    console.log("server is running");
});