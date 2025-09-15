import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import "./codeIDE.css";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import Webrtccontext from "../../context/webrtc/Webrtccontext";
import { useNavigate } from "react-router-dom";

const CodeIDE = () => {
  const editorRef = useRef(null);
  const input = useRef("");
  const { socket, otherUser } = useContext(Webrtccontext);
  const navigate = useNavigate();

  const [language, setLanguage] = useState("cpp");
  const [outputText, setOutputText] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isReceivingData, setIsReceivingData] = useState(false);
  
  // Generate unique ID for this CodeIDE instance
  const editorId = `realtimeEditor-${Math.random().toString(36).substr(2, 9)}`;

  // Language configuration
  const getLanguageConfig = (lang) => {
    const configs = {
      cpp: { id: 54, mode: "text/x-c++src", name: "C++" },
      c: { id: 50, mode: "text/x-csrc", name: "C" },
      py: { id: 71, mode: "python", name: "Python 3" },
      js: { id: 63, mode: "javascript", name: "Node.js" },
      java: { id: 62, mode: "text/x-java", name: "Java" },
      go: { id: 60, mode: "go", name: "Go" },
      cs: { id: 51, mode: "text/x-csharp", name: "C#" }
    };
    return configs[lang] || configs.cpp;
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!sessionStorage.getItem("loggedIn")) {
      navigate("/login", { replace: true });
      return;
    }

    // Initialize CodeMirror
    function initEditor() {
      const editor = Codemirror.fromTextArea(
        document.getElementById(editorId),
        {
          mode: getLanguageConfig(language).mode,
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          indentUnit: 4,
          smartIndent: true,
        }
      );

      editor.setSize("100%", "100%");
      editorRef.current = editor;

      // Set initial Hello World code based on language
      const initialCodes = {
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
        c: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
        py: `# Python program
print("Hello World!")`,
        js: `// JavaScript program
console.log("Hello World!");`,
        java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
        go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}`,
        cs: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World!");
    }
}`
      };
      
      editor.setValue(initialCodes[language] || initialCodes.cpp);

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
    
    // Cleanup function
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, []);

  // Listen for remote code updates
  useEffect(() => {
    const handleCodeChange = (code) => {
      if (code && editorRef.current && !isReceivingData) {
        setIsReceivingData(true);
        editorRef.current.setValue(code);
        setTimeout(() => setIsReceivingData(false), 100);
      }
    };

    const handleInputChange = (input) => {
      if (input !== undefined && !isReceivingData) {
        setIsReceivingData(true);
        setInputText(input);
        if (input.current) {
          input.current.value = input;
        }
        setTimeout(() => setIsReceivingData(false), 100);
      }
    };

    const handleOutputChange = (output) => {
      if (output !== undefined && !isReceivingData) {
        setIsReceivingData(true);
        setOutputText(output);
        setTimeout(() => setIsReceivingData(false), 100);
      }
    };

    const handleLanguageChange = (lang) => {
      if (lang && !isReceivingData) {
        setIsReceivingData(true);
        setLanguage(lang);
        if (editorRef.current) {
          editorRef.current.setOption("mode", getLanguageConfig(lang).mode);
          
          // Set the corresponding Hello World code for the new language
          const defaultCodes = {
            cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
            c: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
            py: `# Python program
print("Hello World!")`,
            js: `// JavaScript program
console.log("Hello World!");`,
            java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
            go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}`,
            cs: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World!");
    }
}`
          };
          
          editorRef.current.setValue(defaultCodes[lang] || defaultCodes.cpp);
        }
        setTimeout(() => setIsReceivingData(false), 100);
      }
    };

    if (socket.current) {
      socket.current.on("code-change", handleCodeChange);
      socket.current.on("input-change", handleInputChange);
      socket.current.on("output-change", handleOutputChange);
      socket.current.on("language-change", handleLanguageChange);
    }

    return () => {
      if (socket.current) {
        socket.current.off("code-change", handleCodeChange);
        socket.current.off("input-change", handleInputChange);
        socket.current.off("output-change", handleOutputChange);
        socket.current.off("language-change", handleLanguageChange);
      }
    };
  }, [socket, isReceivingData]);

  const setlang = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    
    // Update editor mode when language changes
    if (editorRef.current) {
      editorRef.current.setOption("mode", getLanguageConfig(newLang).mode);
      
      // Set default Hello World code examples
      const defaultCodes = {
        cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello World!" << endl;
    return 0;
}`,
        c: `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`,
        py: `# Python program
print("Hello World!")`,
        js: `// JavaScript program
console.log("Hello World!");`,
        java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
        go: `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}`,
        cs: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello World!");
    }
}`
      };
      
      // Set Hello World code for the new language
      const newCode = defaultCodes[newLang] || "";
      editorRef.current.setValue(newCode);
      
      // Emit language change and code change to other user
      if (socket?.current && otherUser && !isReceivingData) {
        socket.current.emit("language-change", {
          language: newLang,
          otherUser: otherUser
        });
        
        // Also emit the new code so both users see the same Hello World code
        socket.current.emit("code-change", {
          code: newCode,
          otherUser: otherUser
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);
    
    // Emit input change to other user
    if (socket?.current && otherUser && !isReceivingData) {
      socket.current.emit("input-change", {
        input: value,
        otherUser: otherUser
      });
    }
  };

  const codesubmit = async (e) => {
    e.preventDefault();
    
    if (!editorRef.current) {
      setOutputText("Error: Editor not initialized");
      return;
    }

    const code = editorRef.current.getValue();
    const userInput = input.current.value;
    
    if (!code.trim()) {
      setOutputText("Error: Please enter some code to execute");
      return;
    }

    setIsExecuting(true);
    setOutputText("Executing...");

    try {
      const languageConfig = getLanguageConfig(language);
      
      // First, submit the code
      const submitResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RapidAPI-Key': '0feda8bc37msh32e849b04b6bc6bp18b92ejsn14957b016d79',
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
        body: JSON.stringify({
          source_code: code,
          language_id: languageConfig.id,
          stdin: userInput,
          cpu_time_limit: "5.0",
          memory_limit: 128000
        }),
      });

      const submitResult = await submitResponse.json();
      
      if (!submitResult.token) {
        throw new Error("Failed to submit code");
      }

      // Poll for results
      const token = submitResult.token;
      let result = null;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const resultResponse = await fetch(`https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`, {
          headers: {
            'X-RapidAPI-Key': '0feda8bc37msh32e849b04b6bc6bp18b92ejsn14957b016d79',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          }
        });

        result = await resultResponse.json();
        
        if (result.status && result.status.id > 2) { // Status 3 = Accepted, 4+ = Error states
          break;
        }
        
        attempts++;
      }

      if (!result) {
        throw new Error("Execution timeout");
      }

      // Display results
      let output = "";
      
      if (result.status.id === 3) { // Accepted
        output = result.stdout || "No output";
      } else if (result.status.id === 6) { // Compilation Error
        output = `Compilation Error:\n${result.compile_output || "Unknown compilation error"}`;
      } else if (result.status.id === 5) { // Time Limit Exceeded
        output = "Time Limit Exceeded";
      } else if (result.status.id === 4) { // Wrong Answer
        output = `Wrong Answer\nExpected: ${result.expected_output || "N/A"}\nYour Output: ${result.stdout || "N/A"}`;
      } else if (result.stderr) {
        output = `Runtime Error:\n${result.stderr}`;
      } else {
        output = `Error: ${result.status.description || "Unknown error"}`;
      }

      setOutputText(output);
      
      // Emit output change to other user
      if (socket?.current && otherUser) {
        socket.current.emit("output-change", {
          output: output,
          otherUser: otherUser
        });
      }

    } catch (error) {
      console.error("Execution error:", error);
      const errorMessage = `Error: ${error.message}`;
      setOutputText(errorMessage);
      
      // Emit error to other user
      if (socket?.current && otherUser) {
        socket.current.emit("output-change", {
          output: errorMessage,
          otherUser: otherUser
        });
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="font-size d-flex flex-row" style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <form className="d-flex flex-column flex-fill" onSubmit={codesubmit}>
        <div
          className="d-flex flex-fill rounded-3 p-1"
          style={{ backgroundColor: "#272935", height: "calc(100vh - 120px)", width: "calc(100vw - 400px)" }}
        >
          <textarea className="h-75 border border-white" id={editorId} />
        </div>

        <div className="d-flex justify-content-center mt-4 mb-2">
          <select
            className="font-size px-4 py-2 mx-2 btn btn-secondary text-white"
            onChange={setlang}
            value={language}
            disabled={isExecuting}
          >
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="py">Python 3</option>
            <option value="js">JavaScript (Node.js)</option>
            <option value="java">Java</option>
            <option value="go">Go</option>
            <option value="cs">C#</option>
          </select>
          <button 
            className={`mx-2 px-4 btn ${isExecuting ? 'btn-warning' : 'btn-dark'}`} 
            type="submit"
            disabled={isExecuting}
          >
            <PlayCircleOutlineOutlinedIcon fontSize="large" />
            {isExecuting ? 'Executing...' : 'Run Code'}
          </button>
        </div>
      </form>

      <div className="d-flex flex-column ms-2 mt-2 me-2" style={{ width: "380px", height: "calc(100vh - 40px)" }}>
        <h5>Input (stdin):</h5>
        <textarea 
          className="w-100 mt-1 form-control" 
          ref={input}
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter input for your code here..."
          style={{ 
            fontFamily: 'monospace', 
            fontSize: '14px',
            height: '120px',
            resize: 'none'
          }}
        />
        <h5 className="mt-3">Output:</h5>
        <textarea
          value={outputText}
          className="w-100 mt-1 form-control"
          readOnly
          style={{ 
            fontFamily: 'monospace', 
            fontSize: '14px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ced4da',
            height: 'calc(100vh - 300px)',
            resize: 'none'
          }}
          placeholder="Output will appear here..."
        />
      </div>
    </div>
  );
};

export default CodeIDE;