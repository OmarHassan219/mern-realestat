import express from "express";
import { test, updatedUser , deleteUser, getUserListing } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();


router.get('/test', test)
router.post('/update/:id' ,verifyToken, updatedUser)
router.delete('/delete/:id' ,verifyToken, deleteUser)
router.get('/listing/:id' ,verifyToken, getUserListing)

export default router ; 