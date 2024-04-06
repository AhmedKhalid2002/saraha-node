import express from 'express'
import { connectionDB } from './DB/connection.js'
import userRouter from './src/modules/users/user.router.js';
import messageRouter from './src/modules/messages/message.router.js';
import dotenv from 'dotenv'
import { sendEmail } from './src/utils/sendEmail.js';

dotenv.config();
const app = express()
const port = process.env.PORT;

//^ parse
app.use(express.json());

//^ Api

// ^ user
app.use("/user",userRouter)

// ^ message

app.use("/message",messageRouter);

// ^ static 

app.use("/uploads",express.static("uploads"))

//^ DB
connectionDB()



app.use('*',(req,res,next)=>{
    return res.json({
        messsage:"Page not found",
    })
})

app.use((error,req,res,next)=>{
    return res.json({
        success:false,
        messsage:error.message,
        stack:error.stack
    })
})


app.listen(port, () => console.log(`App listening on port ${port}!`))