(function() {
    var set_block_width = function(block) {
        var width = block.offsetWidth;
        block.style.width = "min-content";
        var min_width = block.offsetWidth;
        block.style.width = "";
        
        var height = block.offsetHeight;
        for (var i = block.offsetWidth; i > min_width - 4; i--) {
            block.style.width = i + "px";
            if (block.offsetHeight != height) {
                break;
            }
        }
        block.style.width = i + 1 + "px";
    };
    
    var infos = document.getElementsByClassName("info");
    
    for (var i = 0; i < infos.length; i++) {
        var info_window = document.createElement("div")
        document.body.appendChild(info_window);
        info_window.className = "info_window";
        info_window.innerHTML = infos[i].getAttribute("info") || infos[i].info;
        
        set_block_width(info_window);
        info_window.style.padding = "10px";
        
        infos[i].appendChild(info_window);
        
        infos[i].addEventListener("mouseover", function(event) {
            if (event.target == this) {
                var info_window = this.getElementsByClassName("info_window")[0];
                
                var p_rect = this.getBoundingClientRect();
                var rect = info_window.getBoundingClientRect();
                
                var h_margin = 5;
                
                if (window.innerWidth - p_rect.right - h_margin >= rect.width) {
                    info_window.style.left = p_rect.right - p_rect.left + h_margin + "px";
                }
                else if (window.innerWidth - event.clientX < rect.width) {
                    info_window.style.left = -rect.width - h_margin + "px";
                }
                
                if (window.innerHeight - event.clientY < rect.height) {
                    info_window.style.top = -rect.height + (window.innerHeight - event.clientY) + "px";
                }
                else {
                    info_window.style.top = "0px";
                }
                
                info_window.style.opacity = "1";
            }
        });
        
        infos[i].addEventListener("click", function(event) {
            if (event.target == this) {
                if (!this.clicked) {
                    this.clicked = true;
                    this.classList.add("clicked");
                
                    var info_window = this.getElementsByClassName("info_window")[0];
                    info_window.style.pointerEvents = "auto";
                }
                else {
                    this.clicked = false;
                    this.className = "info";
                    var info_window = this.getElementsByClassName("info_window")[0];
                    info_window.style.pointerEvents = "none";
                }
            }
        })
        
        infos[i].addEventListener("mouseout", function() {
            var info_window = this.getElementsByClassName("info_window")[0];
            
            if (!this.clicked) {
                info_window.style.opacity = "0";
            }
        });
    }
}());
