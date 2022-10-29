const { json } = require('express');
const express = require('express');
const path = require('path');
const app = express();
const portt = 3000;
// const jwt = require('jsonwebtoken');
const session = require('express-session');

//SESSION
app.use(session({

	
    secret: 'keyboard cat',  maxAge: 60000,

	resave: true,
	saveUninitialized: true
}));


//POST REQ
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));


const mysql = require('mysql');
//CREATE CONNECTION
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'mirzabaig',
    database : 'mydb'
  });

//CONNECT
db.connect((err, res)=>{
    if(err) throw err;
    else
    console.log("Database connected!!!!");
});

const port = process.env.PORT || 5000;
//EXPRESS RELATED STUFF
app.use('/static',express.static('static'));//  static files
app.use(express.urlencoded({ extended: true }));



// PUG RELATED STUFF
app.set('view engine', 'pug');// set template engine pug
app.set('views', path.join(__dirname, 'views'));// set views directory 
//DATABASE




//endpoints

app.get('/',(req, res)=>{
    res.status(200).render('login2.pug');
});




app.get('/reg1', (req,res)=>{
    res.render('reg1.pug');
});
app.get('/newAcc', (req, res)=>{
    res.status(200).render('reg1.pug');
});
app.post('/signup', (req, res)=>{
    console.log(req.body);
    let flag = true;
    data = req.body;
    let post = {name : data.name, email: data.email, aadhar:data.aadhar };
    let query = `insert into persons set ?`;
    let q = db.query(query, post, (err, result)=>{
        if(err){
            flag = false;
            throw err;
        }
        else{
            console.log("done");
        }
    });
    post = {email:data.email, password:data.password};
    console.log("hello");
    console.log(post);
    console.log("hello");
    query = `insert into login_users set ?`;
    q = db.query(query, post, (err, result)=>{
        if(err){
            flag = false; 
            throw err;
        }
        else{
            console.log("Done pass setting");
        }
    });
    if(flag)
    res.render('signup.pug')
    else
    res.status(200).render('wrongPW.pug');
});


app.post('/login', (req, res)=>{

    data = req.body;
    console.log(data);
    const fpw = data.password;
    console.log(fpw);
    console.log(data);
    let query = `SELECT password from login_users WHERE email like '${data.username}'`;
    const op = db.query(query,(err, result)=>{
        if(err){  throw err; } 
        else{
        console.log(result);
        if(result.length == 0){
            res.status(200).render('wrongPW.pug');
        }
        else{
        let key = Object.keys(result);
        let pw = result[key].password;
        // Object.keys(result).forEach(function(key) {
        //     var row = result[key];
        //     console.log(row.password)
        //   });
        
        // console.log(pw);
        console.log("Done!!!");
        if(pw==fpw){
        req.session.name = data.username;
        // req.session.padd = data.password;
        console.log('DOOWOAW')
        res.send("Done Welcome to home page");
        }
        else
        res.status(200).render('wrongPW.pug');
        }
        }
    });
    // res.send("Done");
});










//server
app.listen(portt, ()=>{
    console.log(`Server running on:${portt}`);
});


 // Object.keys(result).forEach(function(key) {
        //     var row = result[key];
        //     console.log(row.password)
        //   });
        
        // console.log(pw);