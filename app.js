const express = require("express")
const app = express();
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
//use to create the template for the the all the page of website
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport")
const localStrategy = require("passport-local");
const User = require("./models/user.js")

const listings = require("./routes/listing.js")
const reviews = require("./routes/review.js")

const MONGO_URL= "mongodb://127.0.0.1:27017/wanderlust"
// database connection 



main()
.then(()=>{
    console.log("connected to db ")
}).catch(err=>{
    console.log(err);
})
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}))
// it will parse all the data that is coming inside the request 
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate) 
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 *1000,
    maxAge: 7 * 24 * 60 * 60 *1000,
    httpOnly:true,
  }
}

app.get('/',(req,res)=>{
    res.send("hi i am root ");
})


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
//* middleware to initiaize passport
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.authenticate());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.get("/demouser",async(req,res)=>{
  let fakeUser = new User({
    email:"fa@gmail.com",
    username:"fa12"
  });

  let registeredUser = await User.register(fakeUser,"helloworld")

 res.send(registeredUser);
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews)



app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page Not found "));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong"} = err;

  res.status(statusCode).render("error.ejs",{message})

  //*res.status(statusCode).send(message)

})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

