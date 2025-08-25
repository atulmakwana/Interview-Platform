import React, { useState, useEffect, useRef, useContext } from "react";
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
  const input = useRef("");
  const { socket, otherUser } = useContext(Webrtccontext);
  const navigate = useNavigate();

  const [language, setLanguage] = useState("c++");
  const [outputText, setOutputText] = useState("");

  // Redirect to login if not logged in
  useEffect(() => {
    if (!sessionStorage.getItem("loggedIn")) {
      navigate("/login", { replace: true });
      return;
    }

    // Initialize CodeMirror
    function initEditor() {
      const editor = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true }, // You may enhance this later based on `language`
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editor.setSize("100%", "100%");
      editorRef.current = editor;

      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const updatedCode = instance.getValue();
        if (origin !== "setValue" && socket?.current) {
          socket.current.emit("code-change", {
            code: updatedCode,
            otherUser,
          });
        }
      });
    }

    initEditor();
  }, []);

  // Listen for remote code updates
  useEffect(() => {
    const handleCodeChange = ({ code }) => {
      if (code && editorRef.current) {
        editorRef.current.setValue(code);
      }
    };

    if (socket.current) {
      socket.current.on("code-change", handleCodeChange);
    }

    return () => {
      if (socket.current) {
        socket.current.off("code-change", handleCodeChange);
      }
    };
  }, [socket]);

  const setlang = (e) => {
    setLanguage(e.target.value);
  };

  const codesubmit = async (e) => {
    e.preventDefault();
    const detail = {
      code: editorRef.current.getValue(),
      language: language,
      input: input.current.value,
    };
    try {
      const res = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '0feda8bc37msh32e849b04b6bc6bp18b92ejsn14957b016d79',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          source_code: editorRef.current.getValue(),
          language_id: 63,       // e.g. Python 3
          stdin: input.current.value,
          // optional time_limit, memory_limit
        }),
      });
      console.log(res)
      const result = await res.json();
      // result.stdout, result.stderr, result.time, result.exit_code, etc.

      setOutputText(res.data.output || res.data.error || "No output");
    } catch (error) {
      console.error(error);
      setOutputText("Error during execution.");
    }
  };

  return (
    <div className="font-size my-3 ms-3 d-flex flex-row vw-100">
      <form className="d-flex flex-column flex-fill" onSubmit={codesubmit}>
        <div
          className="d-flex flex-fill rounded-3 p-1"
          style={{ backgroundColor: "#272935", height: "860px", width: "1340px" }}
        >
          <textarea className="h-75 border border-white" id="realtimeEditor" />
        </div>

        <div className="d-flex justify-content-center mt-4 mb-2">
          <select
            className="font-size px-4 py-2 mx-2 btn btn-secondary text-white"
            onChange={setlang}
            value={language}
          >
            <option value="cpp">cpp</option>
            <option value="java">java</option>
            <option value="py">py</option>
            <option value="js">js</option>
            <option value="c">c</option>
            <option value="go">go</option>
            <option value="cs">cs</option>
          </select>
          <button className="mx-2 px-4 btn btn-dark" type="submit">
            <PlayCircleOutlineOutlinedIcon fontSize="large" />
          </button>
        </div>
      </form>

      <div className="d-flex flex-column ms-4 mt-2 me-3" style={{ width: "350px" }}>
        <h5>Input:</h5>
        <textarea className="w-100 h-30 mt-1" rows="4" cols="25" ref={input} />
        <h5 className="mt-4">Output:</h5>
        <textarea
          value={outputText}
          className="w-100 h-30 mt-1"
          cols="25"
          rows="5"
          readOnly
        />
      </div>
    </div>
  );
};

export default CodeIDE;