(function() {

    const MIN_VALUE = 0;
    const MAX_VALUE = 999.9;
    const PIXELS_PER_STEP = 10;


    function clamp(value) {
        return Math.min(MAX_VALUE, Math.max(MIN_VALUE, value));
    }


    function initialize(slider) {
        if (slider.dataset.numberSliderInitialized === "true") {
            return;
        }

        slider.dataset.numberSliderInitialized = "true";

        const decrease = document.createElement("button");
        const input = document.createElement("input");
        const increase = document.createElement("button");

        decrease.type = "button";
        decrease.textContent = "◀";
        decrease.setAttribute("aria-label", "Decrease");

        input.type = "text";
        input.inputMode = "decimal";
        input.setAttribute("aria-label", "Value");

        increase.type = "button";
        increase.textContent = "▶";
        increase.setAttribute("aria-label", "Increase");

        slider.replaceChildren(decrease, input, increase);


        let value = Number(slider.dataset.value ?? 0);
        if (!Number.isFinite(value)) {
            value = 0;
        }

        value = clamp(value);

        let dragging = false;
        let hasMoved = false;

        let anchorX = 0;
        let anchorValue = value;
        let shiftWasDown = false;

        function formatValue(number) {
            number = Number(number.toFixed(1));
            return String(number);
        }


        function emitChange() {
            slider.dispatchEvent(new CustomEvent("change", {
                bubbles: true,
                detail: {
                    value: value
                }
            }));
        }


        function setValue(newValue, emit = true) {
            newValue = Number(newValue);

            if (!Number.isFinite(newValue)) {
                newValue = MIN_VALUE;
            }

            value = Number(clamp(newValue).toFixed(1));

            input.value = formatValue(value);
            slider.dataset.value = value;

            if (emit) {
                emitChange();
            }
        }


        function getValue() {
            return value;
        }


        function normalizeTypedValue() {
            if (input.value === "" || input.value === ".") {
                setValue(MIN_VALUE);
                return;
            }

            setValue(Number(input.value));
        }


        // ----------------------------------------------------
        // Typing
        // ----------------------------------------------------

        input.addEventListener("beforeinput", event => {
            if (
                event.inputType.startsWith("delete") ||
                event.inputType === "historyUndo" ||
                event.inputType === "historyRedo"
            ) {
                return;
            }

            if (event.data === null) {
                return;
            }

            if (!/^[0-9.]+$/.test(event.data)) {
                event.preventDefault();
                return;
            }

            const start = input.selectionStart;
            const end = input.selectionEnd;

            const prospective =
                input.value.slice(0, start) +
                event.data +
                input.value.slice(end);

            if (!/^\d*\.?\d*$/.test(prospective)) {
                event.preventDefault();
            }
        });


        input.addEventListener("input", () => {
            let text = input.value.replace(/[^0-9.]/g, "");

            const firstDot = text.indexOf(".");

            if (firstDot !== -1) {
                text =
                    text.slice(0, firstDot + 1) +
                    text.slice(firstDot + 1).replace(/\./g, "");
            }

            input.value = text;
        });


        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                input.blur();
                return;
            }

            if (event.key === "Tab") {
                event.preventDefault();

                normalizeTypedValue();

                const inputs = [...document.querySelectorAll(".number-slider input")];
                const currentIndex = inputs.indexOf(input);
                const direction = event.shiftKey ? -1 : 1;
                const nextInput = inputs[currentIndex + direction];

                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                }
            }
        });


        input.addEventListener("blur", () => {
            normalizeTypedValue();
        });


        input.addEventListener("dblclick", event => {
            event.preventDefault();

            input.focus();
            input.select();
        });


        // ----------------------------------------------------
        // Triangle buttons
        // ----------------------------------------------------

        decrease.addEventListener("click", event => {
            const amount = event.shiftKey ? 0.1 : 1;
            setValue(value - amount);
        });


        increase.addEventListener("click", event => {
            const amount = event.shiftKey ? 0.1 : 1;
            setValue(value + amount);
        });


        // ----------------------------------------------------
        // Dragging
        // ----------------------------------------------------

        input.addEventListener("pointerdown", event => {
            event.preventDefault();

            dragging = true;
            hasMoved = false;

            anchorX = event.clientX;
            anchorValue = value;
            shiftWasDown = event.shiftKey;

            input.setPointerCapture(event.pointerId);
        });


        input.addEventListener("pointermove", event => {
            if (!dragging) {
                return;
            }

            const dx = event.clientX - anchorX;

            if (!hasMoved && Math.abs(dx) < 3) {
                return;
            }

            if (!hasMoved) {
                hasMoved = true;
                input.blur();
                slider.classList.add("dragging");
            }

            /*
             * If Shift changes state while dragging, make the
             * current position/value the new anchor.
             *
             * Example:
             * 8 -> hold Shift -> 8.2 -> release Shift -> 10.2
             */
            if (event.shiftKey !== shiftWasDown) {
                anchorX = event.clientX;
                anchorValue = value;
                shiftWasDown = event.shiftKey;
                return;
            }

            const step = event.shiftKey ? 0.1 : 1;
            const steps = Math.trunc((event.clientX - anchorX) / PIXELS_PER_STEP);

            setValue(anchorValue + steps * step);
        });


        input.addEventListener("pointerup", event => {
            if (!dragging) {
                return;
            }

            dragging = false;
            slider.classList.remove("dragging");

            if (input.hasPointerCapture(event.pointerId)) {
                input.releasePointerCapture(event.pointerId);
            }

            /*
             * After an actual drag, leave the field unfocused.
             */
            if (hasMoved) {
                return;
            }

            /*
             * A normal click should activate text editing.
             */
            input.focus();

            const length = input.value.length;
            input.setSelectionRange(length, length);
        });


        input.addEventListener("pointercancel", event => {
            dragging = false;
            slider.classList.remove("dragging");

            if (input.hasPointerCapture(event.pointerId)) {
                input.releasePointerCapture(event.pointerId);
            }
        });


        // Public API for this specific slider.
        slider.numberSlider = {
            getValue,
            setValue
        };

        setValue(value, false);
    }


    function initializeAll(root = document) {
        root.querySelectorAll(".number-slider").forEach(initialize);
    }


    function getValue(slider) {
        initialize(slider);
        return slider.numberSlider.getValue();
    }


    function setValue(slider, value) {
        initialize(slider);
        slider.numberSlider.setValue(value);
    }


    window.NumberSlider = {
        initialize,
        initializeAll,
        getValue,
        setValue
    };


    document.addEventListener("DOMContentLoaded", () => {
        initializeAll();
    });

}());
