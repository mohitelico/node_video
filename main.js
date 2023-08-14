const express=require('express')
const cors=require('cors')
const {v4:uuidv4}=require('uuid')
const { PeerServer } = require("peer");
const fs=require('fs')
const path=require('path')


const app=express()

app.use(cors())

const http=require('http')
const server=http.createServer(app)
const io=require("socket.io")(server)

app.set('view engine','ejs')
app.use(express.static('public'))

app.get("/",(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})

app.get("/:room",(req,res)=>{
    res.render('room',{roomId: req.params.room  })
})

io.on('connection',(socket)=>{
   socket.on('join-room',(roomId,userId)=>{

    console.log(roomId,userId)
    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected',userId)
    socket.on('disconnect',()=>{
        socket.broadcast.to(roomId).emit('user-disconnected',userId)
       })
   })
  
})

// const peerServer = PeerServer(
//     {  path:'/',
//         port: 443,
//         ssl: {
//             key: fs.readFileSync(path.join(__dirname,'cert','key.pem')),
//             cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
//         }, 
//     },()=>{
//     console.log('Peer server is running')
// });


server.listen(3000,(req,res)=>{
  console.log("Server is running on ")
})

console.log("Hello")
