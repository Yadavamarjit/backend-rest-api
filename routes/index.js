// This file contains all routes of this express app

import express from "express"
import {registerController,loginController,userController, refreshController,productController} from '../controllers'
import admin from "../middlewares/admin"
import auth from "../middlewares/auth"
const router =express.Router()
router.post('/register',registerController.register)
router.post('/login',loginController.login)
router.get('/me',auth,userController.me)
router.get('/users',auth,userController.users)
router.delete('/user/',auth,userController.remove)
router.post('/refresh',refreshController.refresh)
router.post('/logout',auth,loginController.logout)
router.post('/products',[auth,admin],productController.store)
router.put('/products/:id',[auth,admin],productController.update)
router.delete('/products/:id',[auth,admin],productController.destroy)
router.get('/products',productController.index)
router.get('/products/:id',productController.show)
export default router