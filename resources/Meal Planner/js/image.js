(function() {

    const MealImage = {
        dropArea: null,

        ALLOWED_TYPES: [
            "image/jpeg",
            "image/png",
            "image/webp"
        ],

        MAX_SOURCE_SIZE: 10 * 1024 * 1024,
        OUTPUT_WIDTH: 320,
        OUTPUT_HEIGHT: 240,
        JPEG_QUALITY: 0.85,

        initialize() {
            this.dropArea = document.getElementById("meal-image-drop");

            if (!this.dropArea) {
                console.error("Meal image drop area not found.");
                return;
            }

            this.dropArea.addEventListener("dragover", event => {
                event.preventDefault();
                event.stopPropagation();
                this.dropArea.classList.add("drag-over");
            });

            this.dropArea.addEventListener("dragleave", event => {
                event.preventDefault();
                event.stopPropagation();
                this.dropArea.classList.remove("drag-over");
            });

            this.dropArea.addEventListener("drop", event => {
                event.preventDefault();
                event.stopPropagation();

                this.dropArea.classList.remove("drag-over");

                const file = event.dataTransfer.files[0];

                if (file) {
                    this.loadFile(file);
                }
            });

            if (MealPlanner.meal.image) {
                this.set(MealPlanner.meal.image);
            }
            else {
                this.showPlaceholder();
            }
        },

        async loadFile(file) {
            if (!this.ALLOWED_TYPES.includes(file.type)) {
                alert("Please use a JPEG, PNG, or WebP image.");
                return;
            }

            if (file.size > this.MAX_SOURCE_SIZE) {
                alert("Image is too large. Maximum source image size is 10 MB.");
                return;
            }

            try {
                const sourceUrl = await this.readFile(file);
                const image = await this.loadImage(sourceUrl);
                const dataUrl = this.resizeImage(image);

                this.set(dataUrl);
            }
            catch(error) {
                console.error("Could not load meal image:", error);
                alert("Could not load that image.");
            }
        },

        readFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);

                reader.readAsDataURL(file);
            });
        },

        loadImage(source) {
            return new Promise((resolve, reject) => {
                const image = new Image();

                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error("Image could not be decoded."));
                image.src = source;
            });
        },

        resizeImage(image) {
            const canvas = document.createElement("canvas");
            canvas.width = this.OUTPUT_WIDTH;
            canvas.height = this.OUTPUT_HEIGHT;

            const context = canvas.getContext("2d");

            const sourceRatio = image.naturalWidth / image.naturalHeight;
            const targetRatio = this.OUTPUT_WIDTH / this.OUTPUT_HEIGHT;

            let sourceX = 0;
            let sourceY = 0;
            let sourceWidth = image.naturalWidth;
            let sourceHeight = image.naturalHeight;

            if (sourceRatio > targetRatio) {
                sourceWidth = image.naturalHeight * targetRatio;
                sourceX = (image.naturalWidth - sourceWidth) / 2;
            }
            else if (sourceRatio < targetRatio) {
                sourceHeight = image.naturalWidth / targetRatio;
                sourceY = (image.naturalHeight - sourceHeight) / 2;
            }

            context.drawImage(
                image,
                sourceX,
                sourceY,
                sourceWidth,
                sourceHeight,
                0,
                0,
                this.OUTPUT_WIDTH,
                this.OUTPUT_HEIGHT
            );

            return canvas.toDataURL("image/jpeg", this.JPEG_QUALITY);
        },

        set(dataUrl) {
            MealPlanner.meal.image = dataUrl;

            this.dropArea.replaceChildren();

            const image = document.createElement("img");
            image.className = "meal-image-preview";
            image.src = dataUrl;
            image.alt = "Meal preview";

            this.dropArea.appendChild(image);
        },

        clear() {
            MealPlanner.meal.image = null;
            this.showPlaceholder();
        },

        showPlaceholder() {
            this.dropArea.replaceChildren();

            const placeholder = document.createElement("span");
            placeholder.className = "meal-image-placeholder";
            placeholder.textContent = "Drop meal image here";

            this.dropArea.appendChild(placeholder);
        }
    };

    window.MealImage = MealImage;

}());
