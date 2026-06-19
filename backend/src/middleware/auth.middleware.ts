import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware =(
     req:Request,
    res:Response,
    next:NextFunction
)=>{
    try{
        const authHeader =req.headers.authorization;
        console.log("Authorization Header:", authHeader);
        //console.log(localStorage.getItem('token'))
        //console.log('token',authHeader.split(" ")[1])
        if(!authHeader){
            return res.status(401).json({
                'message':'Authorization Token missing'
            })

          }
           const token = authHeader.split(" ")[1];
           console.log("Extracted Token:", token);
             
console.log('token',token)
               const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    (req as any).user = decoded;

    next();
  

}
catch (error:any) {
  console.log("JWT Error:", error.message);

    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
   