import { User } from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../utils/sendEmail.js";
import randomstring from 'randomstring'
import cloudinary from "../../utils/cloud.js";
// ^ signup
export const signUp= asyncHandler(async (req,res,next)=>{
    const {userName,email,password,age,gender,phone}=req.body;
    const isUser=await User.findOne({email:email});
    if(isUser)
        return next(new Error(" User aready founded! "));
    //^ hash password
    const hashPassword= bcryptjs.hashSync(password,JSON.parse(process.env.SALT_ROUND));
    // ^ create user
    const createUser= await User.create({userName:userName,email:email,password:hashPassword,age:age,gender:gender,phone:phone})

    const token =jwt.sign({email:createUser.email},process.env.SECRET_KEY)

    //^ send email
    const messageSend =await sendEmail({
        to:createUser.email,
        subject:"Account Activition",
        html:`<a href="http://localhost:3000/user/activate_acount/${token}">Activite your Account</a>`
    })

    if(!messageSend)
            return next(new Error('Email is invalid'))


    if(!createUser){
        return next(new Error("user not created"));
    }

    return res.json({
        success:true,
        message:"User created successfully"
    })
})

// ^ login

export const login=asyncHandler(async (req,res,next)=>{
    const {email,password}=req.body;

    const isUser=await User.findOne({email});

    if(!isUser)
        return next(new Error("user not found"));

    if(!isUser.isConfirmed)
        return next(new Error("you should activate your account first!"))
    const match =bcryptjs.compareSync(password,isUser.password);
    if(!match)
        return next(new Error("password not correct"));

    const token=jwt.sign({email:isUser.email,id:isUser.id},process.env.SECRET_KEY);

    return res.json({
        success:true,
        token
    })
})

// ^ activate account

export const activateAcount=asyncHandler(async (req,res,next)=>{
    const {token}=req.params;
    const payload=jwt.verify(token,process.env.SECRET_KEY)
    const user=await User.findOneAndUpdate({
        email:payload.email,
        isConfirmed:true,
        new:true,
    })

    return res.send("acount acctivation successfully! try login now")
})

// ^ upload profile

export const profilePic=asyncHandler(async(req,res,next)=>{
    const id=req.payload.id;

    const {public_id,secure_url}= await cloudinary.uploader.upload(req.file.path,{folder:`user/${id}/profile`});

    await User.findByIdAndUpdate(id,{profilePic:{secure_url,public_id}})

    return res.json({
        success:true,
        message:"profile pic uploaded successfully"
    })
})

//^ update profile
export const updateProfilePic=asyncHandler(async(req,res,next)=>{
    const id=req.payload.id;

    const user=await User.findById(id);
    const {public_id,secure_url}= await cloudinary.uploader.upload(req.file.path,{public_id:user.profilePic.public_id});
    user.profilePic={secure_url,public_id}
    await user.save()
    return res.json({
        success:true,
        message:"profile pic updated successfully"
    })
})

//^ delete profile
export const deleteProfilePic=asyncHandler(async(req,res,next)=>{
    const id=req.payload.id;

    const user=await User.findById(id);
    const {public_id,secure_url}= await cloudinary.uploader.destroy(user.profilePic.public_id);
    user.profilePic=null
    await user.save()
    return res.json({
        success:true,
        message:"profile pic delte successfully"
    })
})


// ^  update password
export const updateUserPassword=asyncHandler(async(req,res,next)=>{
    const {password,newPassword}=req.body;
    const userData=req.payload;
    const isUser=await User.findOne({email:userData.email});
    if(!isUser){
        return next(new Error("user not found "));
    }
    const match=bcryptjs.compareSync(password,isUser.password);

    if(!match)
        return next(new Error("password incorrect"));
    const hashNewPassword=bcryptjs.hashSync(newPassword,process.env.SALT_ROUND);
    const updatePassword=await User.findByIdAndUpdate({_id:userData.id},{password:hashNewPassword});

    if(!updatePassword){
        return next(new Error("Password not updated"))
    }
    return res.json({
        success:true,
        message:"password updated successfully"
    })
})

// ^ send code

export const sendCode=asyncHandler(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user)
        return next(new Error("User not found!"));

    // check activation
    if(!user.isConfirmed)
        return next(new Error("you must activate account first!"));

    // generate code
    const code=randomstring.generate({
        length:5,
        charset:"numberic"
    })
    user.forgetCode=code;
    await user.save()

    const messageSend=sendEmail({
        to:user.email,
        subject:"Reset code",
        html:`<div>${code}</div>`
    })
    if(!messageSend)
        return next(new Error('Email invalid!'))

    return res.send("you can rest your password now")
})
// ^ reset Password
export const resetPassword=asyncHandler(async(req,res,next)=>{
    const user=await User.findOne({email:req.body.email});
    if(!user)
        return next(new Error("User not found!"));

    //^ check code
    if(user.forgetCode !=req.body.code)
        return next(new Error("invalid code!"));

    user.password=bcryptjs.hashSync(req.body.password,parseInt(process.env.SALT_ROUND))

    await user.save()

    return res.json({
        success:true,
        message:"try login now!"
    })
})

// ^  update name
export const updateUserName=asyncHandler(async(req,res,next)=>{
    const {userName}=req.body;
    const userData=req.payload;
    const isUser=await User.findOne({email:userData.email});
    if(!isUser){
        return next(new Error("user not found "));
    }
    const updateName=await User.findByIdAndUpdate({_id:userData.id},{userName});

    if(!updateName){
        return next(new Error("name not updated"))
    }
    return res.json({
        success:true,
        message:"name updated successfully"
})})

// ^ delete user

export const deleteUser=asyncHandler(async(req,res,next)=>{
    const userData=req.payload;
    const isUser=await User.findByIdAndDelete({_id:userData.id})
    if(!isUser){
        return next(new Error("User not found"));
    }
    return res.json({
        success:true,
        message:"user deleted successfully"
    })
})

// ^ get user

export const getUser=asyncHandler(async(re,res,next)=>{
    const users=await User.find();
    if(!users){
        return next(new next("no users found"))
    }

    return res.json({
        success:true,
        users
    })
})
