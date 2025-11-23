(function() {
    var choices_container = document.getElementById("choices");
    
    var get_level = function(element) {
        var level = 1;
        var parent = element.parentElement;
        
        while (parent.parentElement !== choices_container) {
            level += 1;
            parent = parent.parentElement;
        }
        
        return "level" + level;
    }
    
    var keys = Object.keys(layout_map);
    for (var i = 0; i < keys.length; i++) {
        var question = document.createElement("div");
        question.className = "question";
        question.id = keys[i];
        
        var title_container = document.createElement("div");
        
        var title = document.createElement("h2");
        title.innerHTML = layout_map[keys[i]]["title"];
        
        title_container.appendChild(title);
        
        if ("info" in layout_map[keys[i]]) {
            var info = document.createElement("div");
            info.className = "info";
            info.id = keys[i] + "_info";
            info.info = layout_map[keys[i]]["info"];
            
            title_container.appendChild(info);
        }
        question.appendChild(title_container);
        
        if (layout_map[keys[i]]["mode"] == "checkbox") {
            var ul = document.createElement("ul");
            ul.className = "checklist";
            
            var item_keys = Object.keys(layout_map[keys[i]]["items"]);
            for (var x = 0; x < item_keys.length; x++) {
                var li = document.createElement("li");
                li.id = item_keys[x];
                li.innerHTML = layout_map[keys[i]]["items"][item_keys[x]]["display_text"];
                
                if ("info" in layout_map[keys[i]]["items"][item_keys[x]]) {                
                    var info = document.createElement("div");
                    info.className = "info";
                    info.id = item_keys[x] + "_info";
                    info.setAttribute("info", layout_map[keys[i]]["items"][item_keys[x]]["info"]);
                    
                    li.appendChild(info);
                }
                
                ul.appendChild(li);
            }
            
            question.appendChild(ul);
        }
        
        else if (layout_map[keys[i]]["mode"] == "radiobox") {
            var ul = document.createElement("ul");
            ul.className = "radiolist";
            
            var item_keys = Object.keys(layout_map[keys[i]]["items"]);
            for (var x = 0; x < item_keys.length; x++) {
                var li = document.createElement("li");
                li.id = item_keys[x];
                li.innerHTML = layout_map[keys[i]]["items"][item_keys[x]]["display_text"];
                
                if ("info" in layout_map[keys[i]]["items"][item_keys[x]]) {
                    var info = document.createElement("div");
                    info.className = "info";
                    info.id = item_keys[x];
                    info.setAttribute("info", layout_map[keys[i]]["items"][item_keys[x]]["info"]);
                    
                    li.appendChild(info);
                }
                
                ul.appendChild(li);
            }
            
            question.appendChild(ul);
        }
        
        else if (layout_map[keys[i]]["mode"] == "dropdown") {
            var select = document.createElement("select");
            
            var blank = document.createElement("option");
            select.appendChild(blank);
            
            var item_keys = Object.keys(layout_map[keys[i]]["items"]);
            for (var x = 0; x < item_keys.length; x++) {
                var option = document.createElement("option");
                option.id = item_keys[x];
                option.innerHTML = layout_map[keys[i]]["items"][item_keys[x]]["display_text"];
                select.appendChild(option);
            }
            
            question.appendChild(select);
        }
        
        if ("parent" in layout_map[keys[i]]) {
            if (document.getElementById(layout_map[keys[i]]["parent"]) == null) {
                console.log(layout_map[keys[i]]["parent"] + " is null");
            }
            document.getElementById(layout_map[keys[i]]["parent"]).appendChild(question);
            
            question.classList.add(get_level(question));
        }
        else {
            choices_container.appendChild(question);
        }
        
        
    }
    
}());
