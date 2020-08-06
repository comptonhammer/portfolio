require('dotenv').config(); // Allows reading of .env file
require('./globals'); // Declare some global constants, like dirname
require('./cron'); // Cron schedules

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const session = require('express-session');
const upload = require('express-fileupload');
const passport = require('./middleware/passport');
const app = express();

require('./local')();

if(process.env.ENVIRONMENT === "PROD")
  app.enable("trust proxy"); // For reverse proxies (AWS, production only)

app.set('view engine', 'pug');
app.set('views','./views');

app.use(helmet());
app.use(upload());
app.use(session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave:true,
    cookie: {
      maxAge: 3600000,
      secure: false
    }
  }))
app.use(passport.initialize());
app.use(passport.session());
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/test/email', (req, res) => res.render('email_templates/email_consultant', {name: 'Alec', email: 'alec@hivemindai.com'}))

require('./routes/router')(app);// Don't use app.set. 
                                // This is passed by "reference" since its an object/class.
const port = process.env.port || process.env.PORT;
app.listen(port, () => console.log('Express open on port', port));