import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async () => {
    try {
        const connnection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`DB connected successfully to ${connnection}`);

        //connection object looks like : 
        // {
        //   connection: {
        //     host: "localhost",
        //     port: 27017,
        //     name: "your_database_name"
        //   },
        //   client: {
        //     db: "your_database_name"
        //   }
        // }
    } catch (error) {
        console.log("DB connection failed ", error);
        process.exit(1); // we could have thrown the error but exiting is better because process.exit 1 indicates failure
    }
}

export default ConnectDB;