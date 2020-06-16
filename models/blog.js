var mongoose=require("mongoose");

var blogSchema = new mongoose.Schema({
	title:String,
	image:String,
	shortDescription:String,
	description:String,
	views:{
		type:Number,
		default:0
	},
	deployed:{
		type: Boolean,
		default: false
	},
	created: {
		type:Date,
		default:Date.now
	},
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	},
	comments:[
	{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

module.exports=mongoose.model("Blog",blogSchema);