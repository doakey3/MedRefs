(function() {
    var resizables = document.getElementsByClassName("resizable");
    
    for (var i = 0; i < resizables.length; i++) {
        resizables[i].addEventListener("input", function() {
            this.parentNode.dataset.replicatedValue = this.value;
        });
        
        var event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        
        resizables[i].dispatchEvent(event);
    }
}());
