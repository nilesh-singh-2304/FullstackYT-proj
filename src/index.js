//DB connections m hmesha dikkate aa skti hh toh unhe try-catch m wrap kro
///DB hmesha door rhega , islie time lgta h so use async await
// require("dotenv").config({path : "./env"}); //to load env variables from .env file as soon as app runs so that access goes to all
import dotenv from "dotenv";
import ConnectDB from "./db/index.js";

dotenv.config({ path: "./.env" }); //to load env variables from .env file as soon as app runs so that access goes to all

ConnectDB();








//Also a good approach to sart with Db connection and then start the server  after successful connection
/*
import express from "express";

const app = express();

;( async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);

        //on connection failing
        app.on("error" , (error) => {
            console.log("App error ", error);
            throw error;
        })

        //on successful connection
        app.listen(process.env.PORT , () => {
            console.log(`App is running at http://localhost:${process.env.PORT}`);
        })
    } catch (error) {
        console.log("DB connection failed ", error);
        throw error;
    }
} )()//IIFE - Immediately Invoked Function Expression isko we start with ; to avoid issues */