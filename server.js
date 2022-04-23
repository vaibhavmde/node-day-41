const express = require('express'); //importing express
const cors = require('cors');         //importing cors
const path = require('path');           //importing path

const app = express();                   //creating express app
const PORT =  process.env.PORT||3500;     //defining port

//middleware
//custom middleware
app.use((req,res,next)=>{
  console.log(`${req.method} ${req.path}`);
  next();
})
//built-in
app.use(express.urlencoded({extended:false}));
app.use(express.json());
// app.use(express.static(path.join(__dirname,'/public')));
//third-party middleware
app.use(cors());

//routes
app.use('/',require('./routes/api/HallBooking'));
// app.use('/subdir',require('./routes/subdir'));


//listening to the server
app.listen(PORT,(err)=>{
   if(err) throw err;
  console.log("Running on PORT",PORT);
});
