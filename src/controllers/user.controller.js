import { upload } from "../middleware/multer.middleware.js"
import { User } from "../models/user.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"

export const signupUser = async (req, res) => {
    try {
        const {fullName, email, username, password} = req.body
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({message: "All fields are required"})
        }
        const exhistedUser = await User.findOne({
            $or: [{username}, {email}]
        })

        if(exhistedUser) {
            return res.status(400).json({message: "User already exist!"})
        }
        
        const avatarLocalPath = req.files?.avatar?.[0]?.path
        const coverImageLocalPath = req.files?.coverImage?.[0]?.path

        console.log("Avatar Local Path:", avatarLocalPath);

        if(!avatarLocalPath) {
            return res.status(400).json({message: "Avatar files required"})
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar) {
            return res.status(400).json({message: "Avatar upload failed"})
        }

        const newUser = await User.create({
            fullName,
            avatar: avatar.url,
            coverImage: coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase(),
        })

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken")

        if(!createdUser) {
            return res.status(500).json({message: "Internal Server Error"})
        }
        return res.status(200).json({createdUser, message: `User Registered Successfully for ${newUser.fullName}`})
    } catch (error) {
        console.error("Error in Signup Controller: ", error)
    }
}