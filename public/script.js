const socket=io("/")

const peerUser={}

var peer = new Peer(
    {
        host:'/',
    
        
    port:3001,
    config:{'iceServers': [
        {
          'urls': "stun:stun.relay.metered.ca:80",
        },
        {
          'urls': "turn:a.relay.metered.ca:80",
          'username': "19561549f1d83c817d7c5a30",
          'credential': "Idfjgp6A2Lfx5Z0d",
        },
        {
          'urls': "turn:a.relay.metered.ca:80?transport=tcp",
          'username': "19561549f1d83c817d7c5a30",
          'credential': "Idfjgp6A2Lfx5Z0d",
        },
        {
          'urls': "turn:a.relay.metered.ca:443",
          'username': "19561549f1d83c817d7c5a30",
          'credential': "Idfjgp6A2Lfx5Z0d",
        },
        {
          'urls': "turn:a.relay.metered.ca:443?transport=tcp",
          'username': "19561549f1d83c817d7c5a30",
          'credential': "Idfjgp6A2Lfx5Z0d",
        },
      ],
    },
    proxied: true,
}
    
);

const myVideo=document.createElement('video')
myVideo.muted=true
const videoGrid=document.getElementById('video-grid')

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true,
}).then(stream=>{
   
  addVideoStream(myVideo,stream)

  peer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
        addVideoStream(video,userVideoStream)
    })
    
 })
  socket.on('user-connected',userId=>{
    console.log(userId)
   connectedNewUser(userId,stream)
  })
})
socket.on('user-disconnected',(userId)=>{
    console.log("User Discoonected"+userId)
    if(peerUser[userId]){
        peerUser[userId].close()
        console.log(peerUser);
    }
})
peer.on('open',(id)=>{
    socket.emit('join-room',Room_ID,id)
})

//socket.emit("join-room",Room_ID,10)

function connectedNewUser(userId,stream){
     const call=peer.call(userId,stream)
     const video=document.createElement('video')
     call.on('stream',newUserStream=>{
        addVideoStream(video,newUserStream)
     })
     call.on('close',()=>{
        video.remove()
     })
     peerUser[userId]=call

}
function addVideoStream(video,stream){
    video.srcObject=stream,
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
    videoGrid.append(video)
}