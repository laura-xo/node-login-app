const router = require('express').Router();
const User = require('./User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv= require ('dotenv');
const checkAuth = require('./check-auth')



router.get('/', (req, res) => {
    res.render('pages/index.ejs');
});

router.get('/secure', checkAuth, (req, res) => {
    res.render('pages/secure.ejs');
});

router.get('/login', (req, res) => {
    res.render('pages/login.ejs')
});

router.get('/register', (req, res) => {
    res.render('pages/register.ejs')
});



router.post('/register', 
body('email').isEmail(),
body('username').isLength({ min: 4 }),
body('password').isLength({ min: 8 }),

async (req,res) =>
{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //check if email exists
       
      const emailExist = await User.findOne({email: req.body.email})
      if (emailExist) return res.status(400).send('Email already exists!');

      //hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(req.body.password, salt)

      //create user
    const user = new User (
        {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

    try {

        const savedUser = await user.save()
        res.send(savedUser)
    }catch(err) {
        res.status(400).send(err)
    }



})

router.post('/login', 
body('email').isEmail(),
body('password').isLength({ min: 8 }),

async (req,res) =>
{ 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //check if email exists
       
      const user = await User.findOne({email: req.body.email})
      if (!user) return res.status(400).send('Email is not found!');

      //check password
      const validPassword = bcrypt.compare(req.body.password, user.password)
      if (!validPassword) return res.status(400).send('Invalid password')

      res.send('Logged in')

//create token
const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
res.header('auth-token', token).send(token);


});



module.exports = router;