const socketIo = require('socket.io')


let io;
const initializeSocket = (server)=>{
    io = socketIo(server,{
        cors:{
          origin:'*',
          methods:['GET','POST','PUT','DELETE']
        }
    })

    io.on('connection', socket => {

        // console.log("User connected:", socket.id);


      })

}

const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};


module.exports = {initializeSocket,getIO}