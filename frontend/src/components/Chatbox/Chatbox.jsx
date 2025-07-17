import React, { useContext } from "react";
import "./chatbox.css";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
// const Bottombar = () => {

const Chatbox = () => {
  const { message, setmessage, recivemessage, sendMessage } = useContext(Webrtccontext);
  const message1 = recivemessage;
  return (
    <>
      {/* <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasRightLabel">Offcanvas right</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body">
      <h1>
        message:{message1}
      </h1>
   
  
      
  </div> 
  <div className="container my-3">
   <input  type="text" placeholder='Message' onChange={(event) => {
        setmessage(event.target.value);
      }} />
      <button onClick={()=>{sendMessage()}}>Send Message</button>
   </div>
  </div>   */}

      {/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button> */}

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header ">
              <h5 className="modal-title" id="exampleModalLabel">
                Chat
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h1>message:{message1}</h1>
              <div className="container my-3">
                <input
                  type="text"
                  placeholder="Message"
                  onChange={(event) => {
                    setmessage(event.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    sendMessage();
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
            {/* <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
