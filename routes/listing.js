const express  = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
// index route 
//* it will show all the listings as the list
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });

   //new Route 
   router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs")
  })


   // create route 
  router.post("/",validateListing, isLoggedIn,wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    req.flash("success","new listing created !");
    await newListing.save();
    res.redirect("/listings");
    })
  );

  //Show Route 
  router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",populate:{
      path:"author",
    }
    })
    .populate("owner")

    if(!listing){
      req.flash("error","listing doesn't exist");
      res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing});
  }
  ));


  //Edit Route
router.get("/:id/edit",isLoggedIn, isOwner
,wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing doesn't exist");
      res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
  }));

 
  //update route 
  router.put("/:id",
  validateListing,
  isLoggedIn,
  isOwner
  ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    req.flash("success","Listing updated !");
    res.redirect(`/listings/${id}`);

  }))

  // delete route
  router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id)
    req.flash("success","listing deleted !");

    res.redirect("/listings");

  }));

  module.exports = router;