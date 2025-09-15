module.exports=function makeSocketConnection({io}){
  return ()=>{
    console.log("socketInit");
    io.on("connection", (socket) => {
        socket.emit("me", socket.id);
        console.log(socket.id)
        socket.on("disconnect", () => {
            console.log("disconnect: ")
            socket.broadcast.emit("callEnded")
        });
        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            console.log("callUser: ",{ userToCall, from, name })
            io.to(userToCall).emit("callUser", { signal: signalData, from, name });
        });
        socket.on("answerCall", (data) => {
            console.log("answerCall: ",data)
            io.to(data.to).emit("callAccepted", data.signal)
        });
        socket.on("send_message",(data)=>{
            console.log("send_message: ",data)
            socket.to(data.otherUser).emit("recieve_message",data)
        })
        socket.on("code-change",(data)=>{
            console.log("code-change: ",data)
            socket.to(data.otherUser).emit("code-change",data.code)
        })
        socket.on("canvas-data",(data)=>{
            console.log("canvas-data: ",data)
            socket.to(data.otherUser).emit("canvas-data",data)
        })
        socket.on("input-change",(data)=>{
            console.log("input-change: ",data)
            socket.to(data.otherUser).emit("input-change",data.input)
        })
        socket.on("output-change",(data)=>{
            console.log("output-change: ",data)
            socket.to(data.otherUser).emit("output-change",data.output)
        })
        socket.on("language-change",(data)=>{
            console.log("language-change: ",data)
            socket.to(data.otherUser).emit("language-change",data.language)
        })
    }); 
  }
    
}