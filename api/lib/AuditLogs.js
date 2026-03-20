let instance = null;
const ENUM = require("../config/enum");
const AuditLogsModel=require("../db/models/AuditLogs") // Renamed to avoid conflict with class name

class AuditLogger{ // Renamed class to avoid conflict with imported model
    constructor(){
    if(!instance){
        instance=this;
    }
    
    return instance;}

    info(email,location,procType,loc){
        this.#saveToDB(ENUM.LOG_LEVELS.INFO,email,location,procType,loc)
       

    }
    warn(email,location,procType,loc){
        this.#saveToDB(ENUM.LOG_LEVELS.WARN,email,location,procType,loc)
    }
    error(email,location,procType,loc){        
        this.#saveToDB(ENUM.LOG_LEVELS.ERROR,email,location,procType,loc)
    }       
    http(email,location,procType,loc){
        this.#saveToDB(ENUM.LOG_LEVELS.HTTP,email,location,procType,loc)
    }


    #saveToDB(level,email,location,proc_type,log){
  AuditLogsModel.create({ // Use the aliased model name
    level,
    email,
    location,
    proc_type,
    log
  });
    }

}
module.exports = new AuditLogger (); // Export the new class name