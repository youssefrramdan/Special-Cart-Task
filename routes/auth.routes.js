import express from 'express'
import { checkEmail } from '../middlewares/checkExist.js'
import { signin, signup } from '../controller/auth.controller.js'



const authRouter=express.Router()

authRouter.post('/signup',checkEmail,signup)
authRouter.post('/signin',signin)

export default authRouter