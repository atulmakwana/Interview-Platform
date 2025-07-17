const mongoose =require("mongoose")
const { Schema } = mongoose;

const IntervieweeSchema = new Schema({
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
        // unique:true
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
const Interviewee=mongoose.model('interviewee',IntervieweeSchema)

module.exports=Interviewee;