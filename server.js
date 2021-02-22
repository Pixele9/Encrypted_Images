const express = require('express');
const app = express();
const fs = require('fs');
const path = require("path")

app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, function(){
  console.log('listening on port: 3000');
});

const SocketIO = require("socket.io")
const io = SocketIO(server)

io.on('connection', (socket) => {
    console.log("new connection: ", socket.id)    
    fs.readFile('image.png', (err, data) => {
        socket.emit('clientImgConversion', { image: true, buffer: data });
        socket.emit('serverImgConversion', "data:image/png;base64,"+ data.toString("base64"));
    });
});

