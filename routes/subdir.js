const express = require('express'); 
const path = require('path'); 
const router = express.Router();

//sending file as a response
router.get('/',(req,res)=>{
  res.sendFile(path.join(__dirname,'..','views','index.html'));
});

//redirect to /
router.get('/old-page',(req,res)=>{
  res.redirect(301,'/subdir');
 })

//page not found
router.get('/*',(req,res)=>{
  res.status(404).sendFile(path.join(__dirname,'..','views','404.html'));
});


module.exports = router;