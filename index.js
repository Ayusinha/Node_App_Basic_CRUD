//Created by :- Ayush Sinha
//On :- 7-may-2020 @ 16:42 PM
const express=require('express');
const bodyParser= require('body-parser') 
const mongoose=require('mongoose')
const app = express()
app.use(bodyParser.urlencoded({extended: true}))

const fs=require('fs');

app.get('/', (req, res)=>{
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017/";
    MongoClient.connect(url,{ useUnifiedTopology: true } ,(err, db)=> {
        if (err) throw err;
        const dbo = db.db("node-app-db");
        dbo.collection("users").find({}).toArray((err, result) => {
            if (err) throw err;
            //console.log(result);
            res.render(__dirname+'/template/all-user.ejs',{data: result});
            db.close();
        });
    });
})


//home directory
app.get('/home',(req, res)=>{
    res.sendFile(__dirname + '/template/index.html')
})


//adding data to database.
mongoose.connect('mongodb://localhost:27017/node-app-db',{ useNewUrlParser: true , useUnifiedTopology: true }); 
const db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    // console.log(db.collections.find())
    console.log("connection succeeded"); 
}) 

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
app.get('/update', (req, res) => {
    res.send('Hello');
})

//delete data base.


//creating server
const port=3000;
  app.listen(port, () => {
     console.log( `Running on port number ${port}..`);
})