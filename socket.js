var ws = new WebSocket("ws://127.0.0.1:6001");
localStorage.selector = 1;

ws.onopen = function() {
    console.log("handshake success");
};

ws.onmessage = function(e) { };

ws.onerror = function() {
    $('#message').text('Websocket Error');
    console.log("error");
};

var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');

$('#select_video').on('click', function() {
    localStorage.selector = 0;
    $('#file_selector').show();
});

$('#select_camera').on('click', function() {
    localStorage.selector = 1;
    $('#file_selector').hide();
});

$('#start_push').on('click', function() {
    $('#canvas').show();
    var id = setInterval(function() { draw(id) }, 24);

    if (parseInt(localStorage.selector) == 1) {

        navigator.getMedia =    navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;
        
        navigator.getMedia({
            video: true,
            audio: true
        }, function(stream) {
            video.srcObject = stream;
            video.play();
        }, function(error) {
            console.log(error);
        });

    } else {
        $('#video')[0].play();
    }
});

$('#stop_push').on('click', function() {
    clearInterval(parseInt(localStorage.interval_id));
    $('#video')[0].pause();
});

document.querySelector('input[name=file_selector]').onchange = function(e) {
    var file = e.target.files[0];
    var objecturl = window.URL.createObjectURL(file);
    
    $('#video')[0].src = objecturl;
}

function draw(id) {
    localStorage.interval_id = id;

    if (ws.readyState == 1) {
        var compress_precent = parseInt($('#compress_precent').val())/100;
        canvas.width = video.videoWidth*compress_precent;
        canvas.height = video.videoHeight*compress_precent;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        push(canvas.toDataURL('image/webp'));
    }
}

function push(data) {
    ws.send(data);
}