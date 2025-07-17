import React, { useContext } from "react";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Notification = () => {
  const { answerCall, call, callAccepted, videoOn } = useContext(Webrtccontext);
  return (
    <>
      {call.isReceivingCall &&
        !callAccepted &&
        toast(
          <div className="d-flex">
            <p>{call.name.name} is calling:</p>
            <button
              className="btn btn-dark"
              onClick={() => {
                videoOn();
                answerCall();
              }}
            >
              Answer
            </button>
          </div>
        )}
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Notification;
