(function() {

    const FoodDatabase = {
        foods: {},
        searchIndex: [],

        async initialize() {
            const [foundation, srLegacy, custom] = await Promise.all([
                fetch("data/foundation.json").then(response => response.json()),
                fetch("data/sr-legacy.json").then(response => response.json()),
                fetch("data/custom.json").then(response => response.json())
            ]);

            // Keep every FDC ID. Foundation wins if the same ID exists in both.
            this.foods = {
                ...srLegacy,
                ...foundation,
                ...custom
            };

            this.buildSearchIndex(foundation, srLegacy, custom);

            console.log(`Loaded ${Object.keys(this.foods).length} foods`);
        },

        get(fdcId) {
            return this.foods[String(fdcId)];
        },

        buildSearchIndex(foundation, srLegacy, custom) {
            this.searchIndex = [];

            // Don't show identical descriptions multiple times in search.
            const seenNames = new Set();

            const addDatabase = database => {
                for (const [fdcId, food] of Object.entries(database)) {
                    const name = food[0];

                    if (!name) {
                        continue;
                    }

                    const normalized = this.normalize(name);

                    if (seenNames.has(normalized)) {
                        continue;
                    }

                    seenNames.add(normalized);

                    this.searchIndex.push({
                        fdcId: Number(fdcId),
                        name: name,
                        normalized: normalized
                    });
                }
            };

            // Prefer Foundation when descriptions are identical.
            addDatabase(foundation);
            addDatabase(srLegacy);
            addDatabase(custom);
        },

        normalize(text) {
            return String(text)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim();
        },

        search(term, limit = 100) {
            const query = this.normalize(term);

            if (!query) {
                return [];
            }

            const results = [];

            for (const item of this.searchIndex) {
                const score = this.score(item.normalized, query);

                if (score !== null) {
                    results.push({
                        fdcId: item.fdcId,
                        name: item.name,
                        score: score
                    });
                }
            }

            results.sort((a, b) => {
                if (a.score !== b.score) {
                    return a.score - b.score;
                }

                if (a.name.length !== b.name.length) {
                    return a.name.length - b.name.length;
                }

                return a.name.localeCompare(b.name);
            });

            return results.slice(0, limit);
        },

        score(name, query) {
            if (name === query) {
                return 0;
            }

            if (name.startsWith(query)) {
                return 1;
            }

            const nameWords = name.split(" ");

            if (nameWords.some(word => word === query)) {
                return 2;
            }

            if (nameWords.some(word => word.startsWith(query))) {
                return 3;
            }

            if (name.includes(query)) {
                return 4;
            }

            const queryWords = query.split(" ").filter(Boolean);

            if (queryWords.every(queryWord =>
                nameWords.some(nameWord => nameWord.startsWith(queryWord))
            )) {
                return 5;
            }

            if (queryWords.every(queryWord => name.includes(queryWord))) {
                return 6;
            }

            return null;
        }
    };

    window.FoodDatabase = FoodDatabase;

}());
