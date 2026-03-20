var express = require('express');
var router = express.Router();
const Categories=require('../db/models/Categories');
const Response=require("../lib/Response");
const CustomError=require("../lib/Error");
const ENUM=require("../config/enum");
const AuditLogger=require("../lib/AuditLogs"); // Updated import name
const logger=require("../lib/logger/LoggerClass");


/* GET users listing. */
router.get('/', async (req, res, next)=> {

  try{
   let categories=await Categories.find({});
   res.json(Response.successResponse(categories))
  }
  catch(error){
    let errorResponse= Response.errorResponse(error);
    res.status(error.code||ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
 
});

router.post("/add",async (req,res,next)=>{
  let body=req.body;
  try{
    if(!body.name)
      throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST,"parametre hatası","Name is required AFTER RUN ariff");
      let category=new Categories({
        name:body.name,
        is_active:true,
        created_by:req.user?.id


      })
      await category.save();
      AuditLogger.info(req.user?.email,"categories","add",category)
      logger.info(req.user?.email,"categories","add",category); // Corrected logger call
      res.json(Response.successResponse({success:true}))
  }
  catch(error){
    logger.error(req.user?.email,"categories","add",error); // Corrected logger call
   let errorResponse= Response.errorResponse(error);
  res.status(error.code||ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
}});

router.put("/update",async (req,res,next)=>{
 
  
  let body=req.body;
  try{
    if(!body._id)
      throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST,"parametre hatası","id is required AFTER RUN ariff");
    

  let updates={};

  if(body.name) updates.name=body.name;
  if(typeof body.is_active==="boolean") updates.is_active=body.is_active;
                           
   await Categories.updateOne({_id:body._id},updates);
    AuditLogger.info(req.user?.email,"categories","update",{_id:body._id,...updates})
   res.json(Response.successResponse({success:true}))

  }
  catch(error){
    let errorResponse= Response.errorResponse(error);
    res.status(error.code||ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
  
  }
});

router.delete("/delete",async (req,res,next)=>{
  let body=req.body;
  try{
    if(!body._id)
      throw new CustomError(ENUM.HTTP_CODES.BAD_REQUEST,"parametre hatası","id is required AFTER RUN ariff");
    await Categories.deleteOne({_id:body._id});
    AuditLogger.info(req.user?.email,"categories","delete",{_id:body._id})
    res.json(Response.successResponse({success:true}))
  }
  catch(error){
    let errorResponse= Response.errorResponse(error);
    res.status(error.code||ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
});


module.exports = router;
