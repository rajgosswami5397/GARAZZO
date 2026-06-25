let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.on('join', (room) => {
      socket.join(room);
    });
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });
};

const getIO = () => ioInstance;

module.exports = { initSocket, getIO };
