import { Schema, Types, model } from "mongoose";


const messageSchema=new Schema({
    content:{type:String,required:true},
    read:{type:Boolean,default:false},
    userReciverId:{type:Types.ObjectId,ref:"User",required:true}

},{timestamps:true})


export const Message=model("Message",messageSchema);