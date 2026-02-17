import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...data,
            authorId: userId
        }
    })
    return result;
}

//Get All post
const getallpost = async()=>{
   const Allpost = await prisma.post.findMany();
   return Allpost
}

export const postService = {
    createPost,
    getallpost
}