var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var flash = require('express-flash-messages');
var session = require('express-session');
var mongoose = require('mongoose');
var user = require('./models/user');
var url = "mongodb://localhost/session";

// setting templating engine..
app.set('view engine', 'ejs');

app.use(flash());

//directory for all related javascript, bootstrap and css files....
 app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
 app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
 app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.use(bodyParser.urlencoded({extended: true}));

var baseUrl = "http://localhost:4000";


// using session with my express.js
app.use(session({
	secret : 'kizito917',
	saveUnitialized: true,
	resave: true
}));


// connecting my database with my application 
mongoose.connect(url, function (err, db) {
	if (err) {
		throw err
	} else {
		console.log('connected');
	}
});


// creating a custom middleware that authenticate each pages of my session
var auth = function (req, res, next) {
	if (req.session && req.session.username) {
		res.render('dashboard', {
		details: req.session.username,
	});
	} else {
		res.render('error');
	}
};

app.get('/', function (req, res) {
	res.render('register');
});

app.get('/login', function (req, res) {
	res.render('index');
});

// Storing / posting new user's registration details to database
app.post('/register', function (req, res) {
	var info = user(req.body);

	info.save(function (err, result) {
		if (err) {
			console.log('error');
		} else{
			// console.log(result.name)
			res.render('register1', {
				name: result.username,
			});
		}
	});
});


// authenticating my login session page with registered details
app.post('/', function (req, res, next) {
	req.session.username = req.body.username;
	req.session.password = req.body.password;
	req.session.confpassword = req.body.confpassword;
	user.findOne({username: req.session.username, password: req.session.password, confpassword: req.session.confpassword}, function (err, result) {
		// console.log(result);
		if (result) {
			res.render('welcome', {
				details: req.session.username,
			});
		} else {
			res.send('<h1>Please Login with the right username and password</h1>');
		}
	});
});


//updating user password (Reset password)...
app.post('/reset', function (req, res) {
	user.findOneAndUpdate({password: req.body.password}, {$set: {password: req.body.new_password, confpassword: req.body.new_confpassword}}, function (err, result) {
		if (err) {
			console.log('error');
		} else{
			req.flash('notify', "your password has been updated");
			res.redirect('http://localhost:4000/login');
		}
	});
});
	
app.get('/profile', auth,  function (req, res) {
	
});

app.get('/contact', function (req, res) {
	if (req.session && req.session.username) {
		res.render('contact', {
		details: req.session.username,
	});
	} else {
		res.render('error');
	}	
});

//logout route (Session gets destroyed here)...
app.get('/logout', function (req, res) {
	req.session.destroy();
			console.log('Destroyed');
			res.redirect(baseUrl);
	
});



app.listen(4000, console.log('listening to port 4000'));
