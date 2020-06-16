var Blog    = require("../models/blog.js"),
	Comment = require("../models/comment.js");

var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.flash("error","You have to login first...");
	res.redirect("/user/login");
}

middlewareObj.CheckAdmin=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		if(req.user.isAdmin)
		{
			next();
		}
		else
		{
			req.flash("error","You don't have permission to do that...");
			res.redirect("back");
		}
	}
	else
	{
		req.flash("error","You don't have permission to do that...");
		res.redirect("back");
	}
}

middlewareObj.CheckOwnerShipBlog=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		Blog.findById(req.params.id,function(err,found_blog){
			if(err)
			{
				req.flash("error","Blog not found....");
				res.redirect("/page-not-found");
			}
			else
			{
				if(req.user.isAdmin || found_blog.author.id.equals(req.user.id))
				{
					next();
				}
				else
				{
					req.flash("error","You don't have permission to do that...");
					res.redirect("back");
				}
			}
		})
	}
	else
	{
		req.flash("error","You have to login first...");
		res.redirect("back");
	}
}

middlewareObj.CheckCommentOwnerShip=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id,function(err,found_comment){
			if(err)
			{
				req.flash("error","Error...");
				res.redirect("back");
			}
			else
			{
				if(req.user.isAdmin || found_comment.author.id.equals(req.user.id))
				{
					next();
				}
				else
				{
					req.flash("error","You don't have permission to do that...");
					res.redirect("back");
				}
			}
		})
	}
	else
	{
		req.flash("error","You have to login first...");
		res.redirect("back");
	}
}


module.exports=middlewareObj;