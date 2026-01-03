import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandler( async(req , res , next) => {  //kbhi kbhi req and next use hote h but res nhi toh uski jgh hm bs "_" use kr skte h
    try {
        //we can have cases like jb cookie nn ho like in mobile apps toh hm authorization header m bhej skte h token ko
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
    
        if(!token){
            throw new ApiError(401, "Unauthorized access, token is missing");
        }
    
        //ab token aane k baad hm now verify kr skte h
        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")  //-password means exclude password and refresh token from the result
        if(!user){
            throw new ApiError(401, "Unauthorized access, wrong Access token");
        }
    
        req.user = user;  //ab hm req m user ko add kr denge taki aage controllers m use kr ske
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized access, token is invalid");
    }

})