import React, { useState, useEffect, useContext } from "react";
import Image from "../Sidebar/profileImage.jpg";
import { useNavigate } from "react-router-dom";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { ToastContainer, toast } from "react-toastify";

function Main() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("interviewee");
  const navigate = useNavigate();
  const { me, isLogin } = useContext(Webrtccontext);
  const generateMeetingCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };
  const sendLink = async () => {
    const userEmail = JSON.parse(sessionStorage.getItem("user")).user.email;
    console.log(userEmail); 
    console.log(`-------------\n\n${me}\n\n-----------`)
    try {
      const response = await fetch(`http://localhost:3006/api/email/send`, {
        // const response = await fetch(`https://interviewplatformbackend.onrender.com/api/email/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authtoken: sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          from: `${userEmail}`,
          to: `${email}`,
          displayName: "InterViewPlatform",
          subject: "Interview Platform",
          // Share my current socket id as meeting id so the interviewee can call me directly
          message: `Join Interview Using this link http://localhost:3000/InterviewPage/${me}`,
        }),
      });
      if (!response.ok) {  
        setEmail(""); 
        toast.error(response.error || "Invalid email");
        return false;
      }
      return true; 
      } 
      catch (error) {
        console.log(error);
      }
  };
  const handleClick = async (e) => {
    if (e.target.innerText === "Create meeting") {
      const success = await sendLink();
      if (success) {
        toast(
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <p>Wait till Interviewee gives call</p>
          </div>
        );
      }
    } else {
      navigate(`/InterviewPage/${email}`);
    }
  };
  useEffect(() => {
    if (!sessionStorage.getItem('loggedIn')) {
      console.log("Navigate to login")
      navigate("/login", { replace: true });
    }
    else {
      (async () => {
        try {
          console.log("Mainjsx fetching : ");
          const request = await fetch("http://localhost:3006/auth/login/success", {
            // const request = await fetch("https://interviewplatformbackend.onrender.com/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
              // "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          });
          // Check if status is not 200
          if (request.status !== 200) {
            console.warn("User not authenticated. Redirecting to login.");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("loggedIn");
            navigate("/login", { replace: true });
            return;
          }
          const res = await request.json();
          console.log("Mainjsx after calling login : ",res);
          if (request.status == 200) {
            console.log("MAIN.JSX: res.user.AUTHTOKEN: ",res.user);
            console.log("MAIN.JSX sessionStorage.getItem(loggedIn): ",sessionStorage.getItem("loggedIn"));
            sessionStorage.setItem("token", res.user.AUTHTOKEN);
            sessionStorage.setItem("user", JSON.stringify(res.user));
          }
        } catch (error) {
        console.error("Error during auth check:", error);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("loggedIn");
        navigate("/login", { replace: true });
      }
      })();
    }
  }, []);
  
  return (
    <div className="d-flex vh-100 vw-100 align-items-center text-dark ps-5">
      <div className="d-flex align-items-start text-container flex-column flex-fill ps-5">
        <h1 className="mb-5">Who are you?</h1>
        <div className="d-flex justify-content-center align-items-center p-2 me-3 mb-3">
          <input
            type="radio"
            id="interviewee"
            name="role"
            style={{ width: "20px", height: "20px" }}
            checked={role == "interviewee"}
            onChange={() => setRole("interviewee")}
          />
          <label className="h5 m-0 ms-2 me-5" htmlFor="interviewee">
            Interviewee
          </label>
          <input
            type="radio"
            id="interviewer"
            name="size"
            style={{ width: "20px", height: "20px" }}
            checked={role == "interviewer"}
            onChange={() => setRole("interviewer")}
          />
          <label className="h5 m-0 ms-2 me-3" htmlFor="interviewer">
            Interviewer
          </label>
        </div>
        <div className="d-flex justify-content-center me-3 my-5">
          <button className="btn btn-dark sign-in-button fs-4 ps-4 py-2 pe-4 text-light me-5" onClick={handleClick}>
            {role == "interviewee" ? "Join meeting" : "Create meeting"}
          </button>
          <input
            className="my-1 p-2"
            type="text"
            value={email}
            placeholder={role == "interviewer" ? "Email Id" : "Meeting Id"}
            onChange={(e)=>{setEmail(e.target.value)}}
          />
        </div>
      </div>
      <div className="d-flex flex-fill">
        <img className="img-fluid" width={600} src={Image} alt="" />
      </div>
    </div>
  );
}

export default Main;
