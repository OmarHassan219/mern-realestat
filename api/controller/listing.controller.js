import listing from "../models/listing.model.js";


export const createListing = async (req ,res ,next) => {


try {
   const theList = await listing.create(req.body);
   return res.status(201).json(theList);



} catch (error) {
    next(error)
}







}






