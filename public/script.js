const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer();
const peers = {};

const myVideo = document.createElement("video");
myVideo.muted = true;

myPeer.on("open", (id) => {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      addVideoStream(myVideo, stream);

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
      socket.on("user-disconnected", (userId) => {
        if (peers[userId]) {
          peers[userId].close();
          console.log("Joinee Disconnected");
          if (document.getElementById(userId)) {
            document.getElementById(userId).remove();
          }
        }
      });

      socket.emit("join-room", ROOM_ID, id);
    });
});

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    console.log("Removing Joinee");
    video.remove();
  });

  peers[userId] = call;
}

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}
