(function() {
    // Convert all lis of a ul from class "checklist" to checkboxes.
    var lis = [];

    var radiolists = document.getElementsByClassName("radiolist");
    for (var i = 0; i < radiolists.length; i++) {
        lis.push.apply(lis, radiolists[i].getElementsByTagName("li"));
    }

    for (var i = 0; i < lis.length; i++) {
        if (!lis[i].classList.contains("radiolist_item")) {
            var radiobox = document.createElement("div");
            radiobox.classList.add("radiobox")

            var button = document.createElement("div");
            button.classList.add("button");
            button.addEventListener("click", function(event) {
                if (typeof this.checked === "undefined" || this.checked == false) {
                    var brothers = this.parentElement.parentElement.parentElement.getElementsByClassName("button");
                    for (var x = 0; x < brothers.length; x++) {
                        if (brothers[x] != this) {
                            brothers[x].className = "button";
                            brothers[x].checked = false;
                            brothers[x].parentElement.parentElement.checked = false;
                        }
                    }

                    this.className = "button checked";
                    this.checked = true;
                    this.parentElement.parentElement.checked = true;
                }
                else {
                    this.className = "button";
                    this.checked = false;
                    this.parentElement.parentElement.checked = false;
                }

            });
            radiobox.appendChild(button);

            var span = document.createElement("span");
            span.innerHTML = lis[i].innerHTML;
            radiobox.appendChild(span);

            while (lis[i].firstChild) {
                lis[i].removeChild(lis[i].firstChild);
            }

            lis[i].appendChild(radiobox);
            lis[i].className = "radiolist_item";
            
            if (lis[i].getAttribute("checked")) {
                button.click();
            }
        }
    }
}());
