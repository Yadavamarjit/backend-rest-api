import { User } from "../../models"
import CustomErrorHandler from "../../services/CustomErrorHandler"

const userController ={
    async me(req,res,next){
        try{
            const user= await User.findOne({_id:req.user._id}).select('-password -updatedAt -__v')
            if(!user){
                return(next(CustomErrorHandler.notFound()))
            }
            res.json(user)
        }
        catch(err){
            return next(err)
        }
    },
    async users(req,res,next){
        let users
        try {
            users=await User.find().select('-createdAt -updatedAt -__v')
            if(!users){
                return(next(CustomErrorHandler.notFound()))   
            }
        } catch (err) {
            return next(err)
        }
        res.json({users:users})
    },
    async remove(req,res,next){
    let document
        try {
            const user =await User.findOne({_id:req.user._id})
            
            const id=user._id
            document = await User.findOneAndDelete({_id:id})
            if(!document){
            return next(new Error('Nothing to delete'))
        }
            
        } catch (err) {
            return next("An error occured")
        }
        res.json({document})
    }
}

export default userController