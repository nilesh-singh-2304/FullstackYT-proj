import { asyncHandler } from "../utils/asyncHandler.js";


//we made async function inside asynchandler because we want to use await inside it in future if needed
const registerUser = asyncHandler( async (req,res) => {
    res.status(200).json({
        success : true,
        message : "User registered successfully"
    })
} )

export { registerUser };