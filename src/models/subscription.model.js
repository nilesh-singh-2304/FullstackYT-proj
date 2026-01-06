import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // one who is subscribing
        ref: "User"
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
        ref: "User"
    }
}, {timestamps: true})



export const Subscription = mongoose.model("Subscription", subscriptionSchema)



//we will join this subscription model with user model to get the details of subscriber and channel using mongoose populate method
//for this we need aggregation pipelines