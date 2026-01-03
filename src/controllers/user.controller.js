import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadToCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


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
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }
    if(avatarLocalPath){
        console.log("Avatar image is : ", avatarLocalPath);
        
    }

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

export { registerUser };