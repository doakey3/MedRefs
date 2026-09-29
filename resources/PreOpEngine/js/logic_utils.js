var get_children_ids = function(id) {
    var element = document.getElementById(id);
    var ids = [];
    
    if (element.getElementsByClassName("checklist").length > 0 && element.getElementsByClassName("checklist")[0].parentElement == element) {
        var ul = element.getElementsByClassName("checklist")[0];
        var lis = ul.getElementsByClassName("checklist_item");
        
        for (var i = 0; i < lis.length; i++) {
            ids.push(lis[i].id);
        }
    }
    else if (element.getElementsByClassName("radiolist").length > 0 && element.getElementsByClassName("radiolist")[0].parentElement == element) {
        var ul = element.getElementsByClassName("radiolist")[0];
        var lis = ul.getElementsByClassName("radiolist_item");
        
        for (var i = 0; i < lis.length; i++) {
            ids.push(lis[i].id);
        }
    }
    else {
        var options = element.getElementsByTagName("OPTION");
        for (var i = 0; i < options.length; i++) {
            if (options[i].id != "") {
                ids.push(options[i].id);
            }
        }
    }

    return ids;
}

var get_children_question_ids = function(id) {
    var element = document.getElementById(id);
    var questions = element.getElementsByClassName("question");
    
    var ids = [];
    
    for (var i = 0; i < questions.length; i++) {
        if (questions[i].parentElement == element) {
            ids.push(questions[i].id);
        }
    }
    
    return ids;
}

var get_id_dict = function(id) {
    var element = document.getElementById(id);
    var id_dict = {};
    
    if (element.getElementsByClassName("checklist").length > 0 && element.getElementsByClassName("checklist")[0].parentElement == element) {
        var ul = element.getElementsByClassName("checklist")[0];
        var lis = ul.getElementsByClassName("checklist_item");
        
        for (var i = 0; i < lis.length; i++) {
            id_dict[lis[i].id] = lis[i].textContent;
        }
    }
    else if (element.getElementsByClassName("radiolist").length > 0 && element.getElementsByClassName("radiolist")[0].parentElement == element) {
        var ul = element.getElementsByClassName("radiolist")[0];
        var lis = ul.getElementsByClassName("radiolist_item");
        
        for (var i = 0; i < lis.length; i++) {
            id_dict[lis[i].id] = lis[i].textContent;
        }
    }
    else {
        var options = element.getElementsByTagName("OPTION");
        for (var i = 1; i < options.length; i++) {
            if (options[i].id != "" && options[i].parentElement.parentElement == element) {
                id_dict[options[i].id] = options[i].textContent;
            }
        }
    }
    
    return id_dict;
}

var get_statement = function(id) {
    return document.getElementById(id).textContent;
}
