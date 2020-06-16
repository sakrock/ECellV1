var mongoose =require("mongoose");
	

var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	isAdmin: Boolean, 
	password: String
})


module.exports=mongoose.model("User",userSchema);