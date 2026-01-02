import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser); //localhost:8000/user/register p register krn k lie registerUser controller function call hoga same for login and others


export default router;