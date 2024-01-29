const express  = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})



router.post("/signup",wrapAsync(async(req,res)=>{
    try{
    let {username, email,password} = req.body;
    
    const newUser = new User({
        username:username,
        email:email,
    });

    const registeredUser= await User.register(newUser,password)

    console.log(registeredUser)
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderLust")
        res.redirect("/listings")
    } )
    
    } catch (e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }


})) 

router.get("/login",(req,res)=>{
    res.render("users/login.ejs")
})


router.post("/login",
passport.authenticate("local", {failureRedirect: '/login',failureFlash:true})
,async(req,res)=>{
    req.flash("success","welcome back to wanderlust")
    res.redirect("/listings");
})


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are loggged out")
        return res.redirect("/listings")
    });

})
module.exports = router;