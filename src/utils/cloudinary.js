//we will use multer for file uploading to cloudinary , we could also have used express-fileupload but multer is more flexible and widely used
//firstly we'll save the file to our local server temprorily using multer and then upload it to cloudinary from there


//here we'll be expecting a locla path of the file to be uploaded to cloudinary
//if the file gets uploaded successfully , we'll unlink the local file to save space
//otherwise we'll return an error or retry uploading
import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadToCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) throw new Error("File path is required");
        //uploading to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",   //auto will detect the type of file be it image , video or any other
        })

        //file is uploaded successfully 
        // console.log("File uploaded , result url is" , response.url);
        fs.unlinkSync(localFilePath);   //deleting the local file
        return response.url;

    } catch (error) {
        fs.unlinkSync(localFilePath);   //deleting the local file in case of error too to save space, sync take care that file is deleted before moving forward
        return null;
    }
}

export {uploadToCloudinary};