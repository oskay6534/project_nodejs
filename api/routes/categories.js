var express = require('express');
var router = express.Router();
const Authentication=false;

router.all('*',(req,res,next)=>{
  if(Authentication){
    next();
  }else{
    res.json({
      success: false,
      error: "Unauthorized",
    });
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    success: true,
  });
});

module.exports = router;
