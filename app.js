const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
//use to create the template for the the all the page of website
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js")


const listings = require("./routes/listing.js");


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



app.get('/',(req,res)=>{
    res.send("hi i am root ");
})


//method for validating the review
const validateReview = (req,res,next) =>{
  let {error} = reviewSchema.validate(req.body);
    if(error){
      let errorMsg = error.details.map((el)=> el.message).join(",")
      throw new ExpressError(400,errorMsg)
    }else{
      next();
    }
}


app.use("/listings",listings);

  
  

  //reviews
  //adding review
  app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)

    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  }))

  //delete route 
  app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{
      $pull:{
        reviews:reviewId
      }
    });
    await Review.findByIdAndDelete(reviewId)

    res.redirect(`/listings/${id}`);
  }))


/*app.get("/testListing",async (req,res)=>{
    let sampleListing = new Listing ({
        title:"my new vila",
        description:"by the beach",
        price:1200,
        location:"calangute",
        country:"India"
    });

    await sampleListing.save();
    console.log("sample was save")
    res.send("successfull listing")
}) */

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page Not found "));
})

app.use((err,req,res,next)=>{
  let {statusCode,message} = err;

  res.status(statusCode).render("error.ejs",{message})

  //*res.status(statusCode).send(message)

})


app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

