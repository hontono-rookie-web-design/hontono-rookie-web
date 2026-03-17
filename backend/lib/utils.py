import yaml
from pathlib import Path


def load_config():

    config_path = Path(__file__).resolve().parents[1] / "config" / "settings.yml"

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    return config
