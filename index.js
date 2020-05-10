//Created by :- Ayush Sinha
//On :- 7-may-2020 @ 16:42 PM
const express=require('express');
const bodyParser= require('body-parser') 
const mongoose=require('mongoose')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

mongoose.connect("mongodb://localhost:27017/node-app-db",{ useNewUrlParser: true,useUnifiedTopology: true });
const db=mongoose.connection; 
db.once('open', function(callback){ 
    // console.log(db.collections.find())
    console.log("connection succeeded"); 
}) 

const Schema = new mongoose.Schema({
	name: String,
    email   : String,
    password : String,
    phone : String
});

var user = mongoose.model('users', Schema);

const fs=require('fs');

app.get('/', (req, res)=>{
    db.collection('users').find({}).toArray((err, result) => {
            if (err) throw err;
            res.render(__dirname+'/template/all-user.ejs',{data: result});
    });
})


//home directory
app.get('/home',(req, res)=>{
    res.sendFile(__dirname + '/template/index.html')
})


//adding data to database.

app.post('/create', (req, res) => {
    console.log(req.body);
    //console.log('Hello');
    var name = req.body.name; 
    var email =req.body.email; 
    var password = req.body.password; 
    var phone =req.body.phone; 
    var data = { 
        "name": name, 
        "email":email, 
        "password":password, 
        "phone":phone 
    } 
    db.collection('users').insertOne(data,function(err, col){ 
        if (err) throw err; 
        console.log("Record inserted Successfully");     
    }); 
    //res.sendFile(__dirname + '/template/user.html',data);
    res.send(`<h1>Hello ${data.name} !!!</h1>
            <h3>Welcome to your Profile , </h3>
            <h3>Your email is :- ${data.email}</h3>
            <h3>Your Contact info :- ${data.phone}</h3>
            <br>
            <h4>To see all user <a href="/">CLICK HERE</a> !!!</h4>`)
})

//edit database
app.get('/update/edit/:id', (req, res) => {
    const temp=req.params.id;
    //console.log(id);
    var id = require('mongodb').ObjectID(temp);
    console.log(id);
    db.collection('users').findOne({_id:id},(err, result)=>{
        //check if there's records in database to display
        //res.send(result.name);
        res.render(__dirname+'/template/edit_user.ejs',{data: result});      
    });
    //res.render(__dirname+'/template/edit_user.ejs',{data: data});
})

//update database.
app.get('/update/:id', (req, res) => {
    const temp=req.params.id;
    //console.log(temp);
    var id = require('mongodb').ObjectID(temp);
    //console.log(id);

    //new data..
    const dataNew = { 
        "name": req.body.name, 
        "email":req.body.email, 
        "password":req.body.password, 
        "phone":req.body.phone 
    }
    console.log(dataNew)

    db.collection('users').updateOne({_id: id},dataNew, (err)=>{
        if(err) res.send(err)
        res.redirect('/');
    })
    //res.render(__dirname+'/template/edit_user.ejs',{data: data});
})

//delete data base.
app.get('/delete/:id', (req, res) => {
    const temp=req.params.id;
    //console.log(id);
    var id = require('mongodb').ObjectID(temp);
    db.collection('users').deleteOne({_id : id},(err)=>{ 
        if (err) throw err;
        console.log("Record Deleted Successfully");    
    });
    res.redirect('/');
})


//creating server
const port=3000;
  app.listen(port, () => {
     console.log( `Running on port number ${port}..`);
})