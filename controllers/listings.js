const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }


module.exports.renderNewform = (req,res)=>{
  res.render("listings/new.ejs")
}


module.exports.showListing = async(req,res)=>{
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

module.exports.createListing= async (req, res,next) => {
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  req.flash("success","new listing created !");
  newListing.image = {url,filename};
  await newListing.save();
  res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","listing doesn't exist");
    res.redirect("/listings")
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.updateListing = async(req,res)=>{
  
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})
  if(typeof req.file !=="undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename}
  await listing.save();
 }
  req.flash("success","Listing updated !");
  res.redirect(`/listings/${id}`);

}

module.exports.destroyListing = async(req,res)=>{
  let {id} = req.params;
  let deletedListing = await  Listing.findByIdAndDelete(id)
  req.flash("success","listing deleted !");

  res.redirect("/listings");

}

