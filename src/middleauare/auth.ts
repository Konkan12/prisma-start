import { Request, Response, NextFunction } from 'express';
import { auth as betterAuth} from  '../lib/auth'
export enum userRole{
    user ="USER",
    admin ="ADMIN"
}
 declare global {
    namespace Express{ 
        interface Request{
            user?:{
                id : string;
                email:string;
                name:string;
                role:string;
                emailVerified : boolean;
            }
        }
    }
 }
const auth =(...roles:userRole[])=>{
    return async (req:Request,res:Response,next : NextFunction)=>{
      try{
       // get user secation
      const session = await betterAuth.api.getSession({
        headers: req.headers as any
      })
       if(!session){
        return res.status(401).json({
            success : false,
            message : "you are not authorijed"
        })
       }
       if(!session.user.emailVerified){
        return res.status(402).json({
            success : false,
            message : "Email verifaction requeird .please verifiy your email"
        })
       }
     req.user ={
        id : session.user.id,
        email : session.user.email,
        name:session.user.name as string,
        role : session.user.role as string,
       emailVerified : session.user.emailVerified
        
     }
     if(roles.length && !roles.includes(req.user.role as userRole)){
        return res.status(403).json({
            success : false,
            message : "you are not authorijed to access this resource"
        })
     }
   next()
      }catch(error){
        next(error)
      }
      
    }

};

export default auth;