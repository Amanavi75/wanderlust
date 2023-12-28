const express = require("express")
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js")


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


app.get('/',(req,res)=>{
    res.send("hi i am root ");
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

