const express = require("express");
// router to create routes
const router = express.Router();
//importing hallController from controllers 
const hallController = require("../../controllers/hallBookingController");

//route to getAllRooms 
router.get("/getAllRooms", hallController.getAllRooms);

//route to getBooking
router.get("/getBooking", hallController.getBooking);

//route to cereateRoom
router.post("/createRoom", hallController.createRoom);

//route to createBooking
router.post("/createBooking", hallController.createBooking);

module.exports = router;
