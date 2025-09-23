import mongoose from "mongoose";

import bcrypt from 'bcrypt'
const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        minlength:[2,'too short name'],
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        
    },
    password:{
        type:String,
        required:true,
    },
    
    //  Reference to Cart
    // cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" }

    //  User Points some logic about points while browsing in website 
    // points: { type: Number, default: 0 }

    // Location (lat + lng )
    // location: {
    //   lat: { type: Number },
    //   lng: { type: Number }
    // }
   
 

    
    
    
},{timestamps:true})

userSchema.pre('save',function(){
    this.password= bcrypt.hashSync(this.password,8)
    console.log(this);
})

userSchema.pre('findOneAndUpdate',function(){
    if(this._update.password) this._update.password= bcrypt.hashSync(this._update.password,8)
    console.log(this);
})


export const userModel=mongoose.model('user',userSchema);