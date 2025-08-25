import React, { useContext, useEffect } from "react";
import Main from "../Main/Main";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import "./home.css";
import Videocomponent from "../VideoComponent/Videocomponent";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const { setLogin, callAccepted } = useContext(Webrtccontext);
  useEffect(() => {
    if (!sessionStorage.getItem("loggedIn")) {
      navigate("/login", { replace: true });
    } else {
      setLogin(true);
    }
  }, []);
  return (
    <>
      {!callAccepted && <Main />})
    </>
  );
};

export default Home;
