import { Schema, model } from "mongoose";
const userSchema=new Schema({
    userName:{type:String,required:true},
    email:{type:String,uniqe:true,required:true},
    password:{type:String,required:true}, 
    age:{type:Number,min:18,max:80},
    gender:{type:String,enum:["male","female"]},
    phone:{type:String},
    isConfirmed:{type:Boolean,default:false},
    forgetCode:{type:String,uniqe:true},
    profilePic:{secure_url:String,public_id:String},

},{
    timestamps:true
});


export const User=model("User",userSchema);