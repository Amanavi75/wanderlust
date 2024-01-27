const express  = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js")


// method for validating the listings
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errorMsg)
      }else{
        next();
      }
  }

  


// index route 
//* it will show all the listings as the list
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });

   //new Route 
   router.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
  })


   // create route 
  router.post("/",validateListing, wrapAsync(async (req, res,next) => {
    const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    res.redirect("/listings");
    })
  );

  //Show Route 
  router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews")
    res.render("listings/show.ejs", {listing});
  }
  ));


  //Edit Route
router.get("/:id/edit",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));

 
  //update route 
  router.put("/:id",wrapAsync(async(req,res)=>{

    if(!req.body.listing){
      throw new ExpressError(400,"send valid data for updating")
    }
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");

  }))

  // delete route
  router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id)
    console.log(deletedListing);

    res.redirect("/listings");

  }));

  module.exports = router;