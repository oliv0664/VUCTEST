function allowDrop(event) {
    event.preventDefault(); 
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id); 
    console.log(event.target.id.slice(0,3)); 
    if(event.target.id.slice(0,3) == "box") {
        event.effectAllowed = "copyMove"; 
    }
}

function drop(event) {
    event.preventDefault(); 
    var data = event.dataTransfer.getData("text");
    if(event.target.id == "dropbox") {
        var element = document.getElementById(data);
        console.log(element.id);
        if(element.id.slice(0,3) == "box") {
            var clone = element.cloneNode(true);
            clone.id = ("dragged_box" + clone.id.slice(3));
            element = clone;
        }
        // event.target.appendChild(element); 
        document.getElementById('dropbox_container').appendChild(element); 
    } else if(event.target.id == "dragbox") {
        document.getElementById(data).remove(); 
    }
}

function clear(event) {
    event.dataTransfer.clearData(); 
} 