(function() {
    var integer_only_inputs = document.getElementsByClassName("integer_only");
    
    for (var i = 0; i < integer_only_inputs.length; i++) {
        integer_only_inputs[i].addEventListener("input", function(event) {
            //this.value = this.value
            this.value = this.value.replace(/[^0-9]*/g, "");
        });
    }
}());
