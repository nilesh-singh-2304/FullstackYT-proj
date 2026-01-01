import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';    
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,         //if we wanna make the model optimized for searching we can use this index because indexing makes searching faster
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname : {
        type: String,
        required: true,
        trim: true,
        index: true,         //if we wanna make the model optimized for searching we can use this index because indexing makes searching faster
    },
    avatar : {
        type: String,       //cloudinary url of the image
        required: true,
    },
    coverImage: {
        type: String,       //cloudinary url of the image
    },
    watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",     // for aggregation of this , we use mongoose-aggregate-paginate-v2 , its like applying operations in stages : S1->S2->S3...
    }],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshToken: {
        type: String,
    }
},{timestamps: true});

//we'll use pre hook here which is a middleware that will run before saving or happening of an event on the user
UserSchema.pre("save", async function(next){           // we used function keyword here because we need to use 'this' keyword inside it and arrow functions don't bind 'this' keyword
    if(!this.isModified("password")) return next();   //if password is not modified then we don't need to hash it again
    this.password = await bcrypt.hash(this.password, 10);   //hashing the password with salt rounds of 10
    next();
});

//now we can inject some custom methods to our schema ones like updateone , findone etc
//here we are creating method for checking the passwords wheather incoming password and hashed passwords are same or not 
UserSchema.methods.checkPassword = async function(password){
    return await bcrypt.compare(password, this.password);   //this.password is the hashed password stored in db
}


//method to generate access token and refresh token
UserSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {                                 //payload
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,   //secret key set in .env file
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY    //expiry time set in .env file
        }
    )
}


//refresh token m data km rehta hh sirf _id hi rehta hh
UserSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {                                 //payload
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,   //secret key set in .env file
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY    //expiry time set in .env file
        }
    )
}


//jwt ek bearer token hh, i.e. jisk paas yeh token h wohi access kr skta hh resource ko

export const User = mongoose.model("User",UserSchema)