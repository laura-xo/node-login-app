const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const dotenv= require ('dotenv')
const nodemailer = require('nodemailer')
const router = require('./routes')

dotenv.config();



// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use('/', router)
app.use('/login', router)
app.use('/register', router)
app.use('/secure', router)

app.use(express.static(__dirname +'/public'));

mongoose.connect(process.env.DB_URL,
{useNewUrlParser: true},
()=> console.log('Connected to database'))


app.listen(8080);
console.log('Server is listening on port 8080');

