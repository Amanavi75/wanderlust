const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")

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


app.get('/',(req,res)=>{
    res.send("hi i am root ");
})


// index route 
//* it will show all the listings as the list
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });

   //new Route 
   app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
  })


   // create route 
  app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  });

  //Show Route 
  app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing});

  })

  
  //Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  });

 
  //update route 
  app.put("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing})
    res.redirect("/listings");

  })

  // delete route
  app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await  Listing.findByIdAndDelete(id)
    console.log(deletedListing);

    res.redirect("/listings");

  })






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





app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

