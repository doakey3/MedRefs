(function() {

    const Storage = {

        initialize() {
            document.addEventListener("dragover", event => {
                event.preventDefault();
            });

            document.addEventListener("drop", event => {
                event.preventDefault();

                const file = event.dataTransfer.files[0];

                if (file && file.name.endsWith(".json")) {
                    this.load(file);
                }
            });
        },

        save() {
            const data = {
                title: MealPlanner.meal.title,
                goal: MealPlanner.meal.goal,
                image: MealPlanner.meal.image || null,
                instructions: MealPlanner.meal.instructions || "",
                ingredients: MealPlanner.meal.ingredients.map(item => {
                    if (item.type === "divider") {
                        return {
                            type: "divider",
                            title: item.title || ""
                        };
                    }

                    const food = FoodDatabase.get(item.fdcId);

                    return {
                        type: "ingredient",
                        fdcId: item.fdcId,
                        name: food ? food[0] : "Unknown food",
                        grams: item.grams,
                        comment: item.comment || ""
                    };
                })
            };

            const blob = new Blob(
                [JSON.stringify(data, null, 2)],
                {type: "application/json"}
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = this.filename();

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);
        },

        filename() {
            let name = MealPlanner.meal.title || "meal";

            name = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");

            return `${name || "meal"}.json`;
        },

        load(file) {
            const reader = new FileReader();

            reader.onload = event => {
                try {
                    const data = JSON.parse(event.target.result);

                    MealPlanner.setMeal(
                        this.normalize(data)
                    );
                }
                catch(error) {
                    console.error("Could not load meal:", error);
                    alert("Invalid meal file.");
                }
            };

            reader.readAsText(file);
        },

        normalize(data) {
            if (Array.isArray(data.ingredients)) {
                return {
                    title: data.title || "Imported meal",
                    goal: data.goal || "maintenance",
                    image: data.image || null,
                    ingredients: data.ingredients.map(item => {
                        if (item.type === "divider") {
                            return {
                                type: "divider",
                                title: item.title || ""
                            };
                        }

                        return {
                            type: "ingredient",
                            fdcId: Number(item.fdcId),
                            grams: Number(item.grams),
                            comment: item.comment || ""
                        };
                    })
                };
            }

            if (data && typeof data === "object") {
                return {
                    title: "Imported meal",
                    goal: "maintenance",
                    image: "",
                    instructions: "",
                    ingredients: Object.entries(data).map(([fdcId, grams]) => ({
                        type: "ingredient",
                        fdcId: Number(fdcId),
                        grams: Number(grams),
                        comment: ""
                    }))
                };
            }

            throw new Error("Unknown meal format");
        }

    };

    window.Storage = Storage;

}());
