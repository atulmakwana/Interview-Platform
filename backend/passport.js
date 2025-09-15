const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const Interviewer = require("./models/Interviwer");
// const JWT_SECRET = "atulmakwana";
var jwt = require("jsonwebtoken");
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID : process.env.CLIENT_ID,
      clientSecret : process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3006/auth/google/callback",
      // callbackURL: "https://interviewplatformbackend.onrender.com/auth/google/callback",
      passReqToCallback: true,
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/gmail.send",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.compose",
      ],
      accessType: 'offline',       // <-- Needed to get refresh_token
      prompt: 'consent',
    },
    async function (request, accessToken, refreshtoken, profile, done) {
      console.log("refreshtoken: ",refreshtoken)
      try {
        // var userData = {
        //     name: profile.displayName,
        //     // token: accessToken
        //    };
        const data = {
          user: {
            id: profile.id,
          },
        };
        const AUTHTOKEN = jwt.sign(data, process.env.JWT_SECRET);
        const interviewer = await Interviewer.findOne({ googleId: profile.id });
        var userData = {
          user: interviewer,
          AUTHTOKEN: AUTHTOKEN,
        };
        if (interviewer) {
          return done(null, userData);
        }

        const newInterviewer = new Interviewer({
          googleId: profile.id,
          email: profile.emails[0].value,
          refreshToken: refreshtoken,
          name: profile.displayName,
          date: Date.now(),
        });

        const result = await newInterviewer.save();
        console.log("interviewer: ",result);
        console.log(newInterviewer);
        const user = {
          user: newInterviewer,
          AUTHTOKEN: AUTHTOKEN,
        }
        return done(null, user);
        // return done(null, );
      } 
      catch (error) {
        return done(error);
      }
    }
  )
);
