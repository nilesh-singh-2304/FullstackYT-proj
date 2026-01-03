import { Router } from "express";
import { loginUser, longoutUser, registerUser } from "../controllers/user.controller.js";
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
    longoutUser
); //logout krn k lie


export default router;