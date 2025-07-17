import React, { useState } from "react";
import { useRef, useEffect, useContext } from "react";
import axios from "axios";
import "./codeIDE.css";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { useNavigate } from "react-router-dom";
const CodeIDE = () => {
  const editorRef = useRef(null);
  const code = useRef("");
  const input = useRef("");
  const output = useRef("");
  const [language, setLanguage] = useState("c++");
  const { socket, otherUser } = useContext(Webrtccontext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem('loggedIn')) {
      navigate("/login", { replace: true });
      return;
    }
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoClosetags: true,
          autoClodeBrackets: true,
          lineNumbers: true,
        }
      );
      editorRef.current.setSize("100%", "100%");
      editorRef.current.on("change", (instance, changes) => {
        console.log("changes", changes);
        const { origin } = changes;
        const code = instance.getValue();
        console.log(code);
        if (origin !== "setValue") {
          socket.current.emit("code-change", {
            code,
            otherUser,
          });
        }
      });
    }
    init();
  }, []);

  useEffect(() => {
    if (socket.current) {
      socket.current.on("code-change", (code) => {
        console.log(code);
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
  }, [socket.current]);

  const setlang = (e) => {
    console.log(e);
    setLanguage(e.target.value);
  };

  const codesubmit = async (e) => {
    e.preventDefault();
    const detail = {
      code: code.current.value,
      language: language,
      input: input.current.value,
    };
    try {
      const res = await axios.post("https://api.codex.jaagrav.in/", detail);
      console.log(res.data);
      output.current.value = res.data.output;
      if(res.data.error){
        output.current.value=res.data.error
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="font-size my-3 ms-3 d-flex flex-row vw-100">
      <form className="d-flex flex-column flex-fill" onSubmit={codesubmit}>
        <div
          className="d-flex flex-fill rounded-3 p-1"
          style={{ backgroundColor: "#272935", height: '860px', width: '1340px'}}
        >
          <textarea
            className="h-75 border border-white"
            id="realtimeEditor"
            ref={code}
          />
        </div>
        <div className="d-flex justify-content-center mt-4 mb-2">
          <select
            className="font-size px-4 py-2 mx-2 btn btn-secondary text-white"
            onChange={setlang}
          >
            <option>cpp</option>
            <option>java</option>
            <option>py</option>
            <option>js</option>
            <option>c</option>
            <option>go</option>
            <option>cs</option>
          </select>
          <button className="mx-2 px-4 btn btn-dark" type="submit">
            <PlayCircleOutlineOutlinedIcon fontSize="large" />
          </button>
        </div>
      </form>
      <div className="d-flex flex-column ms-4 mt-2 me-3" style={{width: '350px'}}>
        <h5>Input:</h5>
        <textarea className="w-100 h-30 mt-1" rows="4" cols="25" ref={input} />
        <h5 className="mt-4">Output:</h5>
        <textarea
          value={output.current.value}
          className="w-100 h-30 mt-1"
          cols="25"
          rows="5" readOnly
          ref={output}
        />
      </div>
    </div>
  );
};

export default CodeIDE;
