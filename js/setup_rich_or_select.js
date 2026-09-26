(function () {
    document.addEventListener('click', function (event) {
        var option = event.target.closest('.or-option');
        if (!option || !option.closest('.rich-editor')) {
            return;
        }

        var group = option.closest('.or-list');
        if (!group) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        var editor = option.closest('.rich-editor');
        var selected = option.textContent;
        group.replaceWith(document.createTextNode(selected));

        if (editor) {
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    });
}());
