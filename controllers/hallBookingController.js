//local json database created in server
const dB = {
  rooms: require("../Data/Rooms.json"),
  setRooms: function (data) {
    this.rooms = data;
  },
};

const path = require("path");
const fsPromises = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

//to getAllRooms
const getAllRooms = (req, res, next) => {
  res.json(dB.rooms);
};

//to getBooking
const getBooking = (req, res, next) => {
  let rooms = dB.rooms.filter((room) => { //filtering all those rooms having booking
    return room.Bookings.length > 0;
  });
  res.status(201).json(                  //maping all booking of each room 
    rooms.map((book) => {
      return book.Bookings;
    })
  );
};

//creating Room
const createRoom = async (req, res, next) => {
  try {
    const { noSeats, amenities, price } = req.body; //destructuring the req.body
    
    if (!noSeats || !amenities || !price) { //checking the required values are send by the user or not
      return res
        .status(400)
        .json({ message: "noSeats ,amenities and price are required..." });
    }

    const newRoom = {                  //creating newRoom
      id: uuidv4(),
      roomNo: dB.rooms[dB.rooms.length - 1].roomNo + 1 || 101,
      noSeats: noSeats,
      amenities: amenities,
      price: price,
      Bookings: [],
    };

    dB.setRooms([...dB.rooms, newRoom]);    //updating in dB

    await fsPromises.writeFile(                //writing in the json file
      path.join(__dirname, "..", "Data", "Rooms.json"),
      JSON.stringify(dB.rooms)
    );
    res.status(201).json({ message: "Room successfully created" }); //sending the resonse
  } catch (err) {                                  
    res.status(500).json({ message: err.message });      
  }
};

//creating Booking
const createBooking = async (req, res, next) => {
  try {
    const { custName, date, startTime, endTime, roomID } = req.body; //destructuring the req.body
    if (!custName || !date || !startTime || !endTime || !roomID) {  //checking the required
      return res.status(400).json({
        message: "custName,date,startTime,endTime and roomID are required...",
      });
    }
    const newBooking = {                          //creating newBooking
      Customer_Name: custName,
      Date: date,
      Start_Time: startTime,
      End_Time: endTime,
      RoomID: roomID,
    };
    let room = dB.rooms.find((room) => room.roomNo === roomID);  //filtering the room having roomID
    if (room.Bookings.length < 1) {                            //if no bookings
      room.Bookings.push(newBooking);                          //add newBooking
      dB.setRooms([...dB.rooms]);
      await fsPromises.writeFile(
        path.join(__dirname, "..", "Data", "Rooms.json"),
        JSON.stringify(dB.rooms)
      );
      res                                                     //sending resonse
        .status(201)
        .json({ message: `Bookings for ${roomID} is done successfully` });
    } else if (room.Bookings.length > 0) {                       //if there booking more than one
      let match = room.Bookings.filter((booking) => booking.Date === date); //filter those rooms
      if (match) {
        let start = match.every((booking) => {          //check the startTime is greter than End_Time
          return booking.End_Time < startTime;
        });
        let end = match.every((booking) => {            //check the endTime is greter than Start_Time
          return booking.Start_Time < endTime;
        });

        if (start && end) {                               //if(true)
          room.Bookings.push(newBooking);                 //add the bookings
          dB.setRooms([...dB.rooms]);
          await fsPromises.writeFile(
            path.join(__dirname, "..", "Data", "Rooms.json"),
            JSON.stringify(dB.rooms)
          );
          console.log(dB.rooms);
          res                                           //send response
            .status(201)
            .json({ message: `Bookings for ${roomID} is done successfully` });
        } else {                                              
          return res.status(400).json({ message: "Room is already Booked" });
        }
      } else {                              //if no date clash simply add
        room.Bookings.push(newBooking);
        dB.setRooms([...dB.rooms]);
        await fsPromises.writeFile(
          path.join(__dirname, "..", "Data", "Rooms.json"),
          JSON.stringify(dB.rooms)
        );
        console.log(dB.rooms);
        res
          .status(201)
          .json({ message: `Bookings for ${roomID} is done successfully` });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllRooms,
  getBooking,
  createRoom,
  createBooking,
};
