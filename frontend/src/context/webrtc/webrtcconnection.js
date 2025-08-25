import Webrtccontext from "./Webrtccontext";
import toast from "react-hot-toast";
import Peer from "simple-peer";
import { initSocket } from "../../socket";
import React, { useEffect, useRef, useState } from "react";
const Webrtcconnection = ({ children }) => {
  console.log('context');
  const audio = new Audio("/notify.mp3");
  const [otherUser, setOtherUser] = useState("");
  const [video, setVideo] = useState(true);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [message, setmessage] = useState("");
  const [isLogin, setLogin] = useState(false);
  // const [room, setroom] = useState("");
  const [recivemessage, setrecivemessage] = useState("");
  let socket = useRef(null);
  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef();
  // const reactNavigator = useNavigate();

  function addmedia(stream) {
    connectionRef.current.addStream(stream);
  }

  const videoOn = (video = true, audio = false) => {
    navigator.mediaDevices
      .getUserMedia({ video: video, audio: audio })
      .then((currentStream) => {
        console.log("MyVideooo: ",myVideo)
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const audioOn = (audio = false) => {
    navigator.mediaDevices
      .getUserMedia({ video: video, audio: audio })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((ex) => {
        console.log(ex);
      });
  };

  const videoResume = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
        connectionRef.current.addStream(currentStream);
      });
  };

  const videoOff = () => {
    myVideo.current.srcObject = null;
    stream.getTracks().forEach((track) => track.stop());
    setStream(null);
  };
  useEffect(() => {
    const init = async () => {
      socket.current = await initSocket();
      socket.current.on("connect_error", (err) => handleErrors(err));
      socket.current.on("connect_failed", (err) => handleErrors(err));
      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
      }
      socket.current.on("me", (id) => setMe(id));
      console.log("on me: ",me);
      socket.current.on("callUser", ({ from, name, signal }) => {
        audio.play();
        name = JSON.parse(name);
        setCall({ isReceivingCall: true, from, name, signal });
      });
      socket.current.on("recieve_message", (data) => {
        console.log("on data: ",data);
        setrecivemessage(data.message);
      });
    };
    init();
    videoOn();
    console.log(recivemessage);
  }, []);

  useEffect(() => {
    videoOn(video)
  }, [video])

  const callUser = (id) => {
    setOtherUser(id);
    const peer = new Peer({ initiator: true, trickle: false, stream });
    const user = JSON.parse(sessionStorage.getItem("user")).user;
    console.log("USERRR webrtc: ",user);
    console.log(id);
    console.log(peer);
    const calleruser = { name: user?.name || "Someone" };
    console.log(calleruser);
    let localstream;
    const peer1 = new Peer({ initiator: true, trickle: false, stream });
    peer1.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: JSON.stringify(calleruser),
      });
    });
    peer1.on("stream", (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer1.signal(signal);
    });
    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    const peer2 = new Peer({ initiator: false, trickle: false, stream });
    peer2.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: call.from });
    });
    peer2.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });
    peer2.signal(call.signal);
    connectionRef.current = peer2;
  };

  // const handlemessage=()=>{
  //   console.log(connectionRef.current)
  //   connectionRef.current.on("connect",()=>{
  //     console.log("connect")
  //     connectionRef.current.send("Hii this from calle")
  //    })
  //    connectionRef.current.on("data",(data)=>{
  //     console.log(data)
  //    })
  // }
  const sendMessage = () => {
    console.log("runn sendMessage");
    socket.current.emit("send_message", { message, otherUser });
  };
  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <Webrtccontext.Provider
      value={{
        call,
        audioOn,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        videoOn,
        videoOff,
        message,
        setmessage,
        recivemessage,
        sendMessage,
        socket,
        otherUser,
        connectionRef,
        isLogin,
        setLogin,
        video,
        setVideo,
      }}
    >
      {children}
    </Webrtccontext.Provider>
  );
};

export default Webrtcconnection;
