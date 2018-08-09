var mongoose = require('mongoose');  //requiring mongoose module...
var Schema = mongoose.Schema;  //requiring Schema to use with mongoose...


// creating a new schema to work with required application field...
var userSchema = new Schema({
	username: String,
	email: String,
	password: String,
	confpassword: String
})

// creating a model for the created schema
var user = mongoose.model('user', userSchema);

//exporting the model
module.exports = user;