import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
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


export default router;