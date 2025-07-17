const mongoose =require("mongoose")
const { Schema } = mongoose;

const InterviewerSchema = new Schema({
    googleId: {
        type: String,
        required: true
      },
    name:
    {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    refreshToken: {
        type: String,
        required: true
      },
    date: {
        type: Date,
        default: Date.now
    }
});
const Interviewer=mongoose.model('interviewer',InterviewerSchema)

module.exports=Interviewer;