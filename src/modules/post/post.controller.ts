import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await postService.createPost(req.body, user.id as string)
        res.status(201).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post creation failed",
            details: e
        })
    }
}
const getAllpost = async(req:Request,res:Response)=>{
    try{
  const {scarch} = req.query
   const scarchString = typeof scarch === "string" ? scarch : undefined;
   const tags = req.query.tags ? ( req.query.tags as string).split(","):[]
const result = await postService.getallpost({ scarch:scarchString })
  res.status(200).json(result)
    }catch(err){
        res.status(500).json({
            error: "Failed to retrieve posts",
            details: err
        })
    }
}
export const postController  = {
    createPost,
    getAllpost
}