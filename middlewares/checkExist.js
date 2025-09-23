import { userModel } from "../models/user.model.js"


const checkEmail= async(req,res,next)=>{
    
    let isExist = await userModel.findOne({email:req.body.email})
    if(isExist) return next(new AppError("email already exists.",409))
    next()
}
export{
 checkEmail
}