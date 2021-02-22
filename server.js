const express = require('express');
const fs = require('fs');
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "images",
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(3000, function(){
  console.log('listening on port: 3000');
});

const SocketIO = require("socket.io")
const io = SocketIO(server)

io.on('connection', (socket) => {
    console.log("new connection: ", socket.id)    
});

app.use(multer({ 
    dest: "images",
    storage
}).single("image"))

app.post("/upload", (req, res) => {
    //fs.readFile('image.png', (err, data) => {
    console.log("images/image.png", req.file)
    io.on("connection", socket => {
        fs.readFile("images/image.png", (err, data) => {
            socket.emit('clientImgConversion', { image: true, buffer: data });
            socket.emit('serverImgConversion', "data:image/png;base64,"+ data.toString("base64"));
        });
    })
})
