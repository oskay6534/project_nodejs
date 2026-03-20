const CustomError = require("./Error");
const ENUM = require("../config/enum");

class Response{
    constructor(){}
    static  successResponse(data,code=200){
        return{
            code,
            data
        }
    }
    static errorResponse(error){
        if(error instanceof CustomError){
            return{
                code:error.code,
            
                error:{
                    message:error.message+" hata var",
                    description:error.description,
                }
            }
        }
        else if(error.message.includes("E11000")){

 return{
            code:ENUM.HTTP_CODES.CONFLICT,
            error:{
                message:"Already exists",
                description:"Already exists!!",
            }
        }
        }
        return{
            code:ENUM.HTTP_CODES.INTERNAL_SERVER_ERROR,
            error:{
                message:"unknown error"+" hata var",
                description:error.message,
            }
        }

        }
      
}
module.exports=Response;