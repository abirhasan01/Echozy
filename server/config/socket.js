const { Server } = require("socket.io");
const userSoketMap = {};
let io;


const initSocket = (server) => {

  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if (userId) userSoketMap[userId] = socket.id;

    io.emit("getOnlineUsers", Object.keys(userSoketMap));

    socket.on("disconnect", () => {
      delete userSoketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSoketMap));
    });
  });
};

const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
  userSoketMap,
};
