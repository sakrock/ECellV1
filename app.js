var express 	       =require("express"),
	app 			   =express(),
	mongoose 		   =require("mongoose"),
	bodyParser 	       =require("body-parser"),
	methodOverride 	   =require("method-override"),
	passport 		   =require("passport"),
	localStrategy 	   =require("passport-local").Strategy,
	expressSanitizer   =require("express-sanitizer"),
	flash		       =require("connect-flash"),
	middleware         =require("./middleware"),
	Events 			   =require("./models/events.js"),
	Gallery 		   =require("./models/gallery.js"),
	Comment 		   =require("./models/comment.js"),
	User 			   =require("./models/user.js"),
	Blog               =require("./models/blog.js"),
	PORT 			   =process.env.PORT || 4000,
	bcrypt 			   =require("bcryptjs");

var db=require("./routes/key").MongoURI;
mongoose.connect(db,{useNewUrlParser:true})
	.then(()=>{
		console.log("MongoDB connected...")
	})
	.catch(err=>{
		req.flash("error","ERROR..");
		res.render("404");
	});

//---routes-Var--
var indexRoutes   =require("./routes/index"),
	userRoutes    =require("./routes/user"),
	eventRoutes   =require("./routes/events"),
	galleryRoutes =require("./routes/gallery"),
	blogRoutes    =require("./routes/blogs"),
	commentRoutes =require("./routes/comments");


app.set("view engine","ejs");


app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//=============
//passport config
//==============

app.use(require("express-session")({
	secret: "hi, its vivek... making some stuff--(secret)--",
	resave: false,
	saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy({usernameField:"email"},
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      bcrypt.compare(password,user.password,function(err,isMatch){
      	if(err)
      	{
      		console.log(err);
      	}
      	else if(isMatch)
      	{
      		return done(null, user);
      	}
      	else{
        return done(null, false, { message: 'Incorrect password.' });
      	}
      })
      
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(function(req,res,next){
	res.locals.currentUser=false;
	res.locals.userIsAdmin=false;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	if(req.isAuthenticated())
	{
		res.locals.currentUser={
		id:req.user._id,
		name: req.user.username
		};
		res.locals.userIsAdmin=req.user.isAdmin;
	}
	
	next();
})



//==============
//routes
//===========
app.use(indexRoutes);
app.use("/user",userRoutes);
app.use("/events",eventRoutes);
app.use("/gallery",galleryRoutes);
app.use("/blogs",blogRoutes);
app.use("/blogs/:id/comments",commentRoutes);



//===Admin=====

app.get("/ecell/admin",middleware.CheckAdmin,function(req,res)
{
	Blog.find({deployed:false},function(err,blogs)
	{
		if(err)
		{
			res.send(err);
		}
		else
		{
			res.render("main/admin",{blogs:blogs});
		}
	});
})


//===============
app.get("*",function(req,res){
	res.render("404");
});

//listener

app.listen(PORT,function(){
	console.log("---------SERVER STARTED----------");
})

