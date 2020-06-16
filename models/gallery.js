var mongoose = require("mongoose");

var GallerySchema = new mongoose.Schema({
	image:String,
	description:String,
	date:{
		type:Date,
		default:Date.now
	}
});

module.exports=mongoose.model("Gallery",GallerySchema);