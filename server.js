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

app.set("views", path.join(__dirname, "public"))

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

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/upload", (req, res) => {
    socket.on("clientImgConversion", data => {
        console.log("DATA:: ", data)
        io.sockets.emit("serverImgConversion", data)
    })

    io.on("connection", socket => {
        fs.readFile(req.file.path, (err, data) => {
            socket.emit('clientImgConversion', { image: true, buffer: data });
            socket.emit('serverImgConversion', "data:image/png;base64,"+ data.toString("base64"));
        });
    })
})

app.post("/upload", (req, res) => {
    //fs.readFile('image.png', (err, data) => {
    console.log(req.file.path, req.file)
    io.on("connection", socket => {
        fs.readFile(req.file.path, (err, data) => {
            socket.emit('clientImgConversion', { image: true, buffer: data });
            socket.emit('serverImgConversion', "data:image/png;base64,"+ data.toString("base64"));
        });
    })
    res.redirect("/")
})
