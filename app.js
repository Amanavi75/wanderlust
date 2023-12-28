const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")
const path = require("path")


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


app.get('/',(req,res)=>{
    res.send("hi i am root ");
})


// index route 
//* it will show all the listings as the list
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  });


  //Show Route 
  app.get("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing});

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

