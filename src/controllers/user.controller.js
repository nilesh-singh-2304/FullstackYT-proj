import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
// import { use } from "react";


//we made async function inside asynchandler because we want to use await inside it in future if needed
// const registerUser = asyncHandler( async (req,res) => {
//     res.status(200).json({
//         success : true,
//         message : "User registered successfully"
//     })
// } )

const registerUser = asyncHandler( async (req,res) => {
    //get user data from the frontend
    //validations on the recieved data like not empty, valid email, password strength etc.
    //check if user already exist:username, email
    //checking for images, check for avatars
    //upload them to cloudinary, avatar
    //create user object- create entry in DB
    //remove password and refresh token field from response
    //check for user creation
    //return response

    //form ya json data aa rha h toh voh req.body m mil jyega , agr url se aa rha h toh will see later
    const { username, email, fullname, password } = req.body;
    console.log("email: ", email);

    // if(fullname === ""){
    //     throw new ApiError(400, "Fullname is required");
    // }
    //hm ek ek krk bhi if-else lga skte h but voh jyda acha nhi h , isliye ek array m sb errors ko push krke ek sath bhej denge
    if(
        [fullname, email, username, password].some((fields) => fields?.trim() === "")
    ){
        throw new ApiError(400, "All fields are required" );
    }

    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists with this username or email");
    }

    // ab hm multer se file ka path lenge jo hmne upload ki thi jo hmare lie middleware req.body m add kr dega 
    const avatarLocalPath =  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    } 

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }
    // if(avatarLocalPath){
    //     console.log("Avatar image is : ", avatarLocalPath);
        
    // }

    //upload to cloudinary
    const avatar = await uploadToCloudinary(avatarLocalPath) // awaited as uploading it to cloudinary will take time
    const coverImage = await uploadToCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(500, "Error uploading avatar image , please try again later");
    }

    //create user object and save to db
    const user = await User.create({
        fullname,
        avatar: avatar,
        coverImage: coverImage || "",   //if cover image is not uploaded then set it to empty string
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken"); //excluding password and refresh token from the response
    if(!createdUser){
        throw new ApiError(500, "Error creating user , please try again later");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

    ApiResponse();
} )


const generateAccessRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false}); // save krane p mongoose k model kickin ho jaate hh wich mean yeh dubara sarri required fields ki demand krega 
        //thus we do validateBeforeSave false

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Error generating tokens");
    }
}

const loginUser = asyncHandler( async (req,res) => {
    //Todos
    //take email,username and password from req.body
    //validate the inputs
    //connect to DB and check for the credentials
    //generate access token and refresh token
    //give user Access token & refresh token in from of cookies
    //save refresh token in DB
    //send success response to frontend

    const {username, email, password} = req.body;
    console.log("login email is :", email);
    
    if(!username && !email){
        throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(400, "User Does not exist with this username or email");
    }

    //custom method jo hmne bnaye h model m hme unhe User se access nhi krna
    //as User to model h jo MongoDB ka h 
    //jo method available h voh hh user k paas jo hmne DB se fetch kre hh 

    const isPasswordCorrect = await user.checkPassword(password); //yeh method hme true ya false dega
    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid credentials , password is incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessRefreshTokens(user._id)

    //ab yha jo user h uska refresh token empty h so we have to decied ki hme isi user ko update krn ah ya ek nyi Db call krni h 

    const LoggedUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        //by default cookies ko koi bhi modify kr skta h frontend pr 
        //to avoid that we set httpOnly to true
        // secure : true,   //only send cookie over https
        //such that cokkie is modifyable conly on the server
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, {
            user: LoggedUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        }, "User logged in successfully")
    )
})

const logoutUser = asyncHandler( async (req,res) => {
    //Todos
    //get user id from req.user added by auth middleware
    //remove refresh token from db
    //remove cookies from frontend
    //send success response
    //refresh token ko DB se htane k lie hme userID chahiye but yha hm kse laaye 
    //login m toh hme mil gya tha req.body se but yha nhi milega
    //toh hm auth middleware m ek aur kaam kr lenge ki jb bhi koi request aayegi toh usme se user id nikal k req.user m daal denge
    const userId = req.user?._id;
    await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken: undefined
            }
        },
        {
            new: true  //return m jo value milegi voh updated value hogi
        }
    )

    const options = {
        //by default cookies ko koi bhi modify kr skta h frontend pr 
        //to avoid that we set httpOnly to true
        // secure : true,   //only send cookie over https
        //such that cokkie is modifyable conly on the server
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("refreshToken", options) 
    .clearCookie("accessToken", options)
    .json(
        new ApiResponse(200, null, "User logged out successfully")
    )
})

const refreshAccessToken = asyncHandler( async(req,res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken){
        throw new ApiError(400, "unauthorized access, refresh token is missing");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id);
        if(!user || user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Unauthorized access, invalid refresh token");
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const { accessToken, newRefreshToken } = await generateAccessRefreshTokens(user._id);
    
        return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, {
                accessToken: accessToken,
                refreshToken: newRefreshToken
            }, "Access token refreshed successfully")
        )
    } catch (error) {
        throw new ApiError(401, error.message || "Unauthorized access, invalid refresh token");
    }
})

const changePassword = asyncHandler(async (req,res) => {
    const {oldPassword, newPassword} = req.body;

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.checkPassword(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false});
    return res
    .status(200)
    .json(
        new ApiResponse(200, null, "Password changed successfully")
    )
})

const getUser = asyncHandler(async (req,res) => {
    const user = req.user; //added by auth middleware

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})

const updateAccountDetails = asyncHandler(async (req,res) => {
    const {fullname, email} = req.body;  //file update k controllers mostly alag rkhne chahiye its beneficial for code readability and maintainability

    if(!fullname || !email){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})

//file update k time hme do middleware chahiye , ek multer ka and ek verifyJWT ka 
const updateUserAvatar = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is missing");
    }

    const avatar = await uploadToCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(500, "Error uploading avatar image , please try again later");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar
            }
        },
        {
            new: true
        }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
})

const getUserChannelProfle = asyncHandler( async (req,res) =>{
    const {username} = req.params;

    if(!username?.trim()){
        throw new ApiError(400, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: { 
                username: username.toLowerCase() 
            }
        },
        {
            $lookup: {
                from: "subscriptions",   //collection name in mongodb
                localField: "_id",       //user k _id se match krna hh
                foreignField: "channel", //subscriptions m jaha channel hh usse match krna hh
                as: "subscribers"        //jo result milega usse hm subscribers m daal denge
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",      //user k _id se match krna hh
                foreignField: "subscriber", //subscriptions m jaha subscriber hh usse match krna hh
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$subscribers" }, //jo subscribers array milega uski size ko hm ek nayi field m daal denge
                subscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: {
                    if: {$in: [req.user?._id, "$subscribers.subscriber"]}, //agr jo hmara user hh voh subscribers m hh toh true else false
                    then: true,
                    else: false
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                email: 1,
                avatar: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                coverImage: 1,
                password: 0,
                refreshToken: 0,
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404, "Channel not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "Channel profile fetched successfully")
    )
})

export { registerUser , loginUser , logoutUser , refreshAccessToken , changePassword , getUser , updateAccountDetails , updateUserAvatar };