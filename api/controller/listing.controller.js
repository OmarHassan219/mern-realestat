import listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async (req ,res ,next) => {


try {
   const theList = await listing.create(req.body);
   return res.status(201).json(theList);



} catch (error) {
    next(error)
}







}




export const deleteListing = async (req, res, next) => {

    const findList = await listing.findById(req.params.id) ;
    if(!findList) return next(errorHandler(401 , 'listing Not Found'));
    
    if(findList.userRef === req.user.id)  return next(errorHandler(401 , 'you can only delete your listings'));
    
    try {
        await listing.findByIdAndDelete( req.params.id) ;
    return res.status(200).json('Listing has been deleted')
} catch (error) {
   next(error) 
}




// try {
// const findList = await listing.findById(req.params.id) ;
// if(findList.userRef === req.user.id) {
//  await listing.deleteOne({_id : req.params.id}) ;
// return res.status(201).json('deleted successfully')
// }
// next(errorHandler(401 , 'you can only delete your listings'))
// } catch (error) {
//    next(error) 
// }


}

export const updateListing = async (req, res, next) => {


const findList = await listing.findById(req.params.id);
if(!findList) return next(errorHandler(401 , 'Listing Not Found'));

if(req.user.id !== findList.userRef) return next(errorHandler(401 , 'You can only edit your own listing'));

try {
    const updatedListing = await listing.findByIdAndUpdate(req.params.id, req.body , { new: true });
    res.status(200).json(updatedListing);
} catch (error) {
 next(error);   
}




}