import mongoose from 'mongoose'
const Schema =mongoose.Schema

//User model
const userSchema =new Schema({
    name :{type:String,required:true},
    email :{type:String,required:true,unique:true},
    password :{type:String,required:true},
    role :{type:String,default:"coustomer"},
},{timestamps:true})

export default mongoose.model('User',userSchema,'users')