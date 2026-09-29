#!/usr/bin/env python3

"""Compress one FoodData Central food record into a custom food JSON file."""

import argparse
import importlib.util
import json
from pathlib import Path


def load_compressor(path: Path):
    """Load the existing compressor so both scripts always use the same format."""
    if not path.is_file():
        raise FileNotFoundError(f"Compressor not found: {path}")

    spec = importlib.util.spec_from_file_location("food_data_compressor", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Could not load compressor: {path}")

    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def default_compressor_path(script_directory: Path) -> Path:
    """Prefer the normal filename, while also accepting the uploaded filename."""
    for filename in ("compressor.py", "compressor(2).py"):
        candidate = script_directory / filename
        if candidate.is_file():
            return candidate
    return script_directory / "compressor.py"


def read_json(path: Path):
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def write_json_atomically(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary_path = path.with_suffix(path.suffix + ".tmp")

    with temporary_path.open("w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, separators=(",", ":"))
        file.write("\n")

    temporary_path.replace(path)


def compress_ingredient(
    input_path: Path,
    output_path: Path,
    compressor_path: Path,
    name: str | None = None,
) -> tuple[str, list]:
    compressor = load_compressor(compressor_path)
    food = read_json(input_path)

    normalized = compressor.normalize_food(food)
    if normalized is None:
        raise ValueError(
            "The input does not contain a valid FoodData Central food record "
            "with an fdcId and description."
        )

    fdc_id, food_data = normalized

    if name is not None:
        name = name.strip()
        if not name:
            raise ValueError("The name override cannot be empty.")
        food_data[compressor.NAME] = name

    compressor.trim_trailing_nulls(food_data)

    if output_path.exists():
        custom_foods = read_json(output_path)
        if not isinstance(custom_foods, dict):
            raise ValueError(f"Existing output must contain a JSON object: {output_path}")
    else:
        custom_foods = {}

    custom_foods[fdc_id] = food_data
    write_json_atomically(output_path, custom_foods)
    return fdc_id, food_data


def parse_args() -> argparse.Namespace:
    script_directory = Path(__file__).resolve().parent
    parser = argparse.ArgumentParser(
        description=(
            "Compress one JSON record downloaded by fetch_ingredients.py and "
            "add it to custom.json."
        )
    )
    parser.add_argument("input", type=Path, help="Downloaded ingredient JSON file")
    parser.add_argument(
        "output",
        type=Path,
        nargs="?",
        default=script_directory / "custom.json",
        help="Custom JSON file to update (default: custom.json beside this script)",
    )
    parser.add_argument("--name", help="Replace USDA's description with this display name")
    parser.add_argument(
        "--compressor",
        type=Path,
        default=default_compressor_path(script_directory),
        help="Path to compressor.py",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    fdc_id, food_data = compress_ingredient(
        input_path=args.input.expanduser(),
        output_path=args.output.expanduser(),
        compressor_path=args.compressor.expanduser(),
        name=args.name,
    )

    print(f"Added FDC {fdc_id} to {args.output}")
    print(json.dumps({fdc_id: food_data}, ensure_ascii=False, separators=(",", ":")))


if __name__ == "__main__":
    name = "Puffed Rice"
    ingredient_path = Path(f"ingredient_data/{name}.json")
    output_path = Path("data/custom.json")
    compressor_path = Path("compressor.py")
    

    compress_ingredient(ingredient_path, output_path, compressor_path, name)
