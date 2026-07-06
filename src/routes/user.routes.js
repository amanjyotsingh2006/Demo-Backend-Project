import express from "express"
import { signupUser } from "../controllers/user.controller.js"
import { upload } from "../middleware/multer.middleware.js"

const router = express.Router()

router.post("/signup", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), signupUser)

export default router