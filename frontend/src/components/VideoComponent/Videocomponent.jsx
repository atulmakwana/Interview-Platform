import React, {  useContext, useEffect, useRef, useState } from "react";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import Bottombar from "../Bottombar/Bottombar";
import Image from '../Sidebar/profileImage.jpg'
import Videocomponent2 from "./videocomponent2";
const Videocomponent = () => {
  const {myVideo, stream, callAccepted, video} = useContext(Webrtccontext);
  console.log("video",video);
  return (
    <>
      {callAccepted && <div className="d-flex flex-column justify-content-center" style={{width: "180.7vh"}}>
        {stream ? (
          <video
            style={{ objectFit: "cover", height: "92.8vh" }}
            ref={myVideo}
            playsInline
            autoPlay
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "92.8vh" }}
          >
            <img src={Image} height={300}></img>
          </div>
        )}
        <Bottombar />
      </div>}
    </>
  );
};

export default Videocomponent;