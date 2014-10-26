var localStream, localPeerConnection, remotePeerConnection;

var localVideo = document.getElementById("localVideo");
var remoteVideo = document.getElementById("remoteVideo");

var startButton = document.getElementById("startButton");
var callButton = document.getElementById("callButton");
var hangupButton = document.getElementById("hangupButton");

startButton.disabled=false;
callButton.disabled=true;
hangupButton.disabled=true;

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;


function log(message) {
console.log("At time: " +  (performance.now() / 1000).toFixed(3) + " --> " + message);
}

function gotStream(stream) {

    log("Got Stream!");
    
    if (window.URL) {
        localVideo.src = URL.createObjectURL(stream);
    } else {
        localVideo.src = stream;
    }

    localStream = stream;
    callButton.disabled=false;
}

function start() {
    startButton.disabled = true;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    constraints = {audio: false,video: true};

    navigator.getUserMedia(constraints,
                                       gotStream,
                                       function() {log("No Stream");}); 
}

function call() {
    callButton.disabled = true;
    hangupButton.disabled = false;
    log("Starting call");

    if (navigator.webkitGetUserMedia) {
        if (localStream.getVideoTracks().length >0) {
            log ("Using Video device: " + localStream.getVideoTracks()[0].label);
        }
        if (localStream.getAudioTracks().length >0) {
            log ("Using Audio device: " + localStream.getAudioTracks()[0].label);
        }
    }

    if (navigator.webkitGetUserMedia) {
        RTCPeerConnection = webkitRTCPeerConnection;
    } else if (navigator.mozGetUserMedia) {
        RTCPeerConnection = mozRTCPeerConnection ;
        RTCSessionDescription = mozRTCSessionDescription;
        RTCIceCandidate = mozRTCIceCandidate;
    }

    log("RTCPeerConnection object: " + RTCPeerConnection);

    var servers = null;

    localPeerConnection = new RTCPeerConnection(servers);
    log("Created local peer connection object localPeerConnection");
    localPeerConnection.onicecandidate = gotLocalIceCandidate;
    
    remotePeerConnection = new RTCPeerConnection(servers);
    log("Created remote peer connection object remotePeerConnection");

    remotePeerConnection.onicecandidate = gotRemoteIceCandidate;

    remotePeerConnection.onaddstream = gotRemoteStream;

    localPeerConnection.addStream(localStream);
    log("Added localStream to localPeerConnection");

    localPeerConnection.createOffer(gotLocalDescription,onSignalingError);
}

function onSignalingError(error){
    log("Failed to create signaling message" + error);
}

function gotLocalDescription (description){ 
    localPeerConnection.setLocalDescription(description);

    log("Offer from localPeerConnection: \n" + description.sdp);

    remotePeerConnection.setRemoteDescription(description);
    remotePeerConnection.createAnswer(gotRemoteDescription,onSignalingError);
}

function gotRemoteDescription(description) {
    remotePeerConnection.setLocalDescription(description);
    log("Answer from remotePeerConnection: \n"  description.sdp);
    localPeerConnection.setRemoteDescription(description);
}

function hangup () {
    log("Ending call");
    localPeerConnection.close(); 
    remotePeerConnection.close(); 

    localPeerConnection =null;
    remotePeerConnection =null;
    hangupButton.disabled = true;
    callButton.disabled = false;

}

function gotRemoteStream(event) {
    if (window.URL){ 
        remoteVideo.src = window.URL.createObjectURL(event.stream);
    } else {
        remoteVideo.src = event.stream;
    }
    log("Received remote stream");
}

function gotLocalIceCandidate(event) {
    if (event.candidate) {
        remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        log("Local ICE candidate: \n" + event.candidate.candidate);
    }
}

function gotRemoteIceCandidate(event) {
    if (event.candidate) {
        localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));
        log("Remote ICE candidate: \n" + event.candidate.candidate);
    }
}

