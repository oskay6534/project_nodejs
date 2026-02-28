const mongoose = require('mongoose');
let instance = null;
class Database{
 constructor(){
 if(!instance){
    this.mongoConnection=null;
    instance = this;
} return instance;
}
async connect(options){
      console.log("db connecting")

    try{
          
    let db=await mongoose.connect(options.CONNECTION_STRING);
    this.mongoConnection=db
    console.log("db connect")

    }
    catch(e){
       console.error("db connection error",e);
       process.exit(1);
    }
   
   
}}
module.exports = Database;