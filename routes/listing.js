const express  = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js")





router          
    .route("/")
    .get( wrapAsync (listingController.index)) //Index Route 
    .post(   //create route
        isLoggedIn,  
        validateListing,  
        wrapAsync(listingController.createListing)
    );
   

//New Route
router.get("/new", isLoggedIn, listingController.renderNewform );


router
    .route("/:id")
    .get( wrapAsync (listingController.showListing))  //Show route
    .put(  //update route
        isLoggedIn,
        isOwner,  
        validateListing, 
        wrapAsync(listingController.updateListing)
    )
    .delete(  //delete route
        isLoggedIn,  
        isOwner,
        wrapAsync(listingController.destroyListing)
    );
    
//Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));



module.exports = router;