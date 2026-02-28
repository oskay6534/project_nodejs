var express = require('express');
var router = express.Router();
var config=require("../config") 
 //bir şey yazmayınca içindeki index.js laır zaten
const fs=require("fs")
let routes=fs.readdirSync(__dirname)

for(let route of routes){
if(route.includes(".js") && route !== "index.js"){
  router.use("/"+route.replace(".js",""),require("./"+route))
}}
/* GET home page. */
 router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express',config });
 });

module.exports = router;
