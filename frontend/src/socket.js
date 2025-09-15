import { io } from 'socket.io-client';

export const initSocket = async () => {
    const options = {
        forceNew: true,
        reconnectionAttempts: Infinity,
        timeout: 10000,
        withCredentials: true,
        transports: ['websocket','polling'], // Forces WebSocket
    };
    return io('http://localhost:3006', options);
};

// import { io } from 'socket.io-client';

// export const initSocket = async () => {
//     const options = {
//         'force new connection': true,
//         reconnectionAttempt: 'Infinity',
//         timeout: 10000,
//         Credential:true,
//         transports: ['websocket'],
//     };
//     // return io('http://localhost:3006', options);
//     return io('https://interviewplatformbackend.onrender.com', options);
// };