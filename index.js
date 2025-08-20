// const { Socket } = require("socket.io");

// const io = require("socket.io")(8900 ,{
//     cors:{
//         origin: "http://localhost:3000",
//     }
// });

// io.on("connection", (Socket)=>{
//     console.log("a user connected")
// })

//////////////////////////////////////////////////////////////////////////////////////////

// const { Server } = require("socket.io"); // Note: Use "Server" not "Socket"

// const io = new Server(8900, {
//     cors: {
//         origin: "http://localhost:3000",
//     }
// });

// let users = [];

// const addUser=(userId,socketId)=>{
//     !users.some(user=>user.userId === userId) &&
//     users.push({ userId, socketId});
// }

// io.on("connection", (socket) => { // Note: lowercase 'socket' parameter
//     console.log("a user connected");
//     //take userId and socketId from user
//     socket.on("addUser",(userId)=>{
//      addUser(userId,socket.id);
//      io.emit("getUsers", users);
//     });
// });



///////////////////////////////////////////////////////////////////////////////

// const { Server } = require("socket.io");

// const io = new Server(8900, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"]  // Added methods for CORS
//   },
//   transports: ["websocket"]  // Force WebSocket transport
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   !users.some(user => user.userId === userId) &&
//     users.push({ userId, socketId });
// }

// const removeUser = (socketId)=>{
//   users = users.filter(user=>user.socketId !== socketId)
// };

// const getUser = (userId)=>{
//   return users.find(user=>user.userId === userId)
// }

// io.on("connection", (socket) => {
// //when connect 
//   console.log("a user connected");
  
//   // Take userId and socketId from user
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

// // send and get message 
// socket.on("sendMessage",({senderId,receiverId,text})=>{
//        const user = getUser(receiverId);
//        io.to(user.socketId).emit("getMessage",{
//         senderId,
//         text,
//        });
// });

//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log("a user disconnected");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });


////////////////////////////////////////////////////////
const { Server } = require("socket.io");

const io = new Server(8900, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  },
  transports: ["websocket"]
});

let users = [];

const addUser = (userId, socketId) => {
  // Remove any existing user with same userId to prevent duplicates
  users = users.filter(user => user.userId !== userId);
  users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find(user => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  
  // Take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users.map(user => user.userId));
  });

  // Send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("a user disconnected");
    removeUser(socket.id);
    io.emit("getUsers", users.map(user => user.userId));
  });
});