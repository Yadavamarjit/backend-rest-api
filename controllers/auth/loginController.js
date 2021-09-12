import Joi from "joi"
import { User ,RefreshToken} from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from "../../config"

const loginController ={
    async login(req,res,next){
        // validation of users
        const loginSchema = Joi.object({
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        })

        const {error}=loginSchema.validate(req.body)

        if(error){
            return next(error)
        }

        try {
            const user=await User.findOne({email:req.body.email})

            if(!user){
                return next(CustomErrorHandler.wrongCredentials())
            }


            //comparing password

            const match= await bcrypt.compare(req.body.password,user.password)      
            
            if(!match){
                return(CustomErrorHandler.wrongCredentials())
            }


            //If user is matched then this part will be executed and token will be generated

            const access_token=JwtService.sign({_id:user._id,role:user.role})
            const refresh_token=JwtService.sign({_id:user._id,role:user.role},'1y',REFRESH_SECRET)

            // database whitelisting
            await RefreshToken.create({token: refresh_token})

            res.json({access_token,refresh_token})


        } catch (err) {
            return next(err)
        }
    },
    async logout(req,res,next){

        //validation

        const refreshSchema = Joi.object({
            refresh_token:Joi.string().required()
        })
        const {error}=refreshSchema.validate(req.body)

        if(error){
            return next(error)
        }

        try {
            await RefreshToken.deleteOne({token:req.body.refresh_token})
        } catch (err) {
            return next(new Error("Something went wrong"))
        }
        res.json({Status:"Logged out succsfully"})

    }

}
export default loginController