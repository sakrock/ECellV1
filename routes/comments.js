var express=require("express"),
	Router =express.Router({mergeParams:true}),
	Blog   =require("../models/blog.js"),
	Comment=require("../models/comment.js");

Router.post("/",middleware.isLoggedIn,function(req,res){
	Blog.findById(req.params.id,function(err,blog){
		if(err)
		{
			console.log(err);
			req.flash("error","Error...");
			res.redirect("/page-not-found");
		}
		else
		{
				//====
				var newComment={
					text: req.body.text,
					author:{
						id:req.user._id,
						username:req.user.username
					}
				}
				//====
				Comment.create(newComment,function(err,comm){
				if(err)
				{
					console.log(err);
					req.flash("error","Error...");
					res.redirect("/page-not-found");
				}
				else
				{
					blog.comments.push(comm);
					blog.save();
					res.redirect("/blogs/"+blog._id);
				}
			})

		}
	})
})


// Router.get("/:comment_id/edit",function(req,res){
// 	Comment.findById(req.params.comment_id,function(err,comment){
// 		if(err)
// 		{
// 			res.send(err);
// 		}
// 		else
// 		{
// 			res.render("comments/edit",{blog_id:req.params.id,comment:comment});
// 		}
// 	})
	
// })



// Router.put("/:comment_id",function(req,res){
// 	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
// 		if(err)
// 		{
// 			res.send(err);
// 		}
// 		else
// 		{

// 			res.redirect("/blogs/"+req.params.id);
// 		}
// 	})
	
// })


Router.delete("/:comment_id",middleware.CheckCommentOwnerShip,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
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

module.exports=Router;