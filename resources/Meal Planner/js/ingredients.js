(function() {

    const Ingredients = {
        list: null,
        draggedId: null,
        dropIndex: null,
        dropIndicator: null,

        initialize() {
            this.list = document.getElementById("ingredient-list");

            this.createDropIndicator();
            this.connectListDragEvents();
            this.render();
        },

        render() {
            this.list.replaceChildren();

            for (const item of MealPlanner.meal.ingredients) {
                if (item.type === "divider") {
                    this.renderDivider(item);
                }
                else {
                    this.renderIngredient(item);
                }
            }

            if (this.dropIndicator) {
                this.list.appendChild(this.dropIndicator);
                this.hideDropIndicator();
            }

            NumberSlider.initializeAll();
        },

        renderIngredient(ingredient) {
            const food = FoodDatabase.get(ingredient.fdcId);

            if (!food) {
                return;
            }

            const row = document.createElement("div");
            row.className = "ingredient-row";
            row.dataset.index = MealPlanner.meal.ingredients.indexOf(ingredient);

            const drag = document.createElement("span");
            drag.className = "drag-handle";
            drag.textContent = "☰";
            drag.draggable = true;
            drag.title = "Drag to reorder";

            const name = document.createElement("span");
            name.className = "ingredient-name";
            name.textContent = food[0];

            const amount = document.createElement("div");
            amount.className = "ingredient-quantity";

            const slider = document.createElement("div");
            slider.className = "number-slider";
            slider.dataset.value = ingredient.grams;

            const unit = document.createElement("span");
            unit.className = "ingredient-unit";
            unit.textContent = "g";

            amount.append(slider, unit);

            const comment = document.createElement("input");
            comment.className = "ingredient-comment";
            comment.type = "text";
            comment.placeholder = "Comment";
            comment.value = ingredient.comment || "";

            comment.addEventListener("input", () => {
                ingredient.comment = comment.value;
            });

            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "delete-ingredient";
            remove.textContent = "×";
            remove.title = "Remove ingredient";

            remove.addEventListener("click", () => {
                this.remove(ingredient.fdcId);
            });

            slider.addEventListener("change", event => {
                ingredient.grams = event.detail.value;
                MealPlanner.updateNutrition();
            });

            drag.addEventListener("dragstart", event => {
                this.draggedId = MealPlanner.meal.ingredients.indexOf(ingredient);

                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(
                    "text/plain",
                    String(this.draggedId)
                );

                row.classList.add("dragging");

                requestAnimationFrame(() => {
                    this.updateDropPosition(event.clientY);
                });
            });

            drag.addEventListener("dragend", () => {
                this.draggedId = null;
                this.dropIndex = null;

                row.classList.remove("dragging");
                this.hideDropIndicator();
            });

            row.append(drag, name, amount, comment, remove);
            this.list.appendChild(row);

            NumberSlider.initialize(slider);
        },

        renderDivider(divider) {

            const row = document.createElement("div");
            row.className = "ingredient-row divider-row";
            row.draggable = true;

            row.dataset.index = MealPlanner.meal.ingredients.indexOf(divider);

            const drag = document.createElement("span");
            drag.className = "drag-handle";
            drag.textContent = "☰";
            drag.draggable = true;
            drag.title = "Drag to reorder";

            const content = document.createElement("div");
            content.className = "ingredient-divider";

            const input = document.createElement("input");
            input.className = "divider-input";
            input.type = "text";
            input.value = divider.title || "";
            input.placeholder = "Section title";

            input.addEventListener("input", () => {
                divider.title = input.value;
            });

            content.append(input);

            const remove = document.createElement("button");
            remove.className = "delete-ingredient";
            remove.type = "button";
            remove.textContent = "×";

            drag.addEventListener("dragstart", event => {
                this.draggedId = MealPlanner.meal.ingredients.indexOf(divider);

                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData(
                    "text/plain",
                    String(this.draggedId)
                );

                row.classList.add("dragging");
            });

            drag.addEventListener("dragend", () => {
                this.draggedId = null;
                this.dropIndex = null;

                row.classList.remove("dragging");
                this.hideDropIndicator();
            });

            remove.addEventListener("click", () => {
                const index = MealPlanner.meal.ingredients.indexOf(divider);

                if (index !== -1) {
                    MealPlanner.meal.ingredients.splice(index, 1);
                    this.render();
                }
            });

            row.append(
                drag,
                content,
                remove
            );

            this.list.append(row);
        },

        createDropIndicator() {
            this.dropIndicator = document.createElement("div");
            this.dropIndicator.className = "ingredient-drop-indicator";
        },

        connectListDragEvents() {
            this.list.addEventListener("dragover", event => {
                if (this.draggedId === null) {
                    return;
                }

                event.preventDefault();
                event.dataTransfer.dropEffect = "move";

                this.updateDropPosition(event.clientY);
            });

            this.list.addEventListener("drop", event => {
                if (this.draggedId === null || this.dropIndex === null) {
                    return;
                }

                event.preventDefault();

                this.moveToIndex(this.draggedId, this.dropIndex);

                this.draggedId = null;
                this.dropIndex = null;
                this.hideDropIndicator();
            });

            this.list.addEventListener("dragleave", event => {
                if (!this.list.contains(event.relatedTarget)) {
                    this.hideDropIndicator();
                }
            });
        },

        updateDropPosition(mouseY) {
            const rows = [...this.list.querySelectorAll(".ingredient-row")]
                .filter(row => Number(row.dataset.index) !== this.draggedId);

            let index = rows.length;

            for (let i = 0; i < rows.length; i++) {
                const rect = rows[i].getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;

                if (mouseY < midpoint) {
                    index = i;
                    break;
                }
            }

            this.dropIndex = index;
            this.showDropIndicator(rows, index);
        },

        showDropIndicator(rows, index) {
            if (!rows.length) {
                this.list.prepend(this.dropIndicator);
                this.dropIndicator.hidden = false;
                return;
            }

            if (index >= rows.length) {
                rows[rows.length - 1].after(this.dropIndicator);
            }
            else {
                rows[index].before(this.dropIndicator);
            }

            this.dropIndicator.hidden = false;
        },

        hideDropIndicator() {
            if (this.dropIndicator) {
                this.dropIndicator.hidden = true;
            }
        },

        moveToIndex(fromIndex, targetIndex) {
            const ingredients = MealPlanner.meal.ingredients;

            const moved = ingredients.splice(fromIndex, 1)[0];

            targetIndex = Math.max(
                0,
                Math.min(targetIndex, ingredients.length)
            );

            ingredients.splice(targetIndex, 0, moved);

            this.render();
        },

        addDivider() {

            MealPlanner.meal.ingredients.push({
                type: "divider",
                title: "Divider"
            });

            this.render();
        },

        add(fdcId, grams = 100) {
            fdcId = Number(fdcId);

            MealPlanner.meal.ingredients.push({
                type: "ingredient",
                fdcId: fdcId,
                grams: grams,
                comment: ""
            });

            this.render();
            MealPlanner.updateNutrition();
        },

        remove(fdcId) {
            MealPlanner.meal.ingredients =
                MealPlanner.meal.ingredients.filter(item => item.fdcId !== fdcId);

            this.render();
            MealPlanner.updateNutrition();
        }
    };

    window.Ingredients = Ingredients;

}());
