import { upload } from "../middleware/multer.middleware.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

export const signupUser = async (req, res) => {
    try {
        const {fullName, email, username, password} = req.body
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({message: "All fields are required"})
        }
        const exhistedUser = User.findOne({
            $or: [{username}, {email}]
        })

        if(exhistedUser) {
            res.status(400).json({message: "User already exist!"})
        }
        
        const avatarLocalPath = req.files?.avatar[0].path
        const coverImageLocalPath = req.files?.coverImage[0].path

        if(!avatarLocalPath) {
            res.status(400).json({message: "Avatar files required"})
        }

        const avater = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar) {
            res.status(400).json({message: "Avatar files required"})
        }

        const newUser = await User.create({
            fullName,
            avater: avater.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        })

        const createdUser = User.findById(newUser._id).select("-password -refreshToken")

        if(!createdUser) {
            res.status(500).json({message: "Internal Server Error"})
        }
        res.status(200).json({message: `User Registered Successfully for ${newUser.fullName}`})
    } catch (error) {
        console.error("Error in Signup Controller: ", error)
    }
}