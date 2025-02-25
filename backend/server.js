const http = require('http');
const app = require('./app')
const port = 3002
const {initializeSocket} = require('./socket')
const server = http.createServer(app);

initializeSocket(server);

server.listen(port,()=>{
    console.log(`server is running on the port http://localhost:${port}`);
});
