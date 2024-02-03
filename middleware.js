const Listing = require("./models/listing");
const {listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error","you must be logged in to create listing")
       return res.redirect("/login")
      }
      next();
}

//to save redirect url
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","you are  not the owner of the listings ");
      return res.redirect(`/listings/${id}`);
    }
    next();
}



// method for validating the listings
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errorMsg)
      }else{
        next();
      }
  }


   //method for validating the review
   module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
      if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",")
        throw new ExpressError(400,errorMsg)
      }else{
        next();
      }
  }