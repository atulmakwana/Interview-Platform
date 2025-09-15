import React, { useState, useEffect, useContext } from "react";
import "./video.css";
import { Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
const InterviewPage = (props) => {
  const {
    callAccepted,
    callEnded,
    videoOn,
    callUser,
  } = useContext(Webrtccontext);
  const { id } = useParams();
  const call = () => {
    // ensure media is active before calling
    videoOn();
    if (!id) return;
    callUser(id);
  };
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("loggedIn")) {
      navigate("/login", { replace: true });
    }
    async function checkLoginStatus() {
      try {
        const request = await fetch(
          "http://localhost:3006/auth/check-login-status",
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          }
        );
        const res = await request.json();
        setIsLoggedIn(res.isLoggedIn);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    checkLoginStatus();
  }, []);
  useEffect(() => {
    if (callAccepted && !callEnded) {
      navigate("/", { replace: true });
    }
  }, [callAccepted, callEnded]);
  if (isLoading) {
    return <Spinner animation="border" />;
  } else if (isLoggedIn) {
    return (
      <div className="d-flex justify-content-center align-items-center vw-100 flex-column">
        <h2 className="mb-5">Interviewer is waiting...</h2>
        <button
          className="btn btn-primary p-3 fs-5"
          aria-label="call"
          onClick={call}
        >
          Call Interviewer
        </button>
      </div>
    );
  } else {
    navigate("/login");
    return null;
  }
};

export default InterviewPage;
