(function() {

    const Chart = {


        colors: {

            protein: "#d9534f",

            carbs: "#3b78c5",

            fat: "#c99700"

        },


        statusColors: {

            green: "#3aa655",

            yellow: "#d9a400",

            red: "#c0392b"

        },


        canvas: null,


        initialize(
            canvas
        ) {

            this.canvas =
                canvas;

        },


        update(
            totals,
            goalName
        ) {

            if (
                !this.canvas
            ) {

                return;

            }


            const status =
                Nutrition.evaluateMacros(
                    totals,
                    goalName
                );


            this.draw(
                totals,
                status
            );

        },


        draw(
            totals,
            status
        ) {

            const canvas =
                this.canvas;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            const width =
                canvas.width;


            const height =
                canvas.height;


            ctx.clearRect(
                0,
                0,
                width,
                height
            );


            /*
             * Update border color.
             *
             * The chart itself communicates
             * whether the meal fits the goal.
             */
            canvas.style.border =
                "6px solid " +
                this.statusColors[status];


            canvas.style.borderRadius =
                "50%";


            const protein =
                totals.macroPercent.protein;


            const carbs =
                totals.macroPercent.carbs;


            const fat =
                totals.macroPercent.fat;


            const values = [

                {
                    name: "protein",
                    value: protein,
                    color:
                        this.colors.protein
                },

                {
                    name: "carbs",
                    value: carbs,
                    color:
                        this.colors.carbs
                },

                {
                    name: "fat",
                    value: fat,
                    color:
                        this.colors.fat
                }

            ];


            const total =
                values.reduce(
                    (
                        sum,
                        item
                    ) =>
                        sum +
                        item.value,

                    0
                );


            if (
                total <= 0
            ) {

                return;

            }


            const centerX =
                width / 2;


            const centerY =
                height / 2;


            const radius =
                Math.min(
                    width,
                    height
                )
                *
                0.42;


            let angle =
                -Math.PI / 2;


            for (
                const item
                of values
            ) {


                if (
                    item.value <= 0
                ) {

                    continue;

                }


                const slice =
                    (
                        item.value /
                        total
                    )
                    *
                    Math.PI
                    *
                    2;


                ctx.beginPath();


                ctx.moveTo(
                    centerX,
                    centerY
                );


                ctx.arc(
                    centerX,
                    centerY,
                    radius,
                    angle,
                    angle + slice
                );


                ctx.closePath();


                ctx.fillStyle =
                    item.color;


                ctx.fill();


                angle += slice;

            }


            /*
             * Inner circle gives it a cleaner
             * donut-chart appearance.
             */
            ctx.beginPath();


            ctx.arc(
                centerX,
                centerY,
                radius * 0.55,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "white";


            ctx.fill();


        }


    };


    window.MealChart =
        Chart;


}());
