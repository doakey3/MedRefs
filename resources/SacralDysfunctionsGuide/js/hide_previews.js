(function() {
    var treatment_containers = document.getElementsByClassName("treatment_container");
    
    for (var i = 0; i < treatment_containers.length; i++) {
        treatment_containers[i].addEventListener("mouseenter", function(event) {
            var videos = this.getElementsByTagName("video");
            if (videos.length > 0) {
                var img = this.getElementsByTagName("img")[0];
                img.style.display = "none";
            }
        });
        
        treatment_containers[i].addEventListener("mouseleave", function(event) {
            var videos = this.getElementsByTagName("video");
            if (videos.length > 0 && videos[0].paused) {
                var img = this.getElementsByTagName("img")[0];
                img.style.display = "";
            }
        });
    }
}());
