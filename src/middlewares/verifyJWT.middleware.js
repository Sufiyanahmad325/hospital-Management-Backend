import jwt from 'jsonwebtoken'
import { User } from '../models/userSchema.js'
import ApiError from '../utils/apiError.js'

export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }


        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user =await User.findById(decodedToken._id).select('-password -__v -createdAt -updatedAt')

        console.log('this is your decoded details=> ' , user)

        req.user = user
        next()

    } catch (error) {
        console.log(error)
        throw new ApiError(400, error.message || "Invalid access Token")
    }
}