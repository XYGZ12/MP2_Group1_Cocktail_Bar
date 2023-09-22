//needed packages
const express = require('express');
const ejs = require('ejs');
const path = require('path');
const session = require('express-session');
const { check, validationResult} = require('express-validator');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

//express object = app
const app = express();

//templating engine
app.set('view engine', 'ejs');

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// configure the session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

//environmet variables 
const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || '3000';

//set the assets for folder
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public')));

//route for the login page
app.get('/', (req, res) => {
    console.log(uuidv4());
    res.render('login', {title: 'Login Page'});
});

//login credentials
const credential = {
    email: 'cocktailbar@test.com',
    password: 'cocktailbar123'
};

// Route to authenticate a user
app.post('/login', [
    check('email').notEmpty().isEmail(),
    check('password').notEmpty(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.send('Validation failed');
    }
    if (req.body.email === credential.email && req.body.password === credential.password) {
        // Create session
        req.session.user = req.body.email;
        return res.redirect('/dashboard'); // Redirect to the dashboard
    } else {
        return res.send('Invalid Credentials');
    }
});


// route to dashboard
app.get('/dashboard',(req, res) => {
    res.render('dashboard',{title: 'Dashboard', user: req.session.user});
});;

// route to destroy session
app.get('/logout', (req, res) => {
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
            res.send("Error");
        }else{
            res.render('login', {title: 'Login Page', logout: 'Logout Successfully!'});
        }
    })
});

//server
app.listen(port, () => {
    console.log(`The server is at http://${hostname}:${port}.`);
});

