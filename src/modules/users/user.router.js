import { Router } from "express";
import * as userController from "./user.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { activationSchema, forgetCodeSchema, loginSchima, resetPasswordSchema, signUpSchima } from "./user.schema.js";
import { isAuthuntication } from "../../middlewares/authuntication.middleware.js";
import { uploadFileCloud } from "../../utils/multerCloud.js";


const userRouter=Router();

//^  signUp

userRouter.post("/signUp",validation(signUpSchima),userController.signUp)

// ^ login

userRouter.post("/login",validation(loginSchima),userController.login);

// ^ activate acount
userRouter.get("/activate_acount/:token",validation(activationSchema),userController.activateAcount);


// ^ upload profile pic
userRouter.post("/profilePic",isAuthuntication,uploadFileCloud().single("pp"),userController.profilePic)

// ^ update profile pic
userRouter.patch("/updateProfilePic",isAuthuntication,uploadFileCloud().single("pp"),userController.updateProfilePic)

// ^ delete profile pic
userRouter.delete("/deleteProfilePic",isAuthuntication,userController.deleteProfilePic)

// ^ update password
userRouter.put("/",isAuthuntication,userController.updateUserPassword);


// ^ send code 
userRouter.patch("/forgetCode",validation(forgetCodeSchema),userController.sendCode);

//^ reset password
userRouter.patch("/resetPassword",validation(resetPasswordSchema),userController.resetPassword);


//^ update name
userRouter.put("/userName",isAuthuntication,userController.updateUserName);

// ^ delete user
userRouter.delete("/",isAuthuntication,userController.deleteUser);

// ^ all user

userRouter.get('/alluser',isAuthuntication,userController.getUser);




export default userRouter;


