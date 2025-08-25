import React, { useRef, useState, useEffect } from "react";
import "./board.css";

export default function Board() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

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
    ctx.lineWidth = 3;
    ctx.strokeStyle = color;
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current && tool === "draw") {
      ctxRef.current.strokeStyle = color;
    }
  }, [color, tool]);

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();

    if (tool === "draw") {
      ctxRef.current.globalCompositeOperation = "source-over";
      ctxRef.current.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctxRef.current.stroke();
    } else if (tool === "erase") {
      ctxRef.current.globalCompositeOperation = "destination-out";
      ctxRef.current.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctxRef.current.stroke();
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
            onClick={() => setTool("draw")}
            className={tool === "draw" ? "active-btn" : "inactive-btn"}
          >
            Draw
          </button>
          <button
            onClick={() => setTool("erase")}
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
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
