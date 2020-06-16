var express     =require("express")
	Router      =express.Router()
	Gallery     =require("../models/gallery.js"),
	middleware  =require("../middleware");


Router.get("/",function(req,res) {
	Gallery.find({}).sort({date:-1}).exec(function(err,allGallery)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			
			res.render("gallery/index",{myGallery:allGallery});
		}
	})
})

Router.get("/new",middleware.CheckAdmin,function(req,res){
	res.render("gallery/new");
})

Router.post("/",middleware.CheckAdmin,function(req,res){
	Gallery.create(req.body.newGallery,function(err,gallery)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.redirect("/gallery");
		}
	})
})

Router.get("/:id",function(req,res){
	
	Gallery.findById(req.params.id,function(err,gallery)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.redirect(gallery.image);
		}
	})
})

Router.get("/:id/edit",middleware.CheckAdmin,function(req,res){
	
	Gallery.findById(req.params.id,function(err,gallery)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.render("gallery/edit",{gallery:gallery});
		}
	})
})


Router.put("/:id",middleware.CheckAdmin,function(req,res){
	
	Gallery.findByIdAndUpdate(req.params.id,req.body.newGallery,function(err,gallery)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.redirect("/gallery/");
		}
	})
})

Router.delete("/:id",middleware.CheckAdmin,function(req,res){
	
	Gallery.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.redirect("/gallery");
		}
	})
})


module.exports=Router;