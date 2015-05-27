// Setja upp pakka til notkunar

var express = require('express');
var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var exphbs = require('express3-handlebars');
var User = require('./js/userModel.js');
var Note = require('./js/noteModel.js');
var bodyParser = require('body-parser');
var mongoose = require('mongoose-q')();
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var FB = require('fb');
var app     = express();

console.log(process.platform);
console.log(process.arch);

// Express setup fyrir bodyparser og static files

app.use(express.static(__dirname + '/public')); 
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
  

// Passport setup

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({id: id}, function(err, user) {
    done(err, user);
  });
});
  
  
//Express Session setup
  
app.use(session({
    secret: secret,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//Tengjast facebook

passport.use(new FacebookStrategy({
    clientID: ID,
    clientSecret: SECRET,
    callbackURL: "http://glosunet-46580.onmodulus.net/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
		User.findOne({
            'id': profile.id
        }, function(err, user) {
				if (err) {
					return done(err);
				}
				//No user was found... so create a new user with values from Facebook (all the profile. stuff)
				if (!user) {
					// Búa til og vista notanda
					console.log('no user was found');
					console.log('profile: ');
					console.log(profile._json.name);
					user = new User({
						name: profile.displayName,
						id: profile.id,
						following: [],
					});
					user.save(function(err) {
						if (err) console.log(err);
						return done(err, user);
					});
					console.log('created user' + profile.displayName);
				} else {
				//found user. Return
					console.log('found user');
					return done(err, user);
				}
		});
	}
));

// Senda authentication

app.get('/auth/facebook', passport.authenticate('facebook'));

// Callback fyrir authentication á facebook.

app.get('/auth/facebook/callback', passport.authenticate('facebook', { 	successRedirect: '/',
																		failureRedirect: '/login' }
));

// Login handler

app.get('/login', function(req, res){
	res.sendFile(path.join(__dirname, 'login.html'));
});


// Setup fyrir handlebars, ekki notað í augnablikinu

var hbs = exphbs.create({
    defaultLayout: 'main',
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


// Grunn aðgerðir fyrir helstu linka

app.get('/', ensureAuthenticated, function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about', ensureAuthenticated, function(req, res){
	res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/notes', ensureAuthenticated, function(req, res){
	res.sendFile(path.join(__dirname, 'notes.html'));
});

app.get('/note/:id', ensureAuthenticated, function(req, res){
	Note.findOne({_id: req.params.id}, function(err, note){
		if(err) return err;
		res.send(note.content);
	});
});

app.get('/search', ensureAuthenticated, function(req, res){
	res.sendFile(path.join(__dirname, 'search.html'));
});


app.get('/user/:id', ensureAuthenticated, function(req, res){
	Note.find({authorID: req.params.id}, function(err, user){
		if(err) return err;
			res.sendFile(path.join(__dirname, 'user.html'));
	});
});

app.get('/username', ensureAuthenticated, function(req, res){
	res.send(req.user);
});




// Grunn Post aðgerðir

app.post("/userNotes", function(req, res) {
	Note.find({authorID: req.body.id} ,function(err, note){
			if(err) return err;
			res.send(JSON.stringify(note));
	});
});

app.post("/userFollowed", function(req, res) {
	Note.find({_id: {$in: req.body.id}} ,function(err, note){
		if(err) return err;
		res.send(JSON.stringify(note));
	});
});


app.post("/loadNotes", function (req, res) {
	console.log(req.body.id);
	if(req.body.id === 'all'){
		Note.find(function(err, note){
			if(err) return err;
			res.send(JSON.stringify(note));
		});
	}
	else{

		Note.find({$or: [ {title: {$regex: req.body.id}}, {author: {$regex: req.body.id}}, {tags: {$regex: req.body.id}} ]}, function(err, note){
			if(err) return err;
			res.send(JSON.stringify(note));
		});
	}
});

app.post("/loadNote", function (req, res) {
    Note.findOne({_id: req.body.id}, function(err, note){
		if(err) return err;
		res.send(JSON.stringify(note));
	});
});

app.post("/followNote", function (req, res) {
	User.findOne({id: req.user[0].id}, function(err, user){
		if (err) { return next(err); }
		user.following.push(req.body.id);
		user.save(function(err) {
			if (err) { return next(err); }
			console.log(user.following);
		});
	});
	res.send('saved')
});

app.post("/unFollowNote", function (req, res) {
	User.findOne({id: req.user[0].id}, function(err, user){
		if (err) { return next(err); }
		var index = user.following.indexOf(req.body.id);
		user.following.splice(index, 1);
		user.save(function(err) {
			if (err) { return next(err); }
			console.log(user.following);
		});
	});
	res.send('unfollowed');
});

app.post('/save', function(req, res){
	var d = new Date();
	console.log('d: ' + d);
	console.log('saved content: ');
	console.log(req.body.content);
	note= new Note({
                    title: req.body.title,
                    content: req.body.content,
					desc: req.body.desc,
                    author: req.body.author,
					authorID: req.body.authorID,
					date: d,
                    tags: req.body.tags,
                });
                note.save(function(err) {
                    if (err) console.log(err);
                });
	res.send('saved');
});

// Handler fyrir static files

app.get(/^(.+)$/, function (req, res) {
    //console.log('static file request : ' + req.params);
    res.sendFile(__dirname + req.params[0]);
});


// Port setup

app.listen(8080);
console.log('port 8080');
exports = module.exports = app;


// Fall sem stjórnar aðgangi að síðunni

function ensureAuthenticated(req, res, next) {
  if (req.user) { return next(); }
  res.redirect('/login')
}


