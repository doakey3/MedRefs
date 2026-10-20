(function() {
var checkable_textareas = document.getElementsByClassName("checkable");

var get_pat_indexes = function(text) {
    // Returns a list of matches in text
    var array = [];
    var used_text = "";
    
    var match = /\[[^\[\]]+\]/.exec(text);
    while (match) {
        match.index = match.index + used_text.length
        array.push(match);
        used_text += text.substring(0, match.index + match[0].length);
        text = text.substring(match.index + match[0].length);
        match = /\[[^\[\]]+\]/.exec(text);
    }
    
    return array;
}

for (var i = 0; i < checkable_textareas.length; i++) {
    checkable_textareas[i].addEventListener("click", function() {
        var text = this.value;
        var pos = this.selectionStart;
        
        var pre_text = text.substring(0, pos);
        var post_text = text.substring(pos);
        
        if (pre_text.match(/\((\s+$|\s+X\s?$|$)/) && post_text.match(/^X?\s*\)/)) {
            var re=/\r\n|\n\r|\n|\r/g;
            var line_index = pre_text.replace(re,"\n").split("\n").length - 1;
            var lines = text.replace(re, "\n").split("\n");
            var line = lines[line_index];
            
            var pre_space = line.match(/^\s*/)[0];
            if (line.match(/^\s*\(\sX\s\)/)) {
                line = line.replace(/^\s*\(\sX\s\)/, pre_space + "(    )");
            }
            else {
                line = line.replace(/^\s*\(\s\s\s\s\)/, pre_space + "( X )");
            }
            
            lines[line_index] = line;
            
            this.value = lines.join("\n").replace(/\s+$/, "");
            this.selectionStart = lines.slice(0, line_index).join("\n").length + pre_space.length + 4;
            this.selectionEnd = this.selectionStart;
            
        }
    });

    checkable_textareas[i].addEventListener("keydown", function(event) {
        var tab_key = 9;
        if (event.keyCode == tab_key) {
            event.preventDefault();
        }
        
        if (event.keyCode == tab_key && !window.event.shiftKey) {
            var pre = this.value.substring(0, this.selectionEnd);
            var input = this.value.substring(this.selectionEnd)
            var match = /\[[^\[\]]+\]/.exec(input);
            if (match) {
                this.setSelectionRange(pre.length + match.index, pre.length + match.index + match[0].length);
            }
            if (!match) {
                var match = /\[[^\[\]]+\]/.exec(this.value);
                if (match) {
                    this.setSelectionRange(match.index, match.index + match[0].length);
                }
            }
        }
        else if (event.keyCode == tab_key && window.event.shiftKey) {
            var s = this.value.substring(0, this.selectionStart);
            var re = /\[[^\[\]]+\]/g;
            var m;
            var array = []
            while (m = re.exec(s)) {
                array.push(m)
            }
            if (array.length > 0) {
                this.setSelectionRange(array[array.length - 1].index, array[array.length - 1].index + array[array.length - 1][0].length);
            }
            else if (array.length == 0) {
                var s = this.value;
                var re = /\[[^\[\]]+\]/g;
                var m;
                var array = []
                while (m = re.exec(s)) {
                    array.push(m)
                }
                if (array.length > 0) {
                    this.setSelectionRange(array[array.length - 1].index, array[array.length - 1].index + array[array.length - 1][0].length);
                }
            }
        }
    });
}
}());
