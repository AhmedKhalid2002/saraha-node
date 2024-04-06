import jwt from 'jsonwebtoken'
export const isAuthuntication=(req,res,next)=>{
    let {token}=req.headers;

    if(!token)
        return next(new Error("token missing"));

    if(!token.startsWith(process.env.BARER_TOKEN))
        return next(new Error("invalid token"))


    token=token.split(process.env.BARER_TOKEN)[1]
    const payload=jwt.verify(token,process.env.SECRET_KEY);
    req.payload=payload;

    return next();
}