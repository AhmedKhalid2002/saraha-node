import nodemailer from 'nodemailer'


export async function sendEmail({to,subject,html}){

    // transporter
    const transporter=nodemailer.createTransport({
        host:"localhost",
        port:465,
        secure:true,
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASS
        }
    })

    // recever
    const info=await transporter.sendMail({
        from:`'Sarah App 🥰' <${process.env.EMAIL}>`,
        to,
        subject,
        html,
    })

    if(info.accepted.length > 0) {
        return true;
    }else{
        return false;
    }
}