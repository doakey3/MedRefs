(function() {
    var clear_selected_li = function() {
        var input = document.getElementById("searchbar");
        var ul = input.parentElement.getElementsByTagName("ul")[0];
        var lis = ul.getElementsByTagName("li");
        for (var i = 0; i < lis.length; i++) {
            lis[i].classList.remove("selected");
        }
    }
    
    var ul = document.getElementById("scroll_list");
    
    var filesindex = {};
    keys = Object.keys(PublicIndex);
    for (var i = 0; i < keys.length; i++) {
        filesindex[keys[i]] = PublicIndex[keys[i]];
        filesindex[keys[i]]["path"] = "./resources/" + filesindex[keys[i]]["path"];
    }
    
    var link_keys = Object.keys(LinksIndex);
    for (var i = 0; i < link_keys.length; i++) {
        filesindex[link_keys[i]] = {
            "title": link_keys[i], 
            "desc": LinksIndex[link_keys[i]]["desc"], 
            "tags": LinksIndex[link_keys[i]]["tags"], 
            "path": LinksIndex[link_keys[i]]["url"],
            "type": "link"
        }
    }

    var keys = Object.keys(filesindex).sort();
    
    for (var i = 0; i < keys.length; i++) {
        var li = document.createElement("li");
        
        var a = document.createElement("a");
        a.className = "filelink";
        a.textContent = filesindex[keys[i]]["title"];
        a.href = filesindex[keys[i]]["path"];
        a.target = "_blank";
        a.tags = filesindex[keys[i]]["tags"].toLowerCase().replace(/ /g, "").split(",");
        a.title = filesindex[keys[i]]["desc"]
        a.addEventListener("click", clear_selected_li);
        
        if ("type" in filesindex[keys[i]]) {
            li.className = "link";
        }
        else if (filesindex[keys[i]]["path"].split("/").pop().toLowerCase().indexOf(".") == -1) {
            li.className = "folder";
        }
        else {
            li.className = filesindex[keys[i]]["path"].split(".").pop().toLowerCase();
        }
        
        li.appendChild(a);

        ul.appendChild(li);
    }
    
    var get_selected_li = function(input, event) {
        var ul = input.parentElement.getElementsByTagName("ul")[0];
        var lis = ul.getElementsByTagName("li");
        var found = false;
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].className.split(" ").indexOf("selected") > -1) {
                lis[i].classList.remove("selected");
                if (lis[i].style.display != "none") {
                    found = true;
                }
                break;
            }
        }
        if (found == false) {
            for (var i = 0; i < lis.length; i++) {
                if (lis[i].style.display != "none") {
                    break;
                }
            }
        }
        if (["Enter", "Return"].indexOf(event.key) > -1) {
            return lis[i];
        }
        else if (["Down", "ArrowDown"].indexOf(event.key) > -1) {
            if (found == false) {
                return lis[i];
            }
            else {
                for (var x = i + 1; x < lis.length; x++) {
                    if (lis[x].style.display != "none") {
                        return lis[x];
                    }
                }
                for (var x = 0; x < lis.length; x++) {
                    if (lis[x].style.display != "none") {
                        return lis[x];
                    }
                }
            }
        }
        else if (["Up", "ArrowUp"].indexOf(event.key) > -1) {
            if (found == false) {
                for (var x = lis.length - 1; x > -1; x--) {
                    if (lis[x].style.display != "none") {
                        return lis[x];
                    }
                }
            }
            else {
                for (var x = i - 1; x > -1; x--) {
                    if (lis[x].style.display != "none") {
                        return lis[x];
                    }
                }
                for (var x = lis.length - 1; x > -1; x--) {
                    if (lis[x].style.display != "none") {
                        return lis[x];
                    }
                }
            }
        }
    }
    
    var scroll_to_li = function(li) {
        var ul = li.parentElement;
        var y_scrollable = ul.parentElement;

        var height = li.clientHeight;

        var lis = ul.getElementsByTagName("li");
        var count = 0;
        for (var i = 0; i < lis.length; i++) {
            if (lis[i].style.display != "none") {
                count += 1;
            }
            if (lis[i].className.split(" ").indexOf("selected") > -1) {
                break;
            }
        }
        var bottom = count * height;
        if (bottom > y_scrollable.scrollTop + y_scrollable.clientHeight) {
            y_scrollable.scrollTop = bottom - y_scrollable.clientHeight;
        }
        else if (bottom <= y_scrollable.scrollTop) {
            y_scrollable.scrollTop = bottom - height;
        }
    }
    
    var input = document.getElementById("searchbar");
    input.onkeydown = function(event) {
        if (["Up", "ArrowUp", "Down", "ArrowDown"].indexOf(event.key) > -1) {
            //event.preventDefault();
            var selected_li = get_selected_li(this, event);
            if (selected_li) {
                selected_li.classList.add("selected");
                scroll_to_li(selected_li);
            }
        }
        else if (["Enter", "Return"].indexOf(event.key) > -1) {
            event.preventDefault();
            var ul = this.parentElement.getElementsByTagName("ul")[0];

            var lis = ul.getElementsByTagName("li");
            var found = false;
            for (var i = 0; i < lis.length; i++) {
                if (lis[i].className.split(" ").indexOf("selected") > -1 && lis[i].style.display != "none") {
                    var a = lis[i].getElementsByTagName("a")[0];
                    a.click();
                    found = true;
                    break;
                }
            }
            if (!found) {
                for (var i = 0; i < lis.length; i++) {
                    if (lis[i].style.display != "none") {
                        var a = lis[i].getElementsByTagName("a")[0];
                        a.click()
                        found = true;
                        break;
                    }
                }
            }
            if (found) {
                this.value = "";
                for (var i = 0; i < lis.length; i++) {
                    lis[i].style.display = "";
                }
            }
        }
    }
    
    input.onkeyup = function(event) {
        if (["Enter", "Return"].indexOf(event.key) > -1) {
            // pass
        }
        else {
            var filter = this.value.toLowerCase();
            var filter_split = filter.split(" ");
            var ul = document.getElementById("scroll_list");
            var lis = ul.getElementsByTagName("li");
            var a;
            var txtValue;
            for (i = 0; i < lis.length; i++) {
                a = lis[i].getElementsByTagName("a")[0];
                txtValue = a.tags.join(" ");
                var found = true;
                for (var x = 0; x < filter_split.length; x++) {
                    if (txtValue.toLowerCase().indexOf(filter_split[x]) < 0) {
                        lis[i].style.display = "none";
                        found = false;
                        break;
                    }
                }
                if (found) {
                    lis[i].style.display = "";
                }
            }
        }
    }
    
}());
