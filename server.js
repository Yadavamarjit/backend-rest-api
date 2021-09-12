import express from "express"
import { APP_PORT, DB_URL } from "./config"
import errorHandler from "./middlewares/errorHandler"
import routes from "./routes"
import mongoose from "mongoose"
import path from 'path'
// database connection

mongoose.connect(DB_URL,{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false})

const db = mongoose.connection
db.on('error',console.error.bind(console,'connection error'))

db.once('open',()=>{
    console.log("Connected to Database")
})

global.appRoot = path.resolve(__dirname)

const app=express()
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api',routes)
app.use('/uploads',express.static('uploads'))
app.use(errorHandler)

app.listen(APP_PORT,()=>console.log(`Listening on port ${APP_PORT}`))