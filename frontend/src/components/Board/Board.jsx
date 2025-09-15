import React, { useRef, useState, useEffect, useContext } from "react";
import "./board.css";
import Webrtccontext from "../../context/webrtc/Webrtccontext";

export default function Board() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const { socket, otherUser } = useContext(Webrtccontext);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("draw");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const canvas = canvasRef.current;
    // Keep the previous board size from CSS (.board class)
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = "source-over";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current && tool === "draw") {
      ctxRef.current.strokeStyle = color;
    }
  }, [color, tool]);

  // Socket event listeners for real-time drawing
  useEffect(() => {
    const handleCanvasData = (data) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      if (data.action === "draw") {
        ctx.beginPath();
        ctx.moveTo(data.startX, data.startY);
        ctx.lineTo(data.endX, data.endY);
        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.lineWidth;
        ctx.globalCompositeOperation = data.globalCompositeOperation;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      } else if (data.action === "clear") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (data.action === "color-change") {
        setColor(data.color);
      } else if (data.action === "tool-change") {
        setTool(data.tool);
      }
    };

    if (socket?.current) {
      socket.current.on("canvas-data", handleCanvasData);
    }

    return () => {
      if (socket?.current) {
        socket.current.off("canvas-data", handleCanvasData);
      }
    };
  }, [socket]);

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    setIsDrawing(true);
    
    // Store starting position for socket emission
    canvasRef.current.startX = x;
    canvasRef.current.startY = y;
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === "draw") {
      ctxRef.current.globalCompositeOperation = "source-over";
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    } else if (tool === "erase") {
      ctxRef.current.globalCompositeOperation = "destination-out";
      ctxRef.current.lineTo(x, y);
      ctxRef.current.stroke();
    }

    // Emit drawing data to other user (more frequent updates for smoother lines)
    if (socket?.current && otherUser) {
      socket.current.emit("canvas-data", {
        action: "draw",
        startX: canvasRef.current.startX,
        startY: canvasRef.current.startY,
        endX: x,
        endY: y,
        color: color,
        lineWidth: 3,
        globalCompositeOperation: tool === "draw" ? "source-over" : "destination-out",
        otherUser: otherUser
      });
      
      // Update start position for next segment
      canvasRef.current.startX = x;
      canvasRef.current.startY = y;
    }
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const clearBoard = () => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    
    // Emit clear action to other user
    if (socket?.current && otherUser) {
      socket.current.emit("canvas-data", {
        action: "clear",
        otherUser: otherUser
      });
    }
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
    
    // Emit color change to other user
    if (socket?.current && otherUser) {
      socket.current.emit("canvas-data", {
        action: "color-change",
        color: newColor,
        otherUser: otherUser
      });
    }
  };

  const handleToolChange = (newTool) => {
    setTool(newTool);
    
    // Emit tool change to other user
    if (socket?.current && otherUser) {
      socket.current.emit("canvas-data", {
        action: "tool-change",
        tool: newTool,
        otherUser: otherUser
      });
    }
  };

  return (
    <div className="sketch">
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <canvas
          ref={canvasRef}
          className="board"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            startDrawing(touch);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            const touch = e.touches[0];
            draw(touch);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopDrawing();
          }}
        />
        {/* Toolbar inside board */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255, 255, 255, 0.8)",
            padding: "5px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={() => handleToolChange("draw")}
            className={tool === "draw" ? "active-btn" : "inactive-btn"}
          >
            Draw
          </button>
          <button
            onClick={() => handleToolChange("erase")}
            className={tool === "erase" ? "active-btn" : "inactive-btn"}
          >
            Erase
          </button>
          <button onClick={clearBoard} className="inactive-btn">
            Clear All
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
