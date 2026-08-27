import os
from enum import Enum
from pathlib import Path

import yaml
from dotenv import load_dotenv

load_dotenv()

class AppEnv(str, Enum):
    DEVELOPMENT = "development"
    PRODUCTION = "production"

app_env = AppEnv(os.getenv("APP_ENV"))

def load_config():

    config_path = Path(__file__).resolve().parents[1] / "config" / f"settings.{app_env.value}.yml"

    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    return config


def load_auxiliary_config():

    config_path = Path(__file__).resolve().parents[1] / "config" / f"auxiliary.{app_env.value}.yml"

    if not config_path.exists():
        raise FileNotFoundError(f"Config file not found: {config_path}")

    with open(config_path, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    return config
