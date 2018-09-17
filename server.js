var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('./config');
var app = express();
var googleProfile = {};

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        googleProfile = {
            id: profile.id,
            displayName: profile.displayName
        };
        cb(null, profile);
    }
));

app.set('view engine', 'pug');
app.set('views', './views');
app.use(passport.initialize());
app.use(passport.session());

//app routes
app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/logged', function(req, res){
    res.render('logged', { user: googleProfile });
});
//Passport routes
app.get('/auth/google',
passport.authenticate('google', {
scope : ['profile', 'email']
}));
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect : '/logged',
        failureRedirect: '/'
    }));

app.listen(3000);

/*app.get('/', function (req, res) {
    res.render('login');
});

app.get('/dynamic-view', function(req, res){
    const name = req.query.first_name;
    const pass = req.query.last_name;
    console.log('Login data = ' + name + ':' + pass);
    res.render('dynamic', {
        name,
        pass,
        user: {name:"Jan", pass:"12345"},
        url: "http://www.google.com"
    });
});

app.listen(3000);
app.use(function (req, res, next) {
    res.status(404).send('Wybacz, nie mogliśmy odnaleźć tego, czego żądasz!')
});*/