var express=require("express"),
	Router =express.Router(),
	Blog   =require("../models/blog.js"),
	middleware  =require("../middleware");


Router.get("/",function(req,res)
{
	Blog.find({}).sort({created:-1}).exec(function(err,allBlogs)
	{
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.render("blogs/index",{allBlogs:allBlogs});
		}
	})
})

Router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("blogs/new");
});

Router.post("/",middleware.isLoggedIn,function(req,res)
{
	newBlog= {
		title: req.body.newBlog.title,
		image: req.body.newBlog.image,
		shortDescription: req.body.newBlog.shortDescription,
		description: req.sanitize(req.body.newBlog.description),
		author:{
			id: req.user._id,
			username: req.user.username	
		}
	}
	Blog.create(newBlog,
		function(err,myBlog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.redirect("/blogs/"+myBlog._id);
		}
	});
	
})


Router.get("/:id",function(req,res){
	Blog.findById(req.params.id).populate("comments").exec(function(err,found_blog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			found_blog.views=found_blog.views+1;
			found_blog.save(function(err,found_blog)
			{
				if(err)
				{
					res.send(err);
				}
				else
				{
					res.render("blogs/show",{blog:found_blog});
				}
			});
			
		}
	})
});


Router.get("/:id/edit",middleware.CheckOwnerShipBlog,function(req,res){
	Blog.findById(req.params.id,function(err,found_blog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.render("blogs/edit",{blog:found_blog});		
		}
	})
	
})

Router.put("/:id",middleware.CheckOwnerShipBlog,function(req,res){
	newBlog= {
		title: req.body.newBlog.title,
		image: req.body.newBlog.image,
		shortDescription: req.body.newBlog.shortDescription,
		description: req.sanitize(req.body.newBlog.description),
		deployed:false
	}

	Blog.findByIdAndUpdate(req.params.id,newBlog,function(err,blog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})

Router.put("/:id/deploy",middleware.CheckAdmin,function(req,res){

	Blog.findByIdAndUpdate(req.params.id,{deployed:true},function(err,blog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
			res.redirect("/blogs/"+req.params.id);
		}
	})
})


Router.delete("/:id",middleware.CheckOwnerShipBlog,function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			res.redirect("/blogs")
		}else
		{
			res.redirect("/blogs")
		}
	})
})


module.exports=Router;