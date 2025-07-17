const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const gmail = google.gmail('v1');
const Interviewer=require('../models/Interviwer')

async function sendMail({from,to,displayName,Message,Subject}){
const   USER_EMAIL =from;
const   To_Email=to;
const interviewer=await Interviewer.findOne({email:USER_EMAIL})
console.log(interviewer);
   // Create an OAuth2 client with the given credentials
const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  
  
  oauth2Client.setCredentials({
      refresh_token: interviewer.refreshToken
    });

  // Create the email message
  const message = [
    'Content-Type: text/html; charset=utf-8\r\n',
    `To: ${To_Email}\r\n`,
    `From:"${displayName}" ${USER_EMAIL}\r\n`,
    `Subject: ${Subject}\r\n\r\n`,
    `<p>${Message}</p>`
  ].join('');
  
  // Encode the message as base64
  const encodedMessage = Buffer.from(message).toString('base64');
  
  // Send the email using the Gmail API
  gmail.users.messages.send({
    auth: oauth2Client,
    userId: 'me',
    resource: {
      raw: encodedMessage
    }
  }, (err, response) => {
    if (err) {
      console.error(err);
    } else {
      console.log(response);
    }
  }); 
}


module.exports= sendMail;