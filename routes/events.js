var express     =require("express"),
	Router      =express.Router(),
	Events      =require("../models/events.js"),
	middleware  =require("../middleware");


Router.get("/",function(req,res) {
	Events.find({}).sort({date:-1}).exec(function(err,allEvents)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			
			res.render("events/index",{myevents:allEvents});
		}
	})
})

Router.get("/new",middleware.CheckAdmin,function(req,res){
	res.render("events/new");
})

Router.post("/",middleware.CheckAdmin,function(req,res){
	Events.create(req.body.newEvent,function(err,event)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.redirect("/events/"+event._id);
		}
	})
})

Router.get("/:id",function(req,res){
	
	Events.findById(req.params.id,function(err,event)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.render("events/show",{event:event});
		}
	})
})

Router.get("/:id/edit",middleware.CheckAdmin,function(req,res){
	
	Events.findById(req.params.id,function(err,event)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.render("events/edit",{event:event});
		}
	})
})


Router.put("/:id",middleware.CheckAdmin,function(req,res){
	
	Events.findByIdAndUpdate(req.params.id,req.body.newEvent,function(err,event)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.redirect("/events/"+req.params.id);
		}
	})
})

Router.delete("/:id",middleware.CheckAdmin,function(req,res){
	
	Events.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}	
		else
		{
			res.redirect("/events");
		}
	})
})


module.exports=Router;