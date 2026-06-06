import {Request,Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../../config/prisma.js'

export const login = async (req : Request, res : Response ) =>{
    try{
         const {email, password} = req.body;
          const users = await  prisma.user.findMany()
          console.log('users',{email, password})


    const user = await  prisma.user.findUnique({
        where : {email}
    })

    if(!user){
        return res.status(401).json({message: "Invalid email!"})
    }

    const isPasswordValid = user.password
    if(!isPasswordValid){
        return res.status(401).json({message : "Invalid password!"})
    }

    const token = jwt.sign(
        {
        id: user.id,
        mail: user.email
    },
    process.env.JWT_SECRET|| 'erp secrete',
    {expiresIn:'1d'}
    );

    res.json({
            message : ' Login Successful!',
            token,

            user:{
                id:user.id,
                email:user.email
            },
        
        })
    }
    catch(error){
        return res.status(500).json({message: 'Login failed'})
    }
   
}