function gotStream(stream) {
    console.log("Got Stream!");
    window.stream = stream;


    if (window.URL) {
        video.src = window.URL.createObjectURL(stream);
    }
    else {
        video.src = stream;
    }

    console.log(video.src);
    
    video.play();
}

function noStream() {
    console.log("No Stream!");
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
constraints = {audio: true,video: true};

var video = document.getElementById("localVideoElement");

userMedia = navigator.getUserMedia(constraints,
                         gotStream,
                         function() {console.log("No Stream");}); 
console.log(userMedia);
