import Joi from 'joi'
import { RefreshToken, User }from '../../models'
import CustomErrorHandler from '../../services/CustomErrorHandler'
import bcrypt from 'bcrypt'
import JwtService from '../../services/JwtService'
import { REFRESH_SECRET } from '../../config'

const registerController={
    async register(req,res,next){

    // validation

        const registerSchema = Joi.object({
            name:Joi.string().min(4).max(15).required(),
            email:Joi.string().email().required(),
            password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeat_password:Joi.ref('password')
        })

        const {error} =registerSchema.validate(req.body)
        if(error){
            return next(error)
        }

        // checking if user is already registered in database

        try{
            const exist = await User.exists({email:req.body.email})

            // If email id already exist than it will return a custom error

            if(exist){
                return next(CustomErrorHandler.alreadyExist('This email is already taken'))
            }
        }
        catch(err) {
            return next(err)

        }

        // Hashing password using bcrypt

        const {name,email,password}=req.body
        const hashedPassword = await bcrypt.hash(password,10)

        // Saving model of users
        const user=new User({
            name:name,
            email:email,
            password: hashedPassword
        })

        // declaring two variable access-token and refresh-token for storing 
         
        let access_token
        let refresh_token

        // Saving data to database and assigning tokens using jwt

        try {
            const result = await user.save()
            
            access_token=JwtService.sign({_id:result._id,role:result.role})
            refresh_token=JwtService.sign({_id:result._id,role:result.role},'1y',REFRESH_SECRET)

            // database whitelisting
            await RefreshToken.create({token: refresh_token})

        } catch (err) {
            return next(err)
        }

        res.json(user)

    }
}

export default registerController