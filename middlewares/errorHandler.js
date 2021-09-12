import { DEBUG_MODE } from '../config'
import { ValidationError } from 'joi'
import CustomErrorHandler from '../services/CustomErrorHandler'
const errorHandler=(err,req,res,next)=>{
    let statusCode =500
    let data ={
        message:'Internal server default ',
        ...(DEBUG_MODE ==='true' && {orignalError:err.message})
    }
    
// This is for validating user details such as name email password

    if(err instanceof ValidationError){
        statusCode = 422
        data={
            message:err.message
        }
    }

// For validating if the email is already taken

    if(err instanceof CustomErrorHandler){
        statusCode= err.status
        data={message: err.message}
    }

// It will return the status code and the data of error which  will occur

    return res.status(statusCode).json(data)
}
export default errorHandler