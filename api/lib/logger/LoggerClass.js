const logger=require("./logger"); // Corrected import path and variable name
const ENUM = require("../../config/enum"); // Added ENUM import to get log levels
let instance=null;


class LoggerClass{
    constructor(){
    if(!instance){
        instance=this;
    }
    return instance;
    }
    // The #mask method was recursive, used undefined variables, and was not called anywhere.
    // It has been removed as it was broken and unused.
    
   
    #createLogObject(level,email,location,procType,log){
        return{
            level,email,location,procType,log
        }
    }

    info(email,location,procType,log){
        const logs=this.#createLogObject(ENUM.LOG_LEVELS.INFO, email,location,procType,log);
        logger.info(logs);
    }
    warn(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.WARN, email, location, proc_type, log);
    logger.warn(logs);
}

error(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.ERROR, email, location, proc_type, log);
    logger.error(logs);
}

verbose(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.INFO, email, location, proc_type, log); // Assuming verbose maps to INFO if not defined in ENUM
    logger.verbose(logs);
}

silly(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.INFO, email, location, proc_type, log); // Assuming silly maps to INFO if not defined in ENUM
    logger.silly(logs);
}

http(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.HTTP, email, location, proc_type, log);
    logger.http(logs);
}

debug(email, location, proc_type, log) {
    const logs = this.#createLogObject(ENUM.LOG_LEVELS.INFO, email, location, proc_type, log); // Assuming debug maps to INFO if not defined in ENUM
    logger.debug(logs);
}
}  
module.exports = new LoggerClass();