const express  = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")





// index route 
//* it will show all the listings as the list
router.get("/", wrapAsync(listingController.index));

//new Route 
router.get("/new",isLoggedIn,listingController.renderNewform)


// create route 
router.post("/",validateListing, isLoggedIn,wrapAsync(listingController.createListing)
  );

//Show Route 
router.get("/:id",wrapAsync(listingController.showListing));


//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner
,wrapAsync(listingController.editListing));

 
//update route 
router.put("/:id",
validateListing,
isLoggedIn,
isOwner
  ,wrapAsync(listingController.updateListing))

  // delete route
  router.delete("/:id",isLoggedIn,wrapAsync(listingController.destroyListing));

  module.exports = router;