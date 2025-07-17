import React, {  useContext, useEffect, useRef } from "react";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import Bottombar from "../Bottombar/Bottombar";
import Image from '../Sidebar/profileImage.jpg'
const Videocomponent2 = () => {
  const {userVideo, callAccepted} = useContext(Webrtccontext);
  return (
    <>
      {callAccepted && userVideo && (
          <video
            className="me-3 w-25 img-fluid rounded-4 float-end position-absolute bottom-0 end-0"
            style={{ marginBottom: "80px" }}
            ref={userVideo}
            playsInline
            autoPlay
          />
        )}
    </>
  );
};




export default Videocomponent2;