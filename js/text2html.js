(function () {
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function normalizeSymbols(text) {
        return text
            .replace(/>=/g, '≥')
            .replace(/<=/g, '≤')
            .replace(/!=/g, '≠')
            .replace(/->/g, '→')
            .replace(/<-/g, '←');
    }

    function inlineHtml(text) {
        var safe = escapeHtml(normalizeSymbols(text));

        // **text** becomes bold text in copied output,
        // with the asterisks removed.
        return safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    }

    function renderLineToEditor(line) {
        var div = document.createElement('div');

        if (line === '') {
            div.innerHTML = '<br>';
            return div;
        }

        var headerMatch = line.match(/^(#{1,3})\s+(.*)$/);

        if (headerMatch) {
            var level = headerMatch[1].length;

            div.className = 'md-header-' + level;

            div.appendChild(
                document.createTextNode(headerMatch[1] + ' ')
            );

            appendInlineEditor(div, headerMatch[2]);

            return div;
        }

        var checkboxMatch = line.match(/^(\s*)\[( |x|X)\](.*)$/);

        if (checkboxMatch) {
            div.appendChild(
                document.createTextNode(checkboxMatch[1])
            );

            var box = document.createElement('span');

            box.className = 'rich-checkbox';
            box.contentEditable = 'false';

            box.dataset.checked =
                /x/i.test(checkboxMatch[2]) ? 'true' : 'false';

            box.textContent =
                box.dataset.checked === 'true' ? '[x]' : '[ ]';

            div.appendChild(box);

            appendInlineEditor(div, checkboxMatch[3]);

            return div;
        }

        appendInlineEditor(div, line);

        return div;
    }

    function appendInlineEditor(container, text) {
        var orParts = text.split('||');

        if (orParts.length > 1) {
            var prefix = orParts.shift();

            var colonIndex = prefix.lastIndexOf(':');

            var label =
                colonIndex >= 0
                    ? prefix.slice(0, colonIndex + 1)
                    : '';

            var firstOption =
                colonIndex >= 0
                    ? prefix.slice(colonIndex + 1).trim()
                    : prefix.trim();

            appendBoldAware(
                container,
                label + (label ? ' ' : '')
            );

            var list = document.createElement('span');

            list.className = 'or-list';

            var options = [firstOption].concat(
                orParts.map(function (part) {
                    return part.trim();
                })
            );

            options.forEach(function (part, index) {
                var option = document.createElement('span');

                option.className = 'or-option';
                option.contentEditable = 'false';

                appendBoldAware(option, part);

                list.appendChild(option);

                if (index < options.length - 1) {
                    var separator = document.createElement('span');

                    separator.className = 'or-separator';
                    separator.contentEditable = 'false';
                    separator.textContent = '||';

                    list.appendChild(separator);
                }
            });

            container.appendChild(list);

            return;
        }

        appendBoldAware(container, text);
    }

    function appendBoldAware(container, text) {
        var re = /\*\*(.+?)\*\*/g;

        var last = 0;
        var match;

        while ((match = re.exec(text))) {
            container.appendChild(
                document.createTextNode(
                    text.slice(last, match.index)
                )
            );

            var bold = document.createElement('span');

            bold.className = 'md-bold';

            // Asterisks remain visible inside the editor.
            bold.appendChild(
                document.createTextNode(
                    '**' + match[1] + '**'
                )
            );

            container.appendChild(bold);

            last = match.index + match[0].length;
        }

        container.appendChild(
            document.createTextNode(
                text.slice(last)
            )
        );
    }

    function editorToMarkdown(editor) {
        return Array.from(editor.children)
            .filter(function (line) {
                return !line.classList.contains(
                    'rich-copy-button'
                );
            })
            .map(function (line) {
                if (line.innerHTML === '<br>') {
                    return '';
                }

                return line.textContent;
            })
            .join('\n');
    }

    function getCaretOffset(editor) {
        var selection = window.getSelection();

        if (
            !selection ||
            selection.rangeCount === 0 ||
            !editor.contains(selection.focusNode)
        ) {
            return null;
        }

        var focusNode = selection.focusNode;
        var focusOffset = selection.focusOffset;

        var lines = Array.from(editor.children).filter(function (line) {
            return !line.classList.contains('rich-copy-button');
        });

        var total = 0;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];

            if (
                line === focusNode ||
                line.contains(focusNode)
            ) {
                var range = document.createRange();
                range.selectNodeContents(line);

                try {
                    range.setEnd(focusNode, focusOffset);
                    total += range.toString().length;
                } catch (error) {
                    total += line.textContent.length;
                }

                return total;
            }

            total += line.textContent.length;

            // Account for the newline between editor lines.
            if (i < lines.length - 1) {
                total += 1;
            }
        }

        return total;
    }


    function setCaretOffset(editor, targetOffset) {
        if (targetOffset === null) {
            return;
        }

        var lines = Array.from(editor.children).filter(function (line) {
            return !line.classList.contains('rich-copy-button');
        });

        var remaining = targetOffset;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var lineLength = line.textContent.length;

            if (remaining <= lineLength) {
                placeCaretInside(line, remaining);
                return;
            }

            remaining -= lineLength;

            if (i < lines.length - 1) {
                remaining -= 1;
            }
        }

        // Fallback: end of editor.
        if (lines.length) {
            placeCaretInside(
                lines[lines.length - 1],
                lines[lines.length - 1].textContent.length
            );
        }
    }


    function placeCaretInside(container, offset) {
        var range = document.createRange();
        var selection = window.getSelection();

        function findPosition(parent, remaining) {
            var children = Array.from(parent.childNodes);

            for (var i = 0; i < children.length; i++) {
                var node = children[i];

                /*
                 * Ordinary text node: caret may be placed inside it.
                 */
                if (node.nodeType === Node.TEXT_NODE) {
                    var length = node.nodeValue.length;

                    if (remaining <= length) {
                        return {
                            node: node,
                            offset: remaining
                        };
                    }

                    remaining -= length;
                    continue;
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    var length = node.textContent.length;

                    /*
                     * contenteditable="false" elements are atomic.
                     * Never put the caret inside one.
                     */
                    if (node.contentEditable === 'false') {
                        if (remaining < length) {
                            return {
                                node: parent,
                                offset: i
                            };
                        }

                        if (remaining === length) {
                            return {
                                node: parent,
                                offset: i + 1
                            };
                        }

                        remaining -= length;
                        continue;
                    }

                    /*
                     * Editable element, such as an md-bold span:
                     * descend into it.
                     */
                    if (remaining <= length) {
                        return findPosition(node, remaining);
                    }

                    remaining -= length;
                }
            }

            /*
             * Offset lies at or beyond the end of this container.
             */
            return {
                node: parent,
                offset: parent.childNodes.length
            };
        }

        var position = findPosition(container, offset);

        range.setStart(position.node, position.offset);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
    }

    function renderEditor(editor, text) {
        editor._richRendering = true;

        editor.innerHTML = '';

        text
            .replace(/\r\n?/g, '\n')
            .split('\n')
            .forEach(function (line) {
                editor.appendChild(
                    renderLineToEditor(line)
                );
            });

        editor._richRendering = false;

        editor.dispatchEvent(
            new Event(
                'input',
                { bubbles: true }
            )
        );
    }

    function lineToCopiedHtml(line) {
        var header =
            line.match(/^(#{1,3})\s+(.*)$/);

        if (header) {
            var level = header[1].length;

            var contents =
                inlineHtml(header[2]);

            if (level === 1) {
                return (
                    '<table style="' +
                        'width: 6in;' +
                        'border-collapse: collapse;' +
                    '">' +

                    '<tr>' +

                    '<td style="' +
                        'background-color: lightgreen;' +
                        'color: white;' +
                        'font-weight: bold;' +
                        'padding: 4px 8px;' +
                    '">' +

                    contents +

                    '</td>' +

                    '</tr>' +

                    '</table>'
                );
            }

            if (level === 2) {
                return (
                    '<div style="' +
                        'font-weight: bold;' +
                        'color: purple;' +
                        'text-decoration: underline;' +
                    '">' +

                    contents +

                    '</div>'
                );
            }

            return (
                '<div style="font-weight: bold;">' +
                contents +
                '</div>'
            );
        }

        var checkbox =
            line.match(/^(\s*)\[( |x|X)\](.*)$/);

        if (checkbox) {
            var indent =
                checkbox[1].replace(
                    / /g,
                    '&nbsp;'
                );

            var symbol =
                /x/i.test(checkbox[2])
                    ? '☑'
                    : '☐';

            return (
                '<div>' +
                indent +
                symbol +
                inlineHtml(checkbox[3]) +
                '</div>'
            );
        }

        if (line === '') {
            return '<div><br></div>';
        }

        return (
            '<div>' +
            inlineHtml(line) +
            '</div>'
        );
    }

    /*
 * Return the top-level line <div> containing a node.
 */
function getEditorLine(editor, node) {
    if (!node) {
        return null;
    }

    if (node === editor) {
        return editor.lastElementChild;
    }

    while (node && node.parentNode !== editor) {
        node = node.parentNode;
    }

    return node && node.parentNode === editor
        ? node
        : null;
}


/*
 * Character offset within one line.
 */
function getLineCaretOffset(line) {
    var selection = window.getSelection();

    if (
        !selection ||
        selection.rangeCount === 0 ||
        !line.contains(selection.focusNode)
    ) {
        return null;
    }

    var range = document.createRange();
    range.selectNodeContents(line);

    try {
        range.setEnd(
            selection.focusNode,
            selection.focusOffset
        );

        return range.toString().length;
    } catch (error) {
        return line.textContent.length;
    }
}


/*
 * Global Markdown character offset for a DOM point.
 */
function getDocumentOffset(editor, node, offset) {
    var lines = Array.from(editor.children);
    var total = 0;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];

        if (
            line === node ||
            line.contains(node)
        ) {
            var range = document.createRange();
            range.selectNodeContents(line);

            try {
                range.setEnd(node, offset);
                total += range.toString().length;
            } catch (error) {
                total += line.textContent.length;
            }

            return total;
        }

        total += line.textContent.length;

        if (i < lines.length - 1) {
            total += 1;
        }
    }

    return total;
}


/*
 * Current selection expressed as Markdown offsets.
 */
function getSelectionOffsets(editor) {
    var selection = window.getSelection();

    if (
        !selection ||
        selection.rangeCount === 0 ||
        !editor.contains(selection.anchorNode) ||
        !editor.contains(selection.focusNode)
    ) {
        return null;
    }

    var anchor = getDocumentOffset(
        editor,
        selection.anchorNode,
        selection.anchorOffset
    );

    var focus = getDocumentOffset(
        editor,
        selection.focusNode,
        selection.focusOffset
    );

    return {
        start: Math.min(anchor, focus),
        end: Math.max(anchor, focus)
    };
}


/*
 * Place a caret at an offset within a rendered line.
 *
 * contenteditable=false spans are treated as atomic:
 * the caret goes before or after them, never inside them.
 */
function placeCaretInside(container, offset) {
    var range = document.createRange();
    var selection = window.getSelection();

    function findPosition(parent, remaining) {
        var children = Array.from(parent.childNodes);

        for (var i = 0; i < children.length; i++) {
            var node = children[i];

            if (node.nodeType === Node.TEXT_NODE) {
                var length = node.nodeValue.length;

                if (remaining <= length) {
                    return {
                        node: node,
                        offset: remaining
                    };
                }

                remaining -= length;
                continue;
            }

            if (node.nodeType === Node.ELEMENT_NODE) {
                var elementLength =
                    node.textContent.length;

                if (node.contentEditable === 'false') {
                    if (remaining < elementLength) {
                        return {
                            node: parent,
                            offset: i
                        };
                    }

                    if (remaining === elementLength) {
                        return {
                            node: parent,
                            offset: i + 1
                        };
                    }

                    remaining -= elementLength;
                    continue;
                }

                if (remaining <= elementLength) {
                    return findPosition(
                        node,
                        remaining
                    );
                }

                remaining -= elementLength;
            }
        }

        return {
            node: parent,
            offset: parent.childNodes.length
        };
    }

    var position =
        findPosition(container, offset);

    range.setStart(
        position.node,
        position.offset
    );

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
}


/*
 * Place caret at a global Markdown character offset.
 */
function setDocumentCaretOffset(editor, target) {
    var lines = Array.from(editor.children);

    var remaining = Math.max(0, target);

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var length = line.textContent.length;

        if (remaining <= length) {
            placeCaretInside(
                line,
                remaining
            );

            return;
        }

        remaining -= length;

        if (i < lines.length - 1) {
            remaining -= 1;
        }
    }

    if (lines.length) {
        var last = lines[lines.length - 1];

        placeCaretInside(
            last,
            last.textContent.length
        );
    }
}


/*
 * Replace only one editor line with its parsed representation.
 */
function rerenderLine(editor, line) {
    if (!line) {
        return;
    }

    var caretOffset =
        getLineCaretOffset(line);

    var text =
        line.innerHTML === '<br>'
            ? ''
            : line.textContent;

    var replacement =
        renderLineToEditor(text);

    line.replaceWith(replacement);

    if (caretOffset !== null) {
        placeCaretInside(
            replacement,
            caretOffset
        );
    }
}


/*
 * Render the entire editor.
 *
 * Used for:
 * - initial setup
 * - paste
 * - undo/redo
 * - deliberate programmatic replacement
 */
function renderEditor(editor, text) {
    editor._richRendering = true;

    editor.innerHTML = '';

    text
        .replace(/\r\n?/g, '\n')
        .split('\n')
        .forEach(function (line) {
            editor.appendChild(
                renderLineToEditor(line)
            );
        });

    editor._richRendering = false;

    editor.dispatchEvent(
        new Event('input', {
            bubbles: true
        })
    );
}


/*
 * ---------- Undo / redo ----------
 */

function captureState(editor) {
    var selection =
        getSelectionOffsets(editor);

    return {
        markdown:
            editorToMarkdown(editor),

        caret:
            selection
                ? selection.start
                : null
    };
}


function statesEqual(a, b) {
    return (
        a &&
        b &&
        a.markdown === b.markdown
    );
}


function rememberPreviousState(editor) {
    var previous =
        editor._richLastState;

    if (!previous) {
        return;
    }

    var current = {
        markdown:
            editorToMarkdown(editor)
    };

    if (
        current.markdown ===
        previous.markdown
    ) {
        return;
    }

    var undo = editor._richUndoStack;

    if (
        !undo.length ||
        !statesEqual(
            undo[undo.length - 1],
            previous
        )
    ) {
        undo.push(previous);
    }

    /*
     * New edit invalidates redo history.
     */
    editor._richRedoStack = [];
}


function restoreState(editor, state) {
    if (!state) {
        return;
    }

    editor._richRestoring = true;

    renderEditor(
        editor,
        state.markdown
    );

    if (state.caret !== null) {
        setDocumentCaretOffset(
            editor,
            state.caret
        );
    }

    editor._richLastState =
        captureState(editor);

    editor._richRestoring = false;
}


function undoEditor(editor) {
    if (!editor._richUndoStack.length) {
        return;
    }

    var current =
        captureState(editor);

    editor._richRedoStack.push(
        current
    );

    var previous =
        editor._richUndoStack.pop();

    restoreState(
        editor,
        previous
    );
}


function redoEditor(editor) {
    if (!editor._richRedoStack.length) {
        return;
    }

    var current =
        captureState(editor);

    editor._richUndoStack.push(
        current
    );

    var next =
        editor._richRedoStack.pop();

    restoreState(
        editor,
        next
    );
}


/*
 * Programmatic setter.
 *
 * Use this instead of setting .textContent or .innerHTML
 * directly on a rich editor.
 */
function setEditorText(editor, text) {
    if (!editor) {
        return;
    }

    var oldState =
        editor._richLastState ||
        captureState(editor);

    if (
        oldState.markdown !== text
    ) {
        editor._richUndoStack.push(
            oldState
        );

        editor._richRedoStack = [];
    }

    renderEditor(
        editor,
        text
    );

    editor._richLastState =
        captureState(editor);
}


/*
 * Public API.
 */
window.richText = {
    renderEditor: renderEditor,
    setText: setEditorText,
    editorToMarkdown: editorToMarkdown
};


/*
 * Initialize every rich editor.
 */
document
    .querySelectorAll('.rich-editor')
    .forEach(function (editor) {
        var initialText =
            editor.textContent;

        editor._richRendering = false;
        editor._richRestoring = false;

        editor._richUndoStack = [];
        editor._richRedoStack = [];

        renderEditor(
            editor,
            initialText
        );

        editor._richLastState =
            captureState(editor);

        editor.addEventListener(
            'beforeinput',
            function (event) {
                if (event.inputType !== 'deleteContentBackward') {
                    return;
                }

                var selection = window.getSelection();

                if (
                    !selection ||
                    selection.rangeCount === 0 ||
                    !selection.isCollapsed ||
                    !editor.contains(selection.focusNode)
                ) {
                    return;
                }

                var line = getEditorLine(
                    editor,
                    selection.focusNode
                );

                if (!line) {
                    return;
                }

                var lines = Array.from(editor.children);
                var lineIndex = lines.indexOf(line);

                /*
                 * Nothing special to do on the first line.
                 */
                if (lineIndex <= 0) {
                    return;
                }

                var caretOffset =
                    getLineCaretOffset(line);

                /*
                 * Only intercept Backspace when the caret is
                 * at the very beginning of the line.
                 */
                if (caretOffset !== 0) {
                    return;
                }

                event.preventDefault();

                var previous =
                    lines[lineIndex - 1];

                var previousText =
                    previous.innerHTML === '<br>'
                        ? ''
                        : previous.textContent;

                var currentText =
                    line.innerHTML === '<br>'
                        ? ''
                        : line.textContent;

                /*
                 * Save undo state BEFORE making the merge.
                 */
                var oldState =
                    captureState(editor);

                editor._richUndoStack.push(
                    oldState
                );

                editor._richRedoStack = [];

                /*
                 * Markdown semantics of Backspace at the start
                 * of a line:
                 *
                 *     abc|
                 *     def
                 *
                 * becomes:
                 *
                 *     abcdef
                 *
                 * The caret belongs exactly at the join.
                 */
                var joinOffset =
                    previousText.length;

                var mergedText =
                    previousText + currentText;

                var replacement =
                    renderLineToEditor(
                        mergedText
                    );

                previous.replaceWith(
                    replacement
                );

                line.remove();

                placeCaretInside(
                    replacement,
                    joinOffset
                );

                editor._richLastState =
                    captureState(editor);

                /*
                 * Notify resizing/etc. without causing our
                 * ordinary input parser to process this again.
                 */
                editor._richRendering = true;

                editor.dispatchEvent(
                    new Event(
                        'input',
                        { bubbles: true }
                    )
                );

                editor._richRendering = false;
            }
        );

        /*
         * Ordinary typing:
         *
         * Only re-render the line containing the caret.
         */
        editor.addEventListener(
            'input',
            function () {
                if (
                    editor._richRendering ||
                    editor._richRestoring
                ) {
                    return;
                }

                rememberPreviousState(
                    editor
                );

                var selection =
                    window.getSelection();

                var line =
                    selection &&
                    selection.rangeCount
                        ? getEditorLine(
                            editor,
                            selection.focusNode
                        )
                        : null;

                /*
                 * Normally only the line being edited
                 * needs to be reparsed.
                 */
                rerenderLine(
                    editor,
                    line
                );

                editor._richLastState =
                    captureState(editor);
            }
        );


        /*
         * Paste is handled explicitly because it may
         * insert multiple lines.
         *
         * We modify the Markdown string and then render
         * the complete editor once.
         */
        editor.addEventListener(
            'paste',
            function (event) {
                event.preventDefault();

                var pasted =
                    (
                        event.clipboardData ||
                        window.clipboardData
                    ).getData('text/plain');

                pasted = pasted
                    .replace(/\r\n?/g, '\n');

                var selection =
                    getSelectionOffsets(editor);

                if (!selection) {
                    return;
                }

                var oldState =
                    captureState(editor);

                editor._richUndoStack.push(
                    oldState
                );

                editor._richRedoStack = [];

                var markdown =
                    editorToMarkdown(editor);

                var next =
                    markdown.slice(
                        0,
                        selection.start
                    ) +
                    pasted +
                    markdown.slice(
                        selection.end
                    );

                var newCaret =
                    selection.start +
                    pasted.length;

                editor._richRendering = true;

                editor.innerHTML = '';

                next
                    .split('\n')
                    .forEach(function (line) {
                        editor.appendChild(
                            renderLineToEditor(
                                line
                            )
                        );
                    });

                editor._richRendering = false;

                setDocumentCaretOffset(
                    editor,
                    newCaret
                );

                editor._richLastState =
                    captureState(editor);

                editor.dispatchEvent(
                    new Event(
                        'input',
                        { bubbles: true }
                    )
                );
            }
        );


        /*
         * Custom undo / redo.
         *
         * Ctrl+Z
         * Ctrl+Shift+Z
         * Ctrl+Y
         */
        editor.addEventListener(
            'keydown',
            function (event) {
                if (
                    !(event.ctrlKey || event.metaKey)
                ) {
                    return;
                }

                var key =
                    event.key.toLowerCase();

                if (
                    key === 'z' &&
                    !event.shiftKey
                ) {
                    event.preventDefault();

                    undoEditor(editor);

                    return;
                }

                if (
                    (
                        key === 'z' &&
                        event.shiftKey
                    ) ||
                    key === 'y'
                ) {
                    event.preventDefault();

                    redoEditor(editor);
                }
            }
        );
    });


window.text2html = function (editor) {
    return editorToMarkdown(editor)
        .split('\n')
        .map(lineToCopiedHtml)
        .join('');
};
}());
