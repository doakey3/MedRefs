(function() {
    // Convert all lis of a ul from class "checklist" to checkboxes.
    var lis = [];
    
    var checklists = document.getElementsByClassName("checklist");
    for (var i = 0; i < checklists.length; i++) {
        lis.push.apply(lis, checklists[i].getElementsByTagName("li"));
    }
    
    for (var i = 0; i < lis.length; i++) {
        if (!lis[i].classList.contains("checklist_item")) {
            var checkbox = document.createElement("div");
            checkbox.classList.add("checkbox")

            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>'
            var encoded = window.btoa(svg);
            var button = document.createElement("div");
            button.classList.add("button");
            button.addEventListener("click", function(event) {
                if (typeof this.checked === "undefined" || this.checked == false) {
                    this.style.content = "url(data:image/svg+xml;base64,"+encoded+")";
                    this.checked = true;
                    this.parentElement.parentElement.checked = true;
                }
                else {
                    this.style.content = null;
                    this.checked = false;
                    this.parentElement.parentElement.checked = false;
                }

            });
            checkbox.appendChild(button);
            
            var span = document.createElement("span");
            span.innerHTML = lis[i].innerHTML;
            
            checkbox.appendChild(span);

            while (lis[i].firstChild) {
                lis[i].removeChild(lis[i].firstChild);
            }

            lis[i].appendChild(checkbox);
            lis[i].classList.add("checklist_item");
            
            if (lis[i].getAttribute("checked")) {
                button.click();
            }
        }
    }
}());
