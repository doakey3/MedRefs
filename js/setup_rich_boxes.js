(function () {
    function toggleCheckbox(node) {
        var checked = node.dataset.checked === 'true';
        node.dataset.checked = checked ? 'false' : 'true';
        node.textContent = checked ? '[ ]' : '[x]';
    }

    document.addEventListener('click', function (event) {
        var checkbox = event.target.closest('.rich-checkbox');
        if (!checkbox || !checkbox.closest('.rich-editor')) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        toggleCheckbox(checkbox);
        checkbox.closest('.rich-editor').dispatchEvent(new Event('input', { bubbles: true }));
    });
}());
