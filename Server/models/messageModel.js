const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"please enter your name"]
    },
    message:{
        type:String,
        required:[true,"please enter your message"]
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Message",messageSchema);