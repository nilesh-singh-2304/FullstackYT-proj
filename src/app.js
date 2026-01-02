import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; //cookie parser ka kaam h server se user k browser ki cookies ko access krna & unp crud operatons krna

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


//to configure data coming from urls 
app.use(express.urlencoded({
    extended : true,
    limit : "20kb"
}));

//to limit the json response size
app.use(express.json({limit : "20kb"})); //to parse json data in request body

//kuch file folder ko store krn k lie public folder m
app.use(express.static("public"));

//for cookie parser
app.use(cookieParser());


//((req,rex) --> (err,req,res,next)) ye middleware error handling k lie hota h


//routes import & use kro yha app.js m
import userRouter from "./routes/user.routes.js"

//route declaration:
//earlier we used app.get , app.post when we were not exporting the router but now we will use router in separate files for better structure
// hm phle app k through yhi routes likh rhe the and yhi controllers likh rhe the but ab hm routes alag file m likhenge or controllers alag file m likhenge or yha app.js m unhe import krke use krenge
//but ab hm router ko alag nikal kr le gye h toh hme router ko laane k lie middleware use krna pdega express ka
//now we'll use middleware to use these routes
// app.use("/user",userRouter)  //it will take you to route localhost:8000/user and now in userRouter route file we can define further routes like /register , /login etc and in controller we can define the logic
//normally we write this through APi versioning
app.use("/api/v1/user", userRouter);


export default app;





//errors track krn k lieerror msg pdhlo phle and then file by file backtrack krte hue error find kro