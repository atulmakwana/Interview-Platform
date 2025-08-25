import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import Board from "../Board/Board";
import "./whiteboard.css";
const Whiteboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem('loggedIn')) {
      navigate("/login", { replace: true });
      return;
    }
  }, []);
  return (
    <div className="m-0 p-1 vw-100 vh-100">
      <Board />
    </div>
  );
};

export default Whiteboard;
