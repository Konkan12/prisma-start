import express from "express"
import { postController } from "./post.controller"

import auth, { userRole } from "../../middleauare/auth"

const router = express.Router()



router.post("/",auth(userRole.user),postController.createPost)
 
export const postRouter = router