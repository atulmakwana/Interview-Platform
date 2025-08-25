require('dotenv').config();

const express=require("express");
const cookieSession = require('cookie-session');
const connectToMongoAtlas=require("./data_access/databaseconnection")
const app=express();
const cookieParser = require("cookie-parser")
const passport = require("passport");
app.use(express.json());
const server = require("http").Server(app);
const cors=require("cors")

const makeSocketConnection=require("./routes/socket")
require('./passport');

connectToMongoAtlas()

// const io=require("socket.io")(server);
// makeSocketConnection({io})();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // or exact frontend origin like "http://localhost:5173"
    methods: ["GET", "POST"],
  },
});

makeSocketConnection({ io })();


app.get("/",(req,res)=>{
    res.send("running");
})
app.use(
  cookieSession({
    name: "session",
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 100
  })
);
app.use(cookieParser());
app.use(passport.initialize());
// deserialize cookie from the browser
app.use(passport.session());
app.use(
	cors({
	  origin: "http://localhost:3000", // allow to server to accept request from different origin
	  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	  credentials: true // allow session cookie from browser to pass through
	 })
  );
app.use("/auth",require("./routes/intervieweeAuth"))
app.use("/api/email",require("./routes/email"))
//socket code

server.listen(process.env.PORT,()=>{
    console.log("server started");
})  