
class CustomErrorHandler extends Error{
    constructor(status,msg){
        super()
        this.status=status
        this.message=msg
    }

    static alreadyExist(message){
        return new CustomErrorHandler(409,message)
    }

    static wrongCredentials(message="Wrong user name or password"){
        return new CustomErrorHandler(401,message)
    }

    static unauthorized(message="unauthorized"){
        return new CustomErrorHandler(401,message)
    }

    static notFound(message="User not found"){
        return new CustomErrorHandler(404,message)
    }

    static serverError(message="Internal server Error "){
        return new CustomErrorHandler(500,message)
    }

}
export default CustomErrorHandler