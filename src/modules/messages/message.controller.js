import { Message } from "../../../DB/models/message.model.js";
import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";


export const createMessage=asyncHandler(async(req,res,next)=>{
    const {content}=req.body;

    const userData=req.payload
    const isUser=await User.findOne({_id:userData.id});
    if(!isUser)
        return next(new Error("user not found"));

       await Message.create({content,userReciverId:userData.id});

       return res.json({
        success:true,
        message:"Message created successfully!"
       })
})


export const deleteMessage=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const userData=req.payload;
    const isUser=await User.findOne({_id:userData.id});

    if(!isUser)
        return next(new Error("user not found"));

    const message=await Message.findByIdAndDelete({_id:id});
    if(!message)
        return next(new Error('message not found'));

        return res.json({
            success:true,
            message:"message deleted successfully"
        })
})

export const readMessage=asyncHandler(async (req,res,next)=>{
    const {id}=req.params;
    const userData=req.payload;

    const isUser=await User.findOne({_id:userData.id});
    if(!isUser)
        return next(new Error("user not found"));

    const message=await Message.findByIdAndUpdate({_id:id},{read:true})
    if(!message)
            return next(new Error('message not found'));
    
    return res.json({
        success:true,
        message:"message readed successfully"
    }) 
})

export const allMessage=asyncHandler(async(req,res,next)=>{
    const userData=req.payload;
    const isUser=await User.findOne({_id:userData.id});
    if(!isUser)
        return next(new Error("user not found"));

    const messages=await Message.find().sort({
        createdAt:"desc"
    })

    if(!messages)
        return next(new Error("messages not found"))

    return res.json({
        success:true,
        messages
    })
})