(function() {   
    var input = document.getElementById("searchbar");
    var table = document.getElementById("codes");
    
    var copy_text = function(td) {
        var tr = td.srcElement.parentElement;
        navigator.clipboard.writeText(tr.code);
    }
    
    var keys = Object.keys(codes);
    for (var i = 0; i < keys.length; i++) {
        var tr = document.createElement("tr");
        tr.onclick = copy_text;
        tr.tags = codes[keys[i]]["tags"]
        tr.tags.push(keys[i]);
        tr.code = keys[i];
        
        var td1 = document.createElement("td");
        td1.innerHTML = keys[i];
        tr.appendChild(td1)
        
        var td2 = document.createElement("td");
        td2.innerHTML = codes[keys[i]]["desc"]
        tr.appendChild(td2)
        
        var td3 = document.createElement("td");
        td3.innerHTML = codes[keys[i]]["type"];
        tr.appendChild(td3);
        
        var td4 = document.createElement("td");
        td4.innerHTML = codes[keys[i]]["use"];
        tr.appendChild(td4);
        
        var td5 = document.createElement("td");
        td5.innerHTML = codes[keys[i]]["tags"].join(", ");
        tr.appendChild(td5);
        
        table.appendChild(tr)
    }
    
    input.onkeyup = function(event) {
        var filter = input.value.toLowerCase();
        var filter_split = filter.split(" ");
        var trs = table.getElementsByTagName("tr");
        
        for (var i = 1; i < trs.length; i++) {
            var text_value = trs[i].tags.join(" ");
            var found = true;
            for (var x = 0; x < filter_split.length; x++) {
                if (text_value.toLowerCase().indexOf(filter_split[x]) < 0) {
                    trs[i].style.display = "none";
                    found = false;
                    break;
                }
            }
            if (found) {
                trs[i].style.display = "";
            }
        }
    }
}());
