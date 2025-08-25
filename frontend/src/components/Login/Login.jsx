import React, { useContext, useEffect } from "react";
import Image from "./login-background.jpg";
import googleIcon from "./google-icon.png"
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { useNavigate } from "react-router-dom";

function Login() {
  const {setLogin} = useContext(Webrtccontext);
  const navigate = useNavigate();
  console.log("In Login.jSX");
  const loginWithGoogle = (ev) => {
    ev.preventDefault();
    sessionStorage.setItem('loggedIn', true)
    setLogin(true);
    window.open("http://localhost:3006/auth/google", "_self");
    // window.open("https://interviewplatformbackend.onrender.com/auth/google", "_self");
  };
  useEffect(() => {
    if(sessionStorage.getItem('loggedIn')) {
      navigate('/')
    }
  }, [])
  return (
    <div
      className="d-flex vh-100 vw-100 align-items-center text-light ps-5"
      style={{ backgroundImage: `url(${Image})` }}
    >
      <div className="d-flex align-items-start text-container flex-column flex-fill">
        <h1 className="mb-2">Welcome to</h1>
        <h1 className="mb-5">Interview Platform</h1>
        <p className="mb-5 fs-2">Start your Journey Today...!!!</p>
        <button
          onClick={loginWithGoogle}
          className="btn btn-dark sign-in-button fs-3 ps-4 pt-2 pb-2 pe-4 text-light mt-5 mb-5 d-flex align-items-center justify-content-between"
        >
          <img src={googleIcon} className="me-3 google-icon" height={35} width={35} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
