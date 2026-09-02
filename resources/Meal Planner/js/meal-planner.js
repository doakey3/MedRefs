(function() {

    const MealPlanner = {
        meal: {
            title: "Untitled meal",
            goal: "maintenance",
            image: null,
            instructions: "",
            ingredients: []
        },

        searchResults: [],
        selectedSearchResult: -1,

        async initialize() {
            this.cacheElements();
            this.connectControls();

            NumberSlider.initializeAll();
            MealImage.initialize();
            MealChart.initialize(this.elements.chart);
            Storage.initialize();

            try {
                this.elements.searchStatus.textContent = "Loading food database...";
                await FoodDatabase.initialize();

                this.elements.searchStatus.textContent =
                    `${FoodDatabase.searchIndex.length.toLocaleString()} foods available.`;

                this.elements.instructions.value = this.meal.instructions || "";
                
                Ingredients.initialize();
                this.updateNutrition();
            }
            catch(error) {
                console.error("Failed to initialize Meal Planner:", error);
                this.elements.searchStatus.textContent = "Could not load food database.";
            }
        },

        cacheElements() {
            this.elements = {
                title: document.getElementById("meal-title"),
                goal: document.getElementById("meal-goal"),
                instructions: document.getElementById("meal-instructions"),

                addFoodButton: document.getElementById("add-food-button"),
                addDividerButton: document.getElementById("add-divider-button"),
                foodDialog: document.getElementById("food-dialog"),
                closeFoodDialog: document.getElementById("close-food-dialog"),
                searchInput: document.getElementById("food-search-input"),
                searchStatus: document.getElementById("food-search-status"),
                searchResults: document.getElementById("food-search-results"),

                chart: document.getElementById("macro-chart"),

                calories: document.getElementById("nutrition-calories"),
                weight: document.getElementById("nutrition-weight"),
                protein: document.getElementById("nutrition-protein"),
                carbs: document.getElementById("nutrition-carbs"),
                fat: document.getElementById("nutrition-fat"),
                micronutrients: document.getElementById("micronutrients"),

                mealScale: document.getElementById("meal-scale"),

                loadButton: document.getElementById("load-meal-button"),
                saveButton: document.getElementById("save-meal-button"),
                fileInput: document.getElementById("meal-file-input")
            };
        },

        connectControls() {
            const e = this.elements;

            e.title.addEventListener("input", () => {
                this.meal.title = e.title.value;
            });

            e.goal.addEventListener("change", () => {
                this.meal.goal = e.goal.value;
                this.updateNutrition();
            });

            e.instructions.addEventListener("input", () => {
                this.meal.instructions = e.instructions.value;
            });

            e.addFoodButton.addEventListener("click", () => {
                this.openFoodDialog();
            });

            e.addDividerButton.addEventListener("click", () => {
                this.addDivider();
            });

            e.closeFoodDialog.addEventListener("click", () => {
                e.foodDialog.close();
            });

            e.searchInput.addEventListener("input", () => {
                this.searchFoods();
            });

            e.searchInput.addEventListener("keydown", event => {
                this.handleSearchKey(event);
            });

            e.saveButton.addEventListener("click", () => {
                Storage.save();
            });

            e.loadButton.addEventListener("click", () => {
                e.fileInput.value = "";
                e.fileInput.click();
            });

            e.fileInput.addEventListener("change", () => {
                const file = e.fileInput.files[0];

                if (file) {
                    Storage.load(file);
                }
            });

            e.foodDialog.addEventListener("click", event => {
                if (event.target === e.foodDialog) {
                    e.foodDialog.close();
                }
            });

            e.mealScale.addEventListener("pointerdown", () => {
                this.beginScaling();
            }, true);

            e.mealScale.addEventListener("change", event => {
                if (this.resettingScale) {
                    return;
                }

                this.applyScale(event.detail.value);
            });

            e.mealScale.addEventListener("pointerup", () => {
                this.finishScaling();
            });

            e.mealScale.addEventListener("pointercancel", () => {
                this.finishScaling();
            });

            e.mealScale.addEventListener("click", event => {
                if (event.target.closest("button")) {
                    this.finishScaling();
                }
            });

            e.mealScale.addEventListener("focusout", () => {
                if (this.scaling) {
                    window.setTimeout(() => {
                        this.finishScaling();
                    }, 0);
                }
            });
        },

        openFoodDialog() {
            const e = this.elements;

            e.searchInput.value = "";
            e.searchResults.replaceChildren();

            this.searchResults = [];
            this.selectedSearchResult = -1;

            e.searchStatus.textContent =
                `${FoodDatabase.searchIndex.length.toLocaleString()} foods available.`;

            e.foodDialog.showModal();
            e.searchInput.focus();
        },

        searchFoods() {
            const query = this.elements.searchInput.value;

            this.searchResults = FoodDatabase.search(query, 100);
            this.selectedSearchResult = -1;

            this.renderSearchResults();
        },

        renderSearchResults() {
            const container = this.elements.searchResults;

            container.replaceChildren();

            if (!this.elements.searchInput.value.trim()) {
                this.elements.searchStatus.textContent =
                    `${FoodDatabase.searchIndex.length.toLocaleString()} foods available.`;
                return;
            }

            this.elements.searchStatus.textContent =
                `${this.searchResults.length} ${this.searchResults.length === 1 ? "match" : "matches"}.`;

            this.searchResults.forEach((result, index) => {
                const button = document.createElement("button");

                button.type = "button";
                button.className = "food-result";

                const name = document.createElement("span");
                name.className = "food-result-name";
                name.textContent = result.name;

                const id = document.createElement("span");
                id.className = "food-result-id";
                id.textContent = `FDC ${result.fdcId}`;

                button.append(name, id);

                button.addEventListener("click", () => {
                    this.chooseSearchResult(index);
                });

                button.addEventListener("mouseenter", () => {
                    this.selectedSearchResult = index;
                    this.updateSelectedSearchResult();
                });

                container.appendChild(button);
            });
        },

        handleSearchKey(event) {
            if (event.key === "ArrowDown") {
                event.preventDefault();

                if (!this.searchResults.length) {
                    return;
                }

                this.selectedSearchResult++;

                if (this.selectedSearchResult >= this.searchResults.length) {
                    this.selectedSearchResult = 0;
                }

                this.updateSelectedSearchResult();
                return;
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                if (!this.searchResults.length) {
                    return;
                }

                this.selectedSearchResult--;

                if (this.selectedSearchResult < 0) {
                    this.selectedSearchResult = this.searchResults.length - 1;
                }

                this.updateSelectedSearchResult();
                return;
            }

            if (event.key === "Enter") {
                if (!this.searchResults.length) {
                    return;
                }

                event.preventDefault();

                if (this.selectedSearchResult < 0) {
                    this.selectedSearchResult = 0;
                }

                this.chooseSearchResult(this.selectedSearchResult);
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                this.elements.foodDialog.close();
            }
        },

        updateSelectedSearchResult() {
            const rows = this.elements.searchResults.querySelectorAll(".food-result");

            rows.forEach((row, index) => {
                row.classList.toggle("selected", index === this.selectedSearchResult);
            });

            const selected = rows[this.selectedSearchResult];

            if (selected) {
                selected.scrollIntoView({block: "nearest"});
            }
        },

        chooseSearchResult(index) {
            const result = this.searchResults[index];

            if (!result) {
                return;
            }

            Ingredients.add(result.fdcId);
            this.elements.foodDialog.close();
        },

        updateNutrition() {
            const totals = Nutrition.calculate(this.meal);

            this.elements.calories.textContent = ` ${totals.calories.toFixed(0)} kcal`;
            this.elements.weight.textContent = ` ${totals.weight.toFixed(1)} g`;

            this.elements.protein.innerHTML =
                `<span style="color:${MealChart.colors.protein}; font-weight:bold;">Protein</span>: ` +
                `${totals.protein.toFixed(1)} g (${totals.macroPercent.protein.toFixed(1)}%)`;

            this.elements.carbs.innerHTML =
                `<span style="color:${MealChart.colors.carbs}; font-weight:bold;">Carbohydrate</span>: ` +
                `${totals.carbs.toFixed(1)} g (${totals.macroPercent.carbs.toFixed(1)}%)`;

            this.elements.fat.innerHTML =
                `<span style="color:${MealChart.colors.fat}; font-weight:bold;">Fat</span>: ` +
                `${totals.fat.toFixed(1)} g (${totals.macroPercent.fat.toFixed(1)}%)`;

            this.renderMicronutrients(totals);
            MealChart.update(totals, this.meal.goal);
        },

        renderMicronutrients(totals) {
            const rows = [
                ["Fiber", totals.fiber, "g", totals.dailyValues.fiber],
                ["Calcium", totals.calcium, "mg", totals.dailyValues.calcium],
                ["Iron", totals.iron, "mg", totals.dailyValues.iron],
                ["Magnesium", totals.magnesium, "mg", totals.dailyValues.magnesium],
                ["Potassium", totals.potassium, "mg", totals.dailyValues.potassium],
                ["Sodium", totals.sodium, "mg", totals.dailyValues.sodium],
                ["Zinc", totals.zinc, "mg", totals.dailyValues.zinc],
                ["Copper", totals.copper, "mg", totals.dailyValues.copper],
                ["Iodine", totals.iodine, "µg", totals.dailyValues.iodine],
                ["Selenium", totals.selenium, "µg", totals.dailyValues.selenium],
                ["Vitamin D", totals.vitaminD, "µg", totals.dailyValues.vitaminD],
                ["Folate", totals.folate, "µg", totals.dailyValues.folate],
                ["Vitamin B12", totals.vitaminB12, "µg", totals.dailyValues.vitaminB12]
            ];

            this.elements.micronutrients.replaceChildren();

            for (const [name, amount, unit, percent] of rows) {
                const row = document.createElement("div");
                row.className = "nutrition-row";

                const label = document.createElement("span");
                label.className = "nutrition-name";
                label.textContent = name;

                const value = document.createElement("span");
                value.className = "nutrition-value";
                value.textContent = `${this.formatNumber(amount)} ${unit} (${percent.toFixed(0)}% DV)`;

                row.append(label, value);
                this.elements.micronutrients.appendChild(row);
            }
        },

        scaling: false,
        scalingBaseAmounts: null,
        resettingScale: false,

        beginScaling() {
            if (this.scaling) {
                return;
            }

            this.scaling = true;

            this.scalingBaseAmounts = this.meal.ingredients.map(item => {
                if (item.type === "divider") {
                    return null;
                }

                return item.grams;
            });
        },

        applyScale(percent) {
            if (!this.scaling) {
                this.beginScaling();
            }

            const factor = percent / 100;

            this.meal.ingredients.forEach((item, index) => {
                if (item.type === "divider") {
                    return;
                }

                item.grams = Math.round(this.scalingBaseAmounts[index] * factor * 10) / 10;
            });

            Ingredients.render();
            this.updateNutrition();
        },

        finishScaling() {
            if (!this.scaling) {
                return;
            }

            this.scaling = false;
            this.scalingBaseAmounts = null;

            this.resettingScale = true;
            NumberSlider.setValue(this.elements.mealScale, 100);
            this.resettingScale = false;

            Ingredients.render();
            this.updateNutrition();
        },

        formatNumber(value) {
            if (Math.abs(value) >= 100) {
                return value.toFixed(0);
            }

            if (Math.abs(value) >= 10) {
                return value.toFixed(1);
            }

            return value.toFixed(2);
        },

        addDivider() {
            this.meal.ingredients.push({
                type: "divider",
                title: "Divider"
            });

            Ingredients.render();
        },

        setMeal(meal) {
            this.meal = meal;

            this.elements.title.value = meal.title;
            this.elements.goal.value = meal.goal;
            this.elements.instructions.value = meal.instructions || "";

            Ingredients.render();

            if (meal.image) {
                MealImage.set(meal.image);
            }
            else {
                MealImage.clear();
            }
            
            this.updateNutrition();
        },

        appendMeal(meal) {
            this.meal.ingredients.push(...meal.ingredients);

            if (!this.meal.image && meal.image) {
                MealImage.set(meal.image);
            }

            Ingredients.render();
            this.updateNutrition();
        },
    };

    window.MealPlanner = MealPlanner;

    document.addEventListener("DOMContentLoaded", () => {
        MealPlanner.initialize();
    });

}());
