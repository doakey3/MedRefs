(function() {

    const Nutrition = {


        /*
         * Nutrient indexes match the compressed food database.
         *
         * These should stay synchronized with the Python
         * compressor that generated the JSON files.
         */
        NUTRIENTS: {

            NAME: 0,

            PROTEIN: 1,
            FAT: 2,
            CARBS: 3,
            FIBER: 4,

            CALCIUM: 5,
            IRON: 6,
            MAGNESIUM: 7,
            POTASSIUM: 8,
            SODIUM: 9,

            ZINC: 10,
            COPPER: 11,

            IODINE: 12,
            SELENIUM: 13,

            VITAMIN_D: 14,
            FOLATE: 15,
            VITAMIN_B12: 16,

            CHOLESTEROL: 17,
            TRANS_FAT: 18,
            SATURATED_FAT: 19

        },


        /*
         * FDA Daily Values.
         *
         * Units:
         * g, mg, or µg depending on nutrient.
         */
        DAILY_VALUES: {

            fiber: 28,

            calcium: 1300,

            iron: 18,

            magnesium: 420,

            potassium: 4700,

            sodium: 2300,

            zinc: 11,

            copper: 0.9,

            iodine: 150,

            selenium: 55,

            vitaminD: 20,

            folate: 400,

            vitaminB12: 2.4,

            vitaminC: 90,

            cholesterol: 300,

            saturatedFat: 20

        },


        /*
         * Macro calorie targets.
         */
        GOALS: {

            maintenance: {

                name: "Maintenance",

                protein: [
                    20,
                    25
                ],

                carbs: [
                    40,
                    55
                ],

                fat: [
                    20,
                    30
                ]

            },


            muscle: {

                name: "Muscle building",

                protein: [
                    20,
                    30
                ],

                carbs: [
                    40,
                    55
                ],

                fat: [
                    20,
                    30
                ]

            },


            weightLoss: {

                name: "Weight loss",

                protein: [
                    25,
                    35
                ],

                carbs: [
                    30,
                    45
                ],

                fat: [
                    20,
                    30
                ]

            }

        },


        value(
            food,
            index
        ) {

            const value =
                Number(
                    food[index]
                );


            return Number.isFinite(value)
                ? value
                : 0;

        },


        calculate(meal) {


            const totals = {

                weight: 0,

                calories: 0,


                protein: 0,

                carbs: 0,

                fat: 0,

                fiber: 0,


                calcium: 0,

                iron: 0,

                magnesium: 0,

                potassium: 0,

                sodium: 0,


                zinc: 0,

                copper: 0,


                iodine: 0,

                selenium: 0,


                vitaminD: 0,

                folate: 0,

                vitaminB12: 0,


                cholesterol: 0,

                transFat: 0,

                saturatedFat: 0

            };


            for (const ingredient of meal.ingredients) {

                if (ingredient.type !== "ingredient") {
                    continue;
                }

                const food = FoodDatabase.get(
                    ingredient.fdcId
                );

                if (!food) {
                    continue;
                }


                const multiplier =
                    ingredient.grams / 100;


                totals.weight +=
                    ingredient.grams;


                totals.protein +=
                    this.value(
                        food,
                        this.NUTRIENTS.PROTEIN
                    )
                    *
                    multiplier;


                totals.carbs +=
                    this.value(
                        food,
                        this.NUTRIENTS.CARBS
                    )
                    *
                    multiplier;


                totals.fat +=
                    this.value(
                        food,
                        this.NUTRIENTS.FAT
                    )
                    *
                    multiplier;


                totals.fiber +=
                    this.value(
                        food,
                        this.NUTRIENTS.FIBER
                    )
                    *
                    multiplier;



                totals.calcium +=
                    this.value(
                        food,
                        this.NUTRIENTS.CALCIUM
                    )
                    *
                    multiplier;


                totals.iron +=
                    this.value(
                        food,
                        this.NUTRIENTS.IRON
                    )
                    *
                    multiplier;


                totals.magnesium +=
                    this.value(
                        food,
                        this.NUTRIENTS.MAGNESIUM
                    )
                    *
                    multiplier;


                totals.potassium +=
                    this.value(
                        food,
                        this.NUTRIENTS.POTASSIUM
                    )
                    *
                    multiplier;


                totals.sodium +=
                    this.value(
                        food,
                        this.NUTRIENTS.SODIUM
                    )
                    *
                    multiplier;


                totals.zinc +=
                    this.value(
                        food,
                        this.NUTRIENTS.ZINC
                    )
                    *
                    multiplier;


                totals.copper +=
                    this.value(
                        food,
                        this.NUTRIENTS.COPPER
                    )
                    *
                    multiplier;


                totals.iodine +=
                    this.value(
                        food,
                        this.NUTRIENTS.IODINE
                    )
                    *
                    multiplier;


                totals.selenium +=
                    this.value(
                        food,
                        this.NUTRIENTS.SELENIUM
                    )
                    *
                    multiplier;


                totals.vitaminD +=
                    this.value(
                        food,
                        this.NUTRIENTS.VITAMIN_D
                    )
                    *
                    multiplier;


                totals.folate +=
                    this.value(
                        food,
                        this.NUTRIENTS.FOLATE
                    )
                    *
                    multiplier;


                totals.vitaminB12 +=
                    this.value(
                        food,
                        this.NUTRIENTS.VITAMIN_B12
                    )
                    *
                    multiplier;


                totals.cholesterol +=
                    this.value(
                        food,
                        this.NUTRIENTS.CHOLESTEROL
                    )
                    *
                    multiplier;


                totals.transFat +=
                    this.value(
                        food,
                        this.NUTRIENTS.TRANS_FAT
                    )
                    *
                    multiplier;


                totals.saturatedFat +=
                    this.value(
                        food,
                        this.NUTRIENTS.SATURATED_FAT
                    )
                    *
                    multiplier;

            }


            /*
             * Calories are calculated from macros rather
             * than relying on USDA calories.
             *
             * This keeps the macro percentages internally
             * consistent.
             */
            const proteinCalories =
                totals.protein * 4;


            const carbCalories =
                totals.carbs * 4;


            const fatCalories =
                totals.fat * 9;


            totals.calories =
                proteinCalories +
                carbCalories +
                fatCalories;


            if (
                totals.calories > 0
            ) {

                totals.macroPercent = {

                    protein:
                        proteinCalories /
                        totals.calories *
                        100,


                    carbs:
                        carbCalories /
                        totals.calories *
                        100,


                    fat:
                        fatCalories /
                        totals.calories *
                        100

                };

            }
            else {

                totals.macroPercent = {

                    protein: 0,

                    carbs: 0,

                    fat: 0

                };

            }


            totals.dailyValues =
                this.calculateDailyValues(
                    totals
                );


            return totals;

        },


        calculateDailyValues(
            totals
        ) {

            return {

                fiber:
                    totals.fiber /
                    this.DAILY_VALUES.fiber *
                    100,


                calcium:
                    totals.calcium /
                    this.DAILY_VALUES.calcium *
                    100,


                iron:
                    totals.iron /
                    this.DAILY_VALUES.iron *
                    100,


                magnesium:
                    totals.magnesium /
                    this.DAILY_VALUES.magnesium *
                    100,


                potassium:
                    totals.potassium /
                    this.DAILY_VALUES.potassium *
                    100,


                sodium:
                    totals.sodium /
                    this.DAILY_VALUES.sodium *
                    100,


                zinc:
                    totals.zinc /
                    this.DAILY_VALUES.zinc *
                    100,


                copper:
                    totals.copper /
                    this.DAILY_VALUES.copper *
                    100,


                iodine:
                    totals.iodine /
                    this.DAILY_VALUES.iodine *
                    100,


                selenium:
                    totals.selenium /
                    this.DAILY_VALUES.selenium *
                    100,


                vitaminD:
                    totals.vitaminD /
                    this.DAILY_VALUES.vitaminD *
                    100,


                folate:
                    totals.folate /
                    this.DAILY_VALUES.folate *
                    100,


                vitaminB12:
                    totals.vitaminB12 /
                    this.DAILY_VALUES.vitaminB12 *
                    100

            };

        },


        evaluateMacros(
            totals,
            goalName
        ) {

            const goal = this.GOALS[goalName];

            if (!goal) {
                console.error("Unknown nutrition goal:", goalName);
                return "red";
            }


            const macros =
                totals.macroPercent;


            const results = {


                protein:
                    this.compareRange(
                        macros.protein,
                        goal.protein
                    ),


                carbs:
                    this.compareRange(
                        macros.carbs,
                        goal.carbs
                    ),


                fat:
                    this.compareRange(
                        macros.fat,
                        goal.fat
                    )

            };


            const values =
                Object.values(results);


            /*
             * Any red = red
             * Any yellow = yellow
             * Everything green = green
             */
            if (
                values.includes("red")
            ) {

                return "red";

            }


            if (
                values.includes("yellow")
            ) {

                return "yellow";

            }


            return "green";

        },


        compareRange(
            value,
            range
        ) {

            const lower =
                range[0];

            const upper =
                range[1];


            if (
                value >= lower &&
                value <= upper
            ) {

                return "green";

            }


            /*
             * Within 5 percentage points
             * is acceptable.
             */
            if (
                value >= lower - 5 &&
                value <= upper + 5
            ) {

                return "yellow";

            }


            return "red";

        }


    };


    window.Nutrition =
        Nutrition;


}());
