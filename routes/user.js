var express  =require("express"),
	Router   =express.Router({mergeParams:true}),
	User     =require("../models/user.js"),
	bcrypt   =require("bcryptjs"),
	passport =require("passport");

var Secret="OurSecret";


Router.get("/register",function(req,res)
{
	res.render("main/register-user");
})
Router.post("/register",function(req,res){
	var er=0;
	if(!req.body.username || !req.body.email || !req.body.password)
	{
		req.flash("error","Plz fill out all the fields..");
		er=1;
	}
	if(req.body.password.length<6)
	{
		req.flash("error","Password should contain at least 6 entries..");
		er=1;
	}
	if(er==1)
	{
		res.redirect("/user/register");
	}
	else{

		User.findOne({email:req.body.email})
		.then(user=>{
			if(user)
			{
				req.flash("error","Email is taken by another user..");
				res.redirect("/user/register");
			}
			else
			{
				var newUser= new User({username:req.body.username,
						email:req.body.email,
						isAdmin:false,
						password:req.body.password});
				bcrypt.genSalt(10,function(err,salt){
					bcrypt.hash(newUser.password,salt,function(err,hash){
						if(err)
						{
							console.log(err);
							req.flash("error","Error...");
							res.redirect("/page-not-found");
						}
						else
						{
							newUser.password=hash;
							newUser.save()
								.then(user=>{
									passport.authenticate("local")(req,res,function(){
										req.flash("success","Thank you for register....");
										res.redirect("/blogs");
									})
								})
								.catch(err=>console.log(err));

						}
					})
				})

			}
		});
	
}
});

Router.get("/ecell/admin/register",function(req,res)
{
	res.render("main/register-admin");
})

Router.post("/ecell/admin/register",function(req,res){
	if(req.body.secret!=Secret)
	{
		req.flash("error","Permission denied...");
		res.redirect("/page-not-found");
	}
	else{
	var er=false;
	if(!req.body.username || !req.body.email || !req.body.password)
	{
		req.flash("error","Plz fill out all the fields..");
		er=true;
	}
	if(req.body.password.length<6)
	{
		req.flash("error","Password should contain at least 6 entries..");
		er=true;
	}
	if(er)
	{
		res.redirect("/page-not-found");
	}
	else{

		User.findOne({email:req.body.email})
		.then(user=>{
			if(user)
			{
				req.flash("error","Email is taken by another user..");
				res.redirect("/page-not-found");
			}
			else
			{
				var newUser= new User({username:req.body.username,
						email:req.body.email,
						isAdmin:true,
						password:req.body.password});
				bcrypt.genSalt(10,function(err,salt){
					bcrypt.hash(newUser.password,salt,function(err,hash){
						if(err)
						{
							console.log(err);
							req.flash("error","Error...");
							res.redirect("/page-not-found");
						}
						else
						{
							newUser.password=hash;
							newUser.save()
								.then(user=>{
									passport.authenticate("local")(req,res,function(){
										req.flash("success","Thank you for register....");
										res.redirect("/blogs");
									})
								})
								.catch(err=>console.log(err));

						}
					})
				})

			}
		});
	
}
	}
});


Router.get("/login",function(req,res)
{
	res.render("main/login");
})

Router.post("/login",passport.authenticate("local",
	{

		failureRedirect:"/user/login",
		failureFlash:true,
	}),function(req,res,next){
	req.flash("success","Thank you for login....");
	res.redirect("/blogs");
})

Router.get("/logout",function(req,res)
{
	req.logout();
	req.flash("success","You are logged out!..");
	res.redirect("back");
})




module.exports=Router;