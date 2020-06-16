var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
	title:String,
	image:String,
	description:String,
	date:{
		type:Date,
		default:Date.now
	}
});

module.exports=mongoose.model("Event",EventSchema);