(function() {

    const select =
        document.getElementById("meal-goal");

    const dropdown =
        document.getElementById("meal-goal-dropdown");

    const button =
        document.getElementById("meal-goal-button");

    const menu =
        document.getElementById("meal-goal-menu");


    if (
        !select ||
        !dropdown ||
        !button ||
        !menu
    ) {
        return;
    }


    /*
     * Reuse the chart palette directly so the dropdown
     * cannot drift away from the pie-chart colors.
     */
    if (
        window.MealChart &&
        MealChart.colors
    ) {
        dropdown.style.setProperty(
            "--macro-protein-color",
            MealChart.colors.protein
        );

        dropdown.style.setProperty(
            "--macro-carbs-color",
            MealChart.colors.carbs
        );

        dropdown.style.setProperty(
            "--macro-fat-color",
            MealChart.colors.fat
        );
    }


    const goalOrder = [
        "maintenance",
        "weightLoss",
        "muscle"
    ];


    function goalMarkup(
        goalName
    ) {

        const goal =
            Nutrition.GOALS[goalName];

        if (
            !goal
        ) {
            return "";
        }


        return (
            '<span class="goal-dropdown-value">' +
                '<span class="goal-dropdown-name">' +
                    goal.name +
                '</span>' +
                '<span class="goal-dropdown-separator">: </span>' +
                '<span class="goal-dropdown-protein">' +
                    goal.target.protein +
                '</span>' +
                '<span class="goal-dropdown-separator">/</span>' +
                '<span class="goal-dropdown-carbs">' +
                    goal.target.carbs +
                '</span>' +
                '<span class="goal-dropdown-separator">/</span>' +
                '<span class="goal-dropdown-fat">' +
                    goal.target.fat +
                '</span>' +
            '</span>'
        );

    }


    function closeMenu() {

        menu.hidden =
            true;

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    function openMenu() {

        syncFromSelect();

        menu.hidden =
            false;

        button.setAttribute(
            "aria-expanded",
            "true"
        );


        const selected =
            menu.querySelector(
                '[aria-selected="true"]'
            );

        if (
            selected
        ) {
            selected.focus();
        }

    }


    function syncFromSelect() {

        const goalName =
            select.value;

        button.innerHTML =
            goalMarkup(
                goalName
            );


        for (
            const option
            of menu.querySelectorAll(
                ".goal-dropdown-option"
            )
        ) {
            option.setAttribute(
                "aria-selected",
                option.dataset.value === goalName
                    ? "true"
                    : "false"
            );
        }

    }


    function chooseGoal(
        goalName
    ) {

        if (
            !Nutrition.GOALS[goalName]
        ) {
            return;
        }


        select.value =
            goalName;

        syncFromSelect();

        closeMenu();


        select.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );

        button.focus();

    }


    for (
        const goalName
        of goalOrder
    ) {

        const option =
            document.createElement(
                "button"
            );

        option.type =
            "button";

        option.className =
            "goal-dropdown-option";

        option.dataset.value =
            goalName;

        option.setAttribute(
            "role",
            "option"
        );

        option.innerHTML =
            goalMarkup(
                goalName
            );


        option.addEventListener(
            "click",
            function() {
                chooseGoal(
                    goalName
                );
            }
        );


        option.addEventListener(
            "keydown",
            function(event) {

                const options =
                    Array.from(
                        menu.querySelectorAll(
                            ".goal-dropdown-option"
                        )
                    );

                const currentIndex =
                    options.indexOf(
                        option
                    );


                if (
                    event.key === "ArrowDown" ||
                    event.key === "ArrowUp"
                ) {
                    event.preventDefault();

                    const direction =
                        event.key === "ArrowDown"
                            ? 1
                            : -1;

                    const nextIndex =
                        (
                            currentIndex +
                            direction +
                            options.length
                        )
                        %
                        options.length;

                    options[nextIndex].focus();
                }

                else if (
                    event.key === "Home" ||
                    event.key === "End"
                ) {
                    event.preventDefault();

                    options[
                        event.key === "Home"
                            ? 0
                            : options.length - 1
                    ].focus();
                }

                else if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();

                    chooseGoal(
                        goalName
                    );
                }

                else if (
                    event.key === "Escape"
                ) {
                    event.preventDefault();

                    closeMenu();
                    button.focus();
                }

            }
        );


        menu.appendChild(
            option
        );

    }


    button.addEventListener(
        "click",
        function() {

            if (
                menu.hidden
            ) {
                openMenu();
            }

            else {
                closeMenu();
            }

        }
    );


    button.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "ArrowDown" ||
                event.key === "ArrowUp"
            ) {
                event.preventDefault();
                openMenu();
            }

            else if (
                event.key === "Escape"
            ) {
                closeMenu();
            }

        }
    );


    select.addEventListener(
        "change",
        syncFromSelect
    );

    select.addEventListener(
        "input",
        syncFromSelect
    );


    /*
     * Keep the visual control synchronized when existing
     * application code assigns select.value directly.
     */
    const valueDescriptor =
        Object.getOwnPropertyDescriptor(
            HTMLSelectElement.prototype,
            "value"
        );

    if (
        valueDescriptor &&
        valueDescriptor.get &&
        valueDescriptor.set
    ) {
        Object.defineProperty(
            select,
            "value",
            {
                configurable: true,

                get() {
                    return valueDescriptor.get.call(
                        this
                    );
                },

                set(value) {
                    valueDescriptor.set.call(
                        this,
                        value
                    );

                    syncFromSelect();
                }
            }
        );
    }


    document.addEventListener(
        "click",
        function(event) {

            if (
                !dropdown.contains(
                    event.target
                )
            ) {
                closeMenu();
            }

        }
    );


    syncFromSelect();

}());
