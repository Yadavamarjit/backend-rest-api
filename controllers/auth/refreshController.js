import Joi from "joi"
import { REFRESH_SECRET } from "../../config"
import { RefreshToken, User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import JwtService from "../../services/JwtService"

const refreshController={
    async refresh(req,res,next){
        // VALIDATION 
        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required()
        })
        const {error}=refreshSchema.validate(req.body)

        if(error){
            return next(error)
        }

        // Checking if token is already present in the database
        let refreshtoken
        try {

            refreshtoken= await RefreshToken.findOne({token:req.body.refresh_token})

            if(!refreshtoken){
                return next(CustomErrorHandler.unauthorized('Invalid token'))
            }

            let userId
            try {
                const {_id}=  await JwtService.verify(refreshtoken.token,REFRESH_SECRET)
                userId=_id
            } catch (err) {

                return next(CustomErrorHandler.unauthorized('Invalid token'))

            }

            // checking if user is present in database

            const user= await User.findOne({_id:userId})

            if(!user){
                return next(CustomErrorHandler.unauthorized("No user found"))
            }

            // Generating new tokens

        const access_token=JwtService.sign({_id:user._id,role:user.role})
        const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)

        // database whitelisting
        await RefreshToken.create({token: refresh_token})

        res.json({access_token,refresh_token})

        } catch (err) {
            return next(new Error('Something went wrong '))    
        }

    }
}

export default refreshController