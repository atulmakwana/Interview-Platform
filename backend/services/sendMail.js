const nodemailer=require("nodemailer");
const {google}=require('googleapis');



const oAuth2Client=new google.auth.OAuth2(process.env.CLIENT_ID,process.env.CLIENT_SECRET,process.env.REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
 
async function sendMail(){
    try {
        const accessToken =await oAuth2Client.getAccessToken();
        const transport=nodemailer.createTransport({
            service:'gmail',
            auth:{
                type:'OAuth2',
                user:'atul.makwana4321@gmail.com',
                clientId:process.env.CLIENT_ID,
                clientSecret:process.env.CLIENT_SECRET,
                // refreshToken:process.env.REFRESH_TOKEN,
                accessToken:accessToken
            }
        })
        const mailOptions={
            from:'Atul4321<atul.makwana4321@gmail.com>',
            to:'atulmakwana4500@gmail.com',
            subject:"InterviewPlatform",
            text:"Join Link",
            html:'<h1>Join Link </h1>'
        }
        const result =transport.sendMail(mailOptions)
        return result
    } catch (error) {
       
    }
}
sendMail().then(result=>{
    console.log("email sent"+JSON.stringify(result));
}).catch((e)=>{
    console.log(e);
})