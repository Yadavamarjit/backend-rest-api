import mongoose from 'mongoose'
const Schema =mongoose.Schema

// Refresh Model
const refreshTokenSchema =new Schema({
    token :{type:String,unique:true},
},{timestamps:false})


export default mongoose.model('RefreshToken',refreshTokenSchema,'refreshTokens')