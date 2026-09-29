#!/usr/bin/env python3

import json
from pathlib import Path


# ============================================================
# Output array layout
#
#  0  name
#  1  protein         g / 100 g food
#  2  fat             g / 100 g food
#  3  carbs           g / 100 g food
#  4  fiber           g / 100 g food
#  5  calcium         mg / 100 g food
#  6  iron            mg / 100 g food
#  7  magnesium       mg / 100 g food
#  8  potassium       mg / 100 g food
#  9  sodium          mg / 100 g food
# 10  zinc            mg / 100 g food
# 11  copper          mg / 100 g food
# 12  iodine          µg / 100 g food
# 13  selenium        µg / 100 g food
# 14  vitamin D       µg / 100 g food
# 15  folate          µg / 100 g food
# 16  vitamin B12     µg / 100 g food
# 17  cholesterol     mg / 100 g food
# 18  trans fat       g / 100 g food
# 19  saturated fat   g / 100 g food
# ============================================================


NAME = 0
PROTEIN = 1
FAT = 2
CARBS = 3
FIBER = 4
CALCIUM = 5
IRON = 6
MAGNESIUM = 7
POTASSIUM = 8
SODIUM = 9
ZINC = 10
COPPER = 11
IODINE = 12
SELENIUM = 13
VITAMIN_D = 14
FOLATE = 15
VITAMIN_B12 = 16
CHOLESTEROL = 17
TRANS_FAT = 18
SATURATED_FAT = 19

FIELD_COUNT = 20


# USDA nutrient ID:
#     (array index, desired unit, decimal places)
NUTRIENT_MAP = {
    1003: (PROTEIN, "g", 3),
    1004: (FAT, "g", 3),
    1005: (CARBS, "g", 3),
    1079: (FIBER, "g", 3),

    # Alternative total-fat field
    1085: (FAT, "g", 3),

    1087: (CALCIUM, "mg", 3),
    1089: (IRON, "mg", 3),
    1090: (MAGNESIUM, "mg", 3),
    1092: (POTASSIUM, "mg", 3),
    1093: (SODIUM, "mg", 3),
    1095: (ZINC, "mg", 3),
    1098: (COPPER, "mg", 4),

    1100: (IODINE, "µg", 3),
    1103: (SELENIUM, "µg", 3),
    1114: (VITAMIN_D, "µg", 3),
    1177: (FOLATE, "µg", 3),
    1178: (VITAMIN_B12, "µg", 3),

    1253: (CHOLESTEROL, "mg", 3),
    1257: (TRANS_FAT, "g", 3),
    1258: (SATURATED_FAT, "g", 3),
}


# ============================================================
# Unit conversion
# ============================================================

def normalize_unit(unit):
    unit = unit.strip().lower().replace("μ", "µ")

    if unit in {"mcg", "ug"}:
        return "µg"

    return unit


def convert_unit(amount, source_unit, target_unit):
    """
    Convert a nutrient quantity between g, mg, and µg.

    USDA nutrient quantities are already per 100 g of food,
    so this only converts the nutrient's unit.
    """

    source_unit = normalize_unit(source_unit)
    target_unit = normalize_unit(target_unit)

    factors_to_grams = {
        "g": 1,
        "mg": 1 / 1_000,
        "µg": 1 / 1_000_000,
    }

    if source_unit not in factors_to_grams:
        raise ValueError(
            f"Unsupported source unit: {source_unit}"
        )

    if target_unit not in factors_to_grams:
        raise ValueError(
            f"Unsupported target unit: {target_unit}"
        )

    amount_in_grams = (
        float(amount) *
        factors_to_grams[source_unit]
    )

    return (
        amount_in_grams /
        factors_to_grams[target_unit]
    )


# ============================================================
# Number cleanup
# ============================================================

def clean_number(value, decimal_places):
    """
    Round away meaningless floating-point noise.

    Examples:

        41.00000000000001 -> 41
        1.3800000000001   -> 1.38
    """

    value = round(float(value), decimal_places)

    if value == 0:
        return 0

    if value.is_integer():
        return int(value)

    return value


# ============================================================
# Food conversion
# ============================================================

def normalize_food(food):
    """
    Convert one USDA food record into:

        fdcId: [
            name,
            protein,
            fat,
            ...
        ]

    Missing nutrient values are represented as null in JSON.
    """

    if not isinstance(food, dict):
        return None

    fdc_id = food.get("fdcId")
    description = food.get("description")

    if fdc_id is None or not description:
        return None

    output = [None] * FIELD_COUNT
    output[NAME] = description

    food_nutrients = food.get("foodNutrients")

    if not isinstance(food_nutrients, list):
        food_nutrients = []

    for food_nutrient in food_nutrients:

        if not isinstance(food_nutrient, dict):
            continue

        nutrient = food_nutrient.get("nutrient")

        if not isinstance(nutrient, dict):
            continue

        nutrient_id = nutrient.get("id")

        if nutrient_id not in NUTRIENT_MAP:
            continue

        amount = food_nutrient.get("amount")
        source_unit = nutrient.get("unitName")

        if amount is None or not source_unit:
            continue

        index, target_unit, decimal_places = (
            NUTRIENT_MAP[nutrient_id]
        )

        try:
            value = convert_unit(
                amount,
                source_unit,
                target_unit
            )

        except (ValueError, TypeError):
            continue

        value = clean_number(
            value,
            decimal_places
        )

        # If two USDA nutrient IDs map to the same position,
        # keep whichever one was encountered first.
        #
        # This matters for:
        #
        #   1004 = Total lipid (fat)
        #   1085 = Total fat (NLEA)

        if output[index] is None:
            output[index] = value

    return str(fdc_id), output


# ============================================================
# Remove unnecessary trailing nulls
# ============================================================

def trim_trailing_nulls(food):
    """
    Array positions must remain fixed, but trailing null values
    do not need to be stored.

    For example:

        ["Apple",0.3,0.2,14,2.4,null,null,null]

    can become:

        ["Apple",0.3,0.2,14,2.4]

    JavaScript still returns undefined for the missing positions.
    """

    while len(food) > 1 and food[-1] is None:
        food.pop()

    return food


# ============================================================
# Find USDA food list
# ============================================================

def find_food_list(data):
    """
    Support Foundation and SR Legacy bulk JSON files.
    """

    if isinstance(data, list):
        return data

    if not isinstance(data, dict):
        raise ValueError(
            "Top-level JSON must be an object or list."
        )

    for key in (
        "FoundationFoods",
        "SRLegacyFoods",
    ):
        foods = data.get(key)

        if isinstance(foods, list):
            return foods

    for value in data.values():
        if isinstance(value, list):
            return value

    raise ValueError(
        "Could not find a food list in the input JSON."
    )


# ============================================================
# Main conversion
# ============================================================

def convert(input_path, output_path):

    print(f"Reading: {input_path}")

    with input_path.open(
        "r",
        encoding="utf-8"
    ) as file:
        data = json.load(file)

    foods = find_food_list(data)

    print(
        f"Found {len(foods):,} food records"
    )

    output_foods = {}

    skipped = 0

    for food in foods:

        normalized = normalize_food(food)

        if normalized is None:
            skipped += 1
            continue

        fdc_id, food_data = normalized

        trim_trailing_nulls(food_data)

        output_foods[fdc_id] = food_data

    print(
        f"Writing {len(output_foods):,} foods"
    )

    if skipped:
        print(
            f"Skipped {skipped:,} null or invalid records"
        )

    output_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with output_path.open(
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            output_foods,
            file,
            ensure_ascii=False,
            separators=(",", ":")
        )

    input_size = input_path.stat().st_size
    output_size = output_path.stat().st_size

    print()

    print(
        f"Input size:  "
        f"{input_size / 1024 / 1024:.2f} MB"
    )

    print(
        f"Output size: "
        f"{output_size / 1024 / 1024:.2f} MB"
    )

    if input_size:

        reduction = (
            100 *
            (1 - output_size / input_size)
        )

        print(
            f"Reduction:   {reduction:.1f}%"
        )


# ============================================================
# Run in Geany
# ============================================================

if __name__ == "__main__":

    input_file = Path(
        "FoodData_Central_foundation_food_json_2026-04-30.json"
    )

    output_file = Path(
        "foundation.json"
    )

    convert(
        input_file,
        output_file
    )
