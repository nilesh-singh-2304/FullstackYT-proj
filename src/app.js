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
app.use(express.jsoon({limit : "20kb"})); //to parse json data in request body

//kuch file folder ko store krn k lie public folder m
app.use(express.static("public"));

//for cookie parser
app.use(cookieParser());


//((req,rex) --> (err,req,res,next)) ye middleware error handling k lie hota h

export default app;