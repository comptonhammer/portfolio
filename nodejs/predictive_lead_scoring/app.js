//@ts-check
let express = require('express');
let app = express();
let upload = require('express-fileupload');
let helmet = require('helmet');
let flash = require('connect-flash');
let passport = require('passport');
let session = require('express-session');
let bodyParser = require('body-parser');
require('./globals.js');

app.use(upload());
app.use(helmet());
app.use(require('cookie-parser')());
app.use(flash());
app.use(session({
    secret:'secret',
    saveUninitialized: false,
    resave:true,
    cookie: {
      maxAge: 3600000,
      secure: false
    }
  }))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

app.set('view engine','pug'); //PUG / JADE is the templating engine: https://pugjs.org/api/getting-started.html
app.set('views','./views');

require('./server')(app);
require('./routes/router.js')(app);
require('./cron/subscriptions');
//if(global.environment != 'PROD') require('./utilities/createTrainingFile');
