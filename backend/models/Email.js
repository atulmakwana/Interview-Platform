const mongoose =require("mongoose")
const { Schema } = mongoose;

const EmailSchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interviewer',
        required: true,
    },
    sender: {
        type: String,
        required: true
      },
    recipient:
    {
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true,
        // unique:true
    },
    body:{
        type: String,
        required: true,
        // unique:true
    },
    displayName: {
        type: String,
        required: true
      },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const Email=mongoose.model('email',EmailSchema)

module.exports=Email;