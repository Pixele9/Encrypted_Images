const socket = io()

function b64(e){
    let t="";
    let n = new Uint8Array(e);
    let r = n.byteLength;
    for(let i=0; i<r; i++) {
        t+=String.fromCharCode(n[i])
    }
    return window.btoa(t)
}

const img1 = document.getElementById("img1")
const img2 = document.getElementById("img2")

socket.on("clientImgConversion", data => {
    img1.src = "data:image/png;base64,"+b64(data.buffer)
    console.log("client data: ", data)
})

socket.on("serverImgConversion", data => {
    img2.src = data
    console.log("server data: ", data)
})
