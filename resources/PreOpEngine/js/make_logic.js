(function() {
    var is_visible = function(element) {
        if (element.offsetParent !== null) {
            return true;
        }
        return false;
    }
    
    var wordwrap = function(str, space) {
        var words = str.split(" ");
        var growing_string = "";
        var output_list = [];

        while (words.length > 0) {
            if (growing_string == "") {
                growing_string += words[0];
                words.splice(0, 1);
            }

            else if (growing_string[growing_string.length - 1] == "\n") {
                output_list.push(growing_string);
                growing_string = "";
            }

            else if ((growing_string + ' ' + words[0]).length <= space) {
                growing_string += ' ' + words[0];
                words.splice(0, 1);
            }

            else {
                output_list.push(growing_string + '\n')
                growing_string = "";
            }
        }
        output_list.push(growing_string);
        
        return output_list.join("");
    }
    
    var unique_array = function(a) {
        return a.sort().filter(function(item, pos, ary) {
            return !pos || item != ary[pos - 1];
        });
    }
    
    var combine_bullets = function(bullets) {
        bullets = unique_array(bullets);
        var space = 79;
        var new_bullets = [];
        
        for (var i = 0; i < bullets.length; i++) {
            var text = wordwrap(bullets[i], space - "  - ".length);
            var lines = text.split("\n");
            lines[0] = "  - " + lines[0];
            for (var x = 1; x < lines.length; x++) {
                lines[x] = "    " + lines[x];
            }
            new_bullets.push(lines.join("\n"));
        }
        return new_bullets.join("\n");
    }
    
    var combine_comma_separated = function(method, parts) {
        //var method = method || "and";
        if (parts.length == 1) {
            return parts.join(", ");
        }
        else if (parts.length == 2) {
            return parts.join(" " + method + " ");
        }
        else {
            parts[parts.length - 1] = method + " " + parts[parts.length - 1];
            return parts.join(", ");
        }
    }
    
    var checked_count_is_at_least = function(count, ids) {
        var total_checked = 0;
        
        for (var i = 0; i < ids.length; i++) {
            var item = document.getElementById(ids[i]);
            if (item == null) {
                console.log(ids[i] + " is null");
            }
            if (item.tagName == "LI") {
                if (item.checked && is_visible(item)) {
                    total_checked += 1;
                }
            }
            else if (item.tagName == "OPTION") {
                if (item.parentElement.value == item.textContent && is_visible(item)) {
                    total_checked += 1;
                }
            }
            if (total_checked >= count) {
                return true;
            }
        }
        return false;
    }
    
    var checked_count_is_exactly = function(count, ids) {
        var total_checked = 0;
        
        for (var i = 0; i < ids.length; i++) {
            var item = document.getElementById(ids[i]);
            if (item == null) {
                console.log(ids[i] + " is null");
            }
            if (item.tagName == "LI") {
                if (item.checked && is_visible(item)) {
                    total_checked += 1;
                }
            }
            else if (item.tagName == "OPTION") {
                if (item.parentElement.value == item.textContent && is_visible(item)) {
                    total_checked += 1;
                }
            }
        }
        if (total_checked == count) {
            return true;
        }
        return false;
    }
    
    var checked_count_is_all = function(ids) {
        for (var i = 0; i < ids.length; i++) {
            var item = document.getElementById(ids[i]);
            if (item == null) {
                console.log(ids[i] + " is null");
            }
            if (item.tagName == "LI") {
                if (!item.checked || !is_visible(item)) {
                    return false
                }
            }
            else if (item.tagName == "OPTION") {
                if (!item.parentElement.value == item.textContent || !is_visible(item)) {
                    return false
                }
            }
        }
        return true;
    }
    
    var check_if_proceed = function(key) {
        try {
            var logic_keys = Object.keys(logic_map[key]["logic"]);
        }
        catch (TypeError) {
            console.log("ERROR: " + key);
        }
        for (var x = 0; x < logic_keys.length; x++) {
            var ids = logic_map[key]["logic"][logic_keys[x]];
            
            if (logic_keys[x].match(/at_least_\d+/)) {
                var count = parseInt(logic_keys[x].match(/at_least_(\d+)/)[1]);
                if (!checked_count_is_at_least(count, ids)) {
                    return false;
                }
            }
            else if (logic_keys[x].match(/_all$/)) {
                if (!checked_count_is_all(ids)) {
                    return false;
                }
            }
            else {
                var count = parseInt(logic_keys[x].match(/\d+$/)[0]);
                if (!checked_count_is_exactly(count, ids)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    var generate_recommendations = function() {
        var statements = [];
        var bullets = [];
        
        var keys = Object.keys(logic_map);
        
        flicked_on = [];
        
        for (var i = 0; i < keys.length; i++) {
            if ("targets" in logic_map[keys[i]]) {
                if (check_if_proceed(keys[i])) {
                    for (var x = 0; x < logic_map[keys[i]]["targets"].length; x++) {
                        var id = logic_map[keys[i]]["targets"][x];
                        flicked_on.push(id);
                        try {
                            document.getElementById(id).style.display = "block";
                        }
                        catch (TypeError) {
                            console.log("Null " + id);
                        }
                    }
                }
                else {
                    for (var x = 0; x < logic_map[keys[i]]["targets"].length; x++) {
                        var id = logic_map[keys[i]]["targets"][x];
                        if (flicked_on.indexOf(id) == -1) {
                            document.getElementById(id).style.display = "none";
                        }
                    }
                }
            }
            else if ("conjunction" in logic_map[keys[i]]) {
                var conjunction_keys = Object.keys(logic_map[keys[i]]["conjunction"]);
                
                if (checked_count_is_at_least(1, conjunction_keys)) {
                    var parts = [];
                    var appendage = ".";
                    var method = "and";
                    
                    if ("appendage" in logic_map[keys[i]]) {
                        appendage = logic_map[keys[i]]["appendage"];
                        
                        if (appendage.match(/^[0-9a-zA-Z\[\]\(\)\<\>]/)) {
                            appendage = " " + appendage;
                        }
                            
                    }
                    if ("method" in logic_map[keys[i]]) {
                        method = logic_map[keys[i]]["method"];
                    }
                    
                    
                    for (var x = 0; x < conjunction_keys.length; x++) {
                        var item = document.getElementById(conjunction_keys[x]);
                        if (item.tagName == "LI") {
                            if (item.checked && is_visible(item)) {
                                parts.push(logic_map[keys[i]]["conjunction"][conjunction_keys[x]]);
                            }
                        }
                        else if (item.tagName == "OPTION") {
                            if (item.parentElement.value == item.textContent && is_visible(item)) {
                                parts.push(logic_map[keys[i]]["conjunction"][conjunction_keys[x]]);
                            }
                        }
                    }
                    
                    if ("statement" in logic_map[keys[i]]) {
                        statements.push((logic_map[keys[i]]["statement"] + " " + combine_comma_separated(method, parts) + appendage).trim())
                    }
                    else if ("bullet" in logic_map[keys[i]]) {
                        bullets.push((logic_map[keys[i]]["bullet"] + " " + combine_comma_separated(method, parts) + appendage).trim())
                    }
                }
            }
            else {
                if (check_if_proceed(keys[i])) {
                    if ("statement" in logic_map[keys[i]]) {
                        statements.push(logic_map[keys[i]]["statement"])
                    }
                    else if ("bullet" in logic_map[keys[i]]) {
                        bullets.push(logic_map[keys[i]]["bullet"])
                    }
                }
            }
        }
        var output = statements.join(" ") + "\n\n" + combine_bullets(bullets);
        document.getElementById("reciever").value = output;
    }
    
    var checkboxes = document.getElementsByClassName("checkbox");
    for (var i = 0; i < checkboxes.length; i++) {checkboxes[i].addEventListener("click", generate_recommendations)};
    
    var radioboxes = document.getElementsByClassName("radiobox");
    for (var i = 0; i < radioboxes.length; i++) {radioboxes[i].addEventListener("click", generate_recommendations)};
    
    var selectors = document.getElementsByTagName("select");
    for (var i = 0; i < selectors.length; i++) {selectors[i].addEventListener("change", generate_recommendations)};

}());
