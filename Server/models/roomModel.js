const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId:{
        type:Number,
        required: [true,"enter roomid"],
        unique:true
    },
    roomName:{
        type:String,
        required: true
    },
    host:{
        type:String,
        required:true,
    },
    members:[
        {
            type:String,
        },
    ],
    // members:[
    //     {
    //         userName:{
    //             type:String,
    //             required:true,
    //             unique: true
    //         },
    //         joinedAt:{
    //             type:Date,
    //             default: Date.now
    //         }
    //     },
    // ],
    messages:[
        {
                userName:{
                    type:String,
                    required: true
                },
                message:{
                    type:String,
                    required: true
                }
            
        }
    ],
    payments:[
        {
            paymentBy:{
                type:String,
                required:true
            },
            paymentFor:{
                type:String,
                required:true
            },
            amount:{
                type:Number,
                required:true
            },
            participants:[
                {
                        type:String,
                        required:true
                }
            ]
        }
    ]
})

module.exports = mongoose.model("Room",roomSchema);