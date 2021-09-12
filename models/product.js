import mongoose from 'mongoose'
import { APP_URL } from '../config'

const Schema = mongoose.Schema

// Product Model
const productSchema= new Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    size:{type:String,required:true},
    image:{type:String,required:true,get:(image)=>{
        image=image.split('\\')[1]
        return `${APP_URL}/uploads/${image}`
    }}
},{timestamps:true,toJSON:{getters:true},id:false})


export default mongoose.model('Product',productSchema,'products')
