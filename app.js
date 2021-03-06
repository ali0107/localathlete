var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
    Event  = require("./models/event"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")
    
//requring routes
var commentRoutes    = require("./routes/comments"),
    eventRoutes = require("./routes/events"),
    indexRoutes      = require("./routes/index")
    
mongoose.connect('mongodb+srv://LocalAthlete:123@cluster0-lmg6t.mongodb.net/test?retryWrites=true&w=majority', {
	useNewUrlParser: true, 
	useCreateIndex: true, 
	useUnifiedTopology:true
}).then(() => {
	console.log("connected to DB");

}).catch(err => {
	console.log("error:", err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Ali Zaidi!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/events", eventRoutes);
app.use("/events/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});