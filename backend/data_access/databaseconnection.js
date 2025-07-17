const mongoose= require('mongoose');

const connectToMongo= async () =>{
    try{
        // const connectionInstance = await mongoose.connect(`${process.env.mongoURI}/InterviewPlatform`,{
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        // })
        const connectionInstance = await mongoose.connect(process.env.mongoURI,
            {  
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log(`Database connection succefully, host: ${connectionInstance.connections.host}`);

    }
    catch(err) {
        console.log(err);
    }
}
module.exports=connectToMongo;

// atulmakwana450   Xz4ACjPesfK3PpBT