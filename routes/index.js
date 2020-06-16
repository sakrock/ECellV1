var express=require("express"),
	Router =express.Router();

var Events 			   =require("../models/events.js"),
	Gallery 		   =require("../models/gallery.js"),
	Blog               =require("../models/blog.js");

async function getData(req,res){
	var myBlog;
	var myEvent=false;
	var myGallery=false;
	var error=false;
	// try{
		// myBlog= Blog.find({deployed:true}).sort({created:-1}).limit(3);
		// await Blog.find({deployed:true},null, {sort: {created: -1}},(err, blogs) => {
		// 	if(err) {console.log('Error occured');error=true;}
		// 	else myBlog = blogs;
		// }).limit(3);
		// await Events.find({},null, {sort: {date: -1}},(err, events) => {
		// 	if(err) {console.log('Error occured');error=true;}
		// 	else myEvent = events;
		// }).limit(3);
		// await Events.find({},null, {sort: {date: -1}},(err, Galleries) => {
		// 	if(err) {console.log('Error occured');error=true;}
		// 	else myGallery = Galleries;
		// }).limit(3);
		// myEvent= Events.find().sort({date:-1}).limit(3).exec();
		// myGallery= Gallery.find().sort({date:-1}).limit(3).exec();
		Blog.find({deployed:true}).sort({created:-1}).limit(3).exec(function(err,blogs)
			{
				if(err)
				{
					console.log('Error occured');
					req.flash("error","Error....  Contact to admin...")
					res.redirect("/page-not-found");
				}
				else
				{
					myBlog = blogs;
					Events.find({}).sort({date:-1}).limit(3).exec(function(err,events){
						if(err)
						{
							console.log('Error occured');
							req.flash("error","Error....  Contact to admin...")
							res.redirect("/page-not-found");	
						}
						else
						{
							myEvent = events;
							Gallery.find({}).sort({date:-1}).limit(3).exec(function(err,gallery){
								if(err)
								{
									console.log('Error occured');
									req.flash("error","Error....  Contact to admin...")
									res.redirect("/page-not-found");	
								}
								else
								{
									myGallery=gallery;
									res.render("landing",{myBlog:myBlog,myGallery:myGallery,myEvent:myEvent});
								}
							});
						}
					});
				}

			});

	// }
	// catch(err)
	// {
	// 	console.log(err);
	// 	error=true;
	// }
	// finally{
	// 	if(error)
	// 	{
	// 		req.flash("error","Error....  Contact to admin...")
	// 		res.redirect("/page-not-found");
	// 	}
	// 	else
	// 	{
	// 		// console.log(myBlog);
	// 		res.render("landing",{myBlog:myBlog,myGallery:myGallery,myEvent:myEvent});
	// 	}
	// }
}



Router.get("/",function(req,res) {
	getData(req,res);
	
})

Router.get("/about-us",function(req,res) {
	res.render("main/aboutUs");
})

// Router.get("/our-team",function(req,res) {
// 	res.render("main/ourTeam");
// })


Router.get("/contact-us",function(req,res) {
	res.render("main/contactUs");
})

module.exports=Router;