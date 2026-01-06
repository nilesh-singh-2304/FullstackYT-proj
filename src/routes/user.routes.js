import { Router } from "express";
import { changePassword, getUser, getUserChannelProfle, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]), 
    registerUser); //localhost:8000/user/register p register krn k lie registerUser controller function call hoga same for login and others

router.route("/login").post(loginUser);


//secured routes

router.route("/logout").post(
    verifyJwt,
    logoutUser
); //logout krn k lie

router.route("/refresh-token").post(
    refreshAccessToken
); //token refresh krn k lie

router.route("/change-password").post(
    verifyJwt,
    changePassword
); //password change krn k lie

router.route("/get-user").get(
    verifyJwt,
    getUser
); //user details get krn k lie

router.route("/update-account").patch(  // yha hmne patch use kia as post krte toh pura data replace ho jata , patch se sirf wo fields update hoti h jo bhejte h
    verifyJwt,
    updateAccountDetails
); //account details update krn k lie

router.route("/change-avatar").patch(
    verifyJwt,
    upload.single("avatar"),   //single as single file upload kr rhe h yha
    updateUserAvatar
); //avatar change krn k lie

router.route("/c/:username").get(
    verifyJwt,
    getUserChannelProfle
); //get user by username , jb hm params me se data lete hh tab we need to use /c/:username , c is just a prefix to differentiate from other routes like /get-user

router.route("/getwatchHistory").get(
    verifyJwt,
    getWatchHistory
)

export default router;