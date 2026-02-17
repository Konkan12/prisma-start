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
const getallpost = async (payload: {
    scarch?: string | undefined, tags?: string[] | []
}) => {
   

    const Allpost = await prisma.post.findMany({
        where: {
            AND: [
                payload.scarch &&
                {
                    OR: [
                        {
                            title: {
                                contains: payload.scarch as string,
                                mode: "insensitive"
                            }
                        },
                        {
                            content: {
                                contains: payload.scarch as string,
                                mode: "insensitive"
                            }
                        }, {
                            tags: {
                                has: payload.scarch as string
                            }
                        }
                    ]
                },
                {
                    tags: {
                        hasEvery: payload.tags as string[]
                    }
                }
            ]
        }
    });
    return Allpost
}

export const postService = {
    createPost,
    getallpost
}