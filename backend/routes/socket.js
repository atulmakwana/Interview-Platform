module.exports=function makeSocketConnection({io}){
  return ()=>{
    console.log("socketInit");
    io.on("connection", (socket) => {
          socket.emit("me", socket.id);
         console.log(socket.id)
        socket.on("disconnect", () => {
            socket.broadcast.emit("callEnded")
        });
        socket.on("callUser", ({ userToCall, signalData, from, name }) => {
            io.to(userToCall).emit("callUser", { signal: signalData, from, name });
        });
        socket.on("answerCall", (data) => {
            io.to(data.to).emit("callAccepted", data.signal)
        });
        socket.on("send_message",(data)=>{
            console.log(data)
            socket.to(data.otherUser).emit("recieve_message",data)
        })
        socket.on("code-change",(data)=>{
            console.log(data)
            socket.to(data.otherUser).emit("code-change",data.code)
        })
        socket.on('canvas-data',(data)=>{
            
            socket.to(data.otherUser).emit("canvas-data",data)
        })
    }); 
  }
    
}