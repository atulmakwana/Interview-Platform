import React, { useContext, useState } from "react";
import "./bottombar.css";
import CallEndIcon from "@mui/icons-material/CallEnd";
import Chatbox from "../Chatbox/Chatbox";
import Webrtcconnection from "../../context/webrtc/webrtcconnection";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { useEffect } from "react";
const Bottombar = () => {
  const [microphone, setMicrophone] = useState(false);
  const { audioOn, videoOn, videoOff, handlemessage, leaveCall, video, setVideo } = useContext(Webrtccontext);
  const turnOn = (event) => {
    let id = event.target.id;
    let icon = event.target;
    if (id == "video") {
      setVideo(!video);
    } else if (id == "microphone") {
      setMicrophone(!microphone);
    }
    if (icon.classList.contains(`fa-${id}`)) {
      icon.classList.remove(`fa-${id}`);
      icon.classList.add(`fa-${id}-slash`);
      icon.classList.add("button-icons-off");
    } else {
      icon.classList.remove(`fa-${id}-slash`);
      icon.classList.remove("button-icons-off");
      icon.classList.add(`fa-${id}`);
    }
  };
  useEffect(() => {
    video ? videoOn(video, microphone) : videoOff();
  }, [video]);
  useEffect(() => {
    audioOn(microphone)
  }, [microphone])
  return (
    <div className="d-flex justify-content-center">
      <nav className="border-3 d-flex flex-fill border border-secondary bg-white bottombar-width px-5 navbar navbar-expand navbar-white">
        <div className="navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li
              id="microphone"
              className="nav-link fa-solid fa-microphone-slash nav-item active rounded-pill button-icons button-icons-off me-3"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Mic"
              onClick={(event) => turnOn(event)}
            />
            <li
              id="video"
              className="nav-link fa-solid fa-video nav-item rounded-pill button-icons me-3"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Video"
              onClick={(event) => turnOn(event)}
            />
            <li
              className="nav-link nav-item rounded-pill button-icons-off me-3"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="End"
              onClick={leaveCall}
            >
              <CallEndIcon />
            </li>
            <li
              className="nav-link nav-item rounded-pill button-icons"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              title="Chat"
            >
              <i className="fas fa-comment-alt" onClick={handlemessage} />
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Bottombar;
