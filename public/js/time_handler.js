var startTime;
var checkpoint;

function setTime() {
    startTime = new Date().getTime();
    checkpoint = startTime;
}

function setCheckpoint() {
    var now = new Date().getTime();
    var distance = now - checkpoint;
    console.log(distance);
    var minutes = Math.floor((distance / (1000 * 60)) % 60);
    console.log(minutes);
    var seconds = Math.floor((distance / 1000) % 60);
    console.log(seconds);
    if(seconds.toString().length < 2) { seconds = "0" + seconds }
    $('#timestamp' + count).val(minutes + "m " + seconds + "s");
    checkpoint = now;
}
