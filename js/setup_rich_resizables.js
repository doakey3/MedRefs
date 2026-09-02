(function () {
    function resize(editor) {
        editor.style.height = 'auto';
        editor.style.height =
            editor.scrollHeight + 'px';
    }

    async function copyEditor(editor, button) {
        var html = window.text2html(editor);

        var plainText =
            window.richText
                .editorToMarkdown(editor)

                // Strip ** from bold text.
                .replace(
                    /\*\*(.+?)\*\*/g,
                    '$1'
                )

                // Replace common operators.
                .replace(/>=/g, '≥')
                .replace(/<=/g, '≤')
                .replace(/!=/g, '≠')
                .replace(/->/g, '→')
                .replace(/<-/g, '←')

                // Replace markdown-ish checkboxes.
                .replace(
                    /^(\s*)\[x\]/gim,
                    '$1☑'
                )
                .replace(
                    /^(\s*)\[ \]/gim,
                    '$1☐'
                )

                // Strip heading markers.
                .replace(
                    /^#{1,3}\s+/gm,
                    ''
                );

        try {
            if (
                navigator.clipboard &&
                window.ClipboardItem
            ) {
                var item =
                    new ClipboardItem({
                        'text/html':
                            new Blob(
                                [html],
                                {
                                    type:
                                        'text/html'
                                }
                            ),

                        'text/plain':
                            new Blob(
                                [plainText],
                                {
                                    type:
                                        'text/plain'
                                }
                            )
                    });

                await navigator.clipboard.write(
                    [item]
                );
            } else {
                /*
                 * Fallback for browsers where
                 * ClipboardItem is unavailable.
                 */
                var temp =
                    document.createElement('div');

                temp.innerHTML = html;

                temp.style.position = 'fixed';
                temp.style.left = '-9999px';
                temp.style.top = '0';

                document.body.appendChild(temp);

                var range =
                    document.createRange();

                range.selectNodeContents(temp);

                var selection =
                    window.getSelection();

                selection.removeAllRanges();

                selection.addRange(range);

                document.execCommand('copy');

                selection.removeAllRanges();

                temp.remove();
            }

            button.textContent = 'Copied';

            setTimeout(function () {
                button.textContent = 'Copy';
            }, 800);
        } catch (error) {
            console.error(
                'Unable to copy rich text:',
                error
            );

            button.textContent = 'Error';

            setTimeout(function () {
                button.textContent = 'Copy';
            }, 1200);
        }
    }

    function addCopyButton(editor) {
        /*
         * The editor's parent acts as the
         * positioning container.
         *
         * This means you can have:
         *
         * <div class="grow-wrap">
         *     <div class="rich-editor resizable">
         *     </div>
         * </div>
         *
         * repeated multiple times on one page.
         */
        var wrapper = editor.parentElement;

        if (!wrapper) {
            return;
        }

        if (
            getComputedStyle(wrapper).position ===
            'static'
        ) {
            wrapper.style.position = 'relative';
        }

        /*
         * Don't accidentally add two buttons
         * if this script is initialized twice.
         */
        var existingButton =
            wrapper.querySelector(
                ':scope > .rich-copy-button'
            );

        if (existingButton) {
            return;
        }

        var button =
            document.createElement('button');

        button.type = 'button';

        button.className =
            'rich-copy-button';

        button.textContent = 'Copy';

        /*
         * Prevent clicking the copy button
         * from moving the caret in the editor.
         */
        button.addEventListener(
            'mousedown',
            function (event) {
                event.preventDefault();
            }
        );

        button.addEventListener(
            'click',
            function (event) {
                event.preventDefault();

                event.stopPropagation();

                copyEditor(
                    editor,
                    button
                );
            }
        );

        wrapper.appendChild(button);
    }

    document
        .querySelectorAll(
            '.rich-editor.resizable'
        )
        .forEach(function (editor) {
            /*
             * Every editor gets its own
             * intrinsic copy button.
             */
            addCopyButton(editor);

            editor.addEventListener(
                'input',
                function () {
                    resize(editor);
                }
            );

            window.addEventListener(
                'load',
                function () {
                    resize(editor);
                }
            );

            new MutationObserver(
                function () {
                    resize(editor);
                }
            ).observe(
                editor,
                {
                    childList: true,
                    subtree: true,
                    characterData: true
                }
            );

            resize(editor);
        });
}());
